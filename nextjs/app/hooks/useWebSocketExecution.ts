/**
 * WebSocket Code Execution Hook
 *
 * Handles real-time code execution with interactive input/output via WebSocket
 */

import { useState, useRef, useCallback } from 'react';
import { WebSocketClient } from '@/lib/api/websocket';
import { OutputLine } from '@/types/terminal';
import { createJob, JobApiError } from '@/lib/api/jobApi';

export interface UseWebSocketExecutionResult {
  outputLines: OutputLine[];
  isExecuting: boolean;
  execute: (code: string, language: string) => Promise<void>;
  sendInput: (input: string) => void;
  clearOutput: () => void;
}

export function useWebSocketExecution(): UseWebSocketExecutionResult {
  const [outputLines, setOutputLines] = useState<OutputLine[]>([]);
  const [isExecuting, setIsExecuting] = useState(false);
  const wsClient = useRef<WebSocketClient | null>(null);

  /**
   * Add output line to the display
   */
  const addOutputLine = useCallback((type: OutputLine['type'], content: string) => {
    setOutputLines(prev => [
      ...prev,
      { type, content, timestamp: Date.now() }
    ]);
  }, []);

  /**
   * Send user input to the running process
   */
  const sendInput = useCallback((input: string) => {
    if (wsClient.current?.isConnected) {
      wsClient.current.send('input', { data: input + '\n' });
      addOutputLine('input', input);
    }
  }, [addOutputLine]);

  /**
   * Execute code via WebSocket
   */
  const execute = useCallback(async (code: string, language: string): Promise<void> => {
    if (!code.trim()) {
      addOutputLine('system', 'Please enter some code');
      return;
    }

    // Clear previous output
    setOutputLines([]);
    setIsExecuting(true);

    try {
      // Step 1: Create job and get token
      console.log('Creating execution job...');

      let jobData;
      try {
        jobData = await createJob();
      } catch (error) {
        if (error instanceof JobApiError) {
          addOutputLine('stderr', `Failed to create job: ${error.message}`);
        } else {
          addOutputLine('stderr', 'Unexpected error creating job');
        }
        setIsExecuting(false);
        return;
      }

      const { job_id, job_token, expires_at } = jobData;
      console.log(`Job created: ${job_id}`);
      console.log(`Token expires: ${new Date(expires_at).toLocaleTimeString()}`);

      // Step 2: Connect to WebSocket
      console.log('Connecting to execution service...');

      const wsUrl = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:8000/ws/execute';
      const client = new WebSocketClient();
      wsClient.current = client;

      // Register handlers
      client.on('output', (data) => {
        addOutputLine(data.stream, data.data);
      });

      client.on('complete', (data) => {
        setIsExecuting(false);
        addOutputLine('system', `\nExecution completed in ${data.execution_time?.toFixed(3)}s (exit code: ${data.exit_code})`);
        client.disconnect();
      });

      client.on('error', (data) => {
        addOutputLine('stderr', `Error: ${data.message}`);
        setIsExecuting(false);
        client.disconnect();
      });

      // Connect and execute
      await client.connect(wsUrl);
      console.log('Connected! Authenticating and starting execution...');

      client.send('execute', { job_id, job_token, code, language });

    } catch (err: any) {
      addOutputLine('system', `Failed to connect: ${err.message}`);
      setIsExecuting(false);
    }
  }, [addOutputLine]);

  /**
   * Clear all output
   */
  const clearOutput = useCallback(() => {
    setOutputLines([]);
    if (wsClient.current) {
      wsClient.current.disconnect();
      wsClient.current = null;
    }
  }, []);

  return {
    outputLines,
    isExecuting,
    execute,
    sendInput,
    clearOutput
  };
}
