/**
 * API client for job management.
 *
 * This client calls the Next.js API route which proxies to the backend.
 * The API key is never exposed to the browser - it stays server-side.
 */

export interface CreateJobResponse {
  job_id: string;
  job_token: string;
  expires_at: string;
}

export class JobApiError extends Error {
  constructor(
    message: string,
    public statusCode?: number
  ) {
    super(message);
    this.name = 'JobApiError';
  }
}

/**
 * Create a new code execution job.
 *
 * Calls the Next.js API route which securely proxies the request
 * to the backend with the API key. The frontend never knows the API key.
 *
 * @returns Job data including job_id and short-lived job_token
 * @throws JobApiError if the request fails
 */
export async function createJob(): Promise<CreateJobResponse> {
  try {
    // Call Next.js API route (which proxies to backend with API key)
    const response = await fetch('/api/jobs/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      let errorMessage = 'Failed to create job';
      try {
        const error = await response.json();
        errorMessage = error.detail || error.message || errorMessage;
      } catch {
        // If response is not JSON, use status text
        errorMessage = response.statusText || errorMessage;
      }

      throw new JobApiError(errorMessage, response.status);
    }

    const data = await response.json();

    // Validate response structure
    if (!data.job_id || !data.job_token || !data.expires_at) {
      throw new JobApiError('Invalid response from server');
    }

    return data;
  } catch (error) {
    if (error instanceof JobApiError) {
      throw error;
    }
    // Network or other errors
    throw new JobApiError('Network error: ' + (error as Error).message);
  }
}
