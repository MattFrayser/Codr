"""
Job Service - Manages job lifecycle

Handles creation, retrieval, and status updates for code execution jobs.
Uses Redis Streams for job queue and Redis Hash for job metadata.
"""

import uuid
import time
import json
import redis.asyncio as aioredis
from typing import Optional
from ..models.schema import JobResult
from config.settings import get_settings


class JobService:
    """
    Manages the complete lifecycle of code execution jobs

    Responsibilities:
    - Create new jobs with unique IDs
    - Track job status (queued → processing → completed/failed)
    - Store and retrieve execution results
    - Provide job metadata

    Architecture:
    - Redis Hash: Job metadata storage (job:{job_id})
    """

    def __init__(self, redis_client: aioredis.Redis):
        """
        Initialize job service

        Args:
            redis_client: Redis client instance
        """
        self.redis = redis_client
        self.settings = get_settings()

    def _job_key(self, job_id: str) -> str:
        """Generate Redis hash key for job metadata"""
        return f"job:{job_id}"

    async def create_job(self, code: str, language: str, filename: str) -> str:
        """
        Create a new job

        Args:
            code: Source code to execute
            language: Programming language
            filename: File name with extension

        Returns:
            Job ID (UUID)
        """
        # Generate unique job ID
        job_id = str(uuid.uuid4())
        created_at = str(time.time())

        # Prepare job metadata for Hash storage
        job_data = {
            "job_id": job_id,
            "code": code,
            "language": language,
            "filename": filename,
            "status": "queued",
            "created_at": created_at
        }

        # Store metadata in Redis Hash
        job_key = self._job_key(job_id)
        await self.redis.hset(job_key, mapping=job_data)

        # Set TTL on job metadata
        await self.redis.expire(job_key, self.settings.redis_ttl)

        return job_id

    async def get_job(self, job_id: str) -> Optional[JobResult]:
        """
        Retrieve job data

        Args:
            job_id: Job identifier

        Returns:
            JobResult model or None if not found
        """
        job_key = self._job_key(job_id)
        job_data = await self.redis.hgetall(job_key)

        if not job_data:
            return None

        # Parse result if it exists
        result = job_data.get('result')
        if result:
            try:
                job_data['result'] = json.loads(result)
            except (json.JSONDecodeError, TypeError):
                pass

        # Convert to Pydantic model
        return JobResult(**job_data)

    async def mark_processing(self, job_id: str) -> None:
        """
        Mark job as currently processing

        Args:
            job_id: Job identifier
        """
        job_key = self._job_key(job_id)
        await self.redis.hset(job_key, "status", "processing")

    async def mark_completed(self, job_id: str, result: dict) -> None:
        """
        Mark job as completed with results

        Args:
            job_id: Job identifier
            result: Execution result dictionary
        """
        job_key = self._job_key(job_id)
        completed_at = str(time.time())

        # Update multiple fields atomically using pipeline
        pipe = self.redis.pipeline()
        pipe.hset(job_key, "result", json.dumps(result))
        pipe.hset(job_key, "status", "completed")
        pipe.hset(job_key, "completed_at", completed_at)
        await pipe.execute()

    async def mark_failed(self, job_id: str, error: str, result: dict = None) -> None:
        """
        Mark job as failed with error message

        Args:
            job_id: Job identifier
            error: Error message
            result: Optional partial result data
        """
        job_key = self._job_key(job_id)

        # Update multiple fields atomically using pipeline
        pipe = self.redis.pipeline()
        pipe.hset(job_key, "error", error)
        pipe.hset(job_key, "status", "failed")

        if result:
            pipe.hset(job_key, "result", json.dumps(result))

        await pipe.execute()

    async def job_exists(self, job_id: str) -> bool:
        """
        Check if job exists

        Args:
            job_id: Job identifier

        Returns:
            True if job exists, False otherwise
        """
        job_key = self._job_key(job_id)
        return await self.redis.exists(job_key) > 0

    async def get_job_status(self, job_id: str) -> Optional[str]:
        """
        Get current job status

        Args:
            job_id: Job identifier

        Returns:
            Status string (queued, processing, completed, failed) or None
        """
        job_key = self._job_key(job_id)
        status = await self.redis.hget(job_key, "status")

        return status if status else None
