"""
Execution Service - Handles code execution

Manages the execution of user-submitted code using language-specific executors.
"""

import asyncio
from typing import Dict, Any
from .job_service import JobService
from .pubsub_service import get_pubsub_service

from executors import get_executor
from logger.logger import log


class ExecutionService:
    """
    Manages code execution using language-specific executors

    Responsibilities:
    - Retrieve executor for specified language
    - Execute code in sandbox
    - Handle execution errors
    - Update job status through JobService
    """

    def __init__(self, job_service: JobService):
        """
        Initialize execution service

        Args:
            job_service: JobService instance for updating job status
        """
        self.job_service = job_service

    async def execute_job_streaming(self, job_id: str, async_input_queue: asyncio.Queue) -> None:
        """
        Execute a job with PTY streaming - industry standard approach

        This method uses bidirectional streaming:
        - PTY output → WebSocket (via callback)
        - WebSocket input → PTY (via queue)

        Args:
            job_id: Job identifier
            async_input_queue: asyncio.Queue for receiving user input from WebSocket
        """
        import queue

        try:
            # Fetch job data
            job = await self.job_service.get_job(job_id)

            if not job:
                log.error(f"Job {job_id} not found in storage")
                await get_pubsub_service().publish_error(job_id, "Job not found")
                return

            # Mark as processing
            await self.job_service.mark_processing(job_id)

            # Get executor for language
            executor = await asyncio.to_thread(get_executor, job.language)

            # Get event loop for scheduling coroutines from sync context
            loop = asyncio.get_event_loop()

            # Create thread-safe queue for sync executor
            sync_input_queue = queue.Queue()

            # Bridge: asyncio.Queue → queue.Queue
            async def bridge_input():
                """Transfer items from async queue to sync queue"""
                try:
                    while True:
                        item = await async_input_queue.get()
                        sync_input_queue.put(item)
                except asyncio.CancelledError:
                    pass

            # Start bridge task
            bridge_task = asyncio.create_task(bridge_input())

            # Define output callback - streams PTY output to WebSocket
            def on_output(data: bytes):
                """Called when PTY produces output - send to WebSocket"""
                # Schedule coroutine on the event loop
                asyncio.run_coroutine_threadsafe(
                    get_pubsub_service().publish_output(
                        job_id,
                        "stdout",  # All PTY output goes to stdout stream
                        data.decode('utf-8', errors='replace')
                    ),
                    loop
                )

            # Execute code with streaming in thread pool
            log.info(f"Starting PTY streaming execution for job {job_id}")
            result = await asyncio.to_thread(
                executor.execute,
                code=job.code,
                filename=job.filename,
                on_output=on_output,
                input_queue=sync_input_queue  # Pass thread-safe queue
            )
            log.info(f"PTY streaming execution completed for job {job_id}: {result}")

            # Stop bridge task
            bridge_task.cancel()

            # Store result
            await self.job_service.mark_completed(job_id, result)

            # Publish completion
            await get_pubsub_service().publish_complete(
                job_id,
                result["exit_code"],
                result["execution_time"]
            )

            log.info(f"Streaming job {job_id} completed successfully")

        except Exception as e:
            log.error(f"Streaming job {job_id} failed: {str(e)}")
            import traceback
            traceback.print_exc()

            # Sanitize error message
            from config.settings import get_settings
            settings = get_settings()

            if settings.env == "development":
                error_message = str(e)
            else:
                error_message = "Execution failed"

            # Create error result
            error_result = {
                "success": False,
                "stdout": "",
                "stderr": error_message,
                "exit_code": -1,
                "execution_time": 0
            }

            # Mark as failed
            await self.job_service.mark_failed(job_id, error_message, error_result)

            # Publish error
            await get_pubsub_service().publish_error(job_id, error_message)
