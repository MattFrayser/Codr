/**
 * Logging utilities for API routes
 *
 * Provides centralized error logging with structured data
 */

export interface ErrorLogData {
  timestamp: string;
  context: string;
  requestId?: string;
  error: {
    message: string;
    stack?: string;
    name: string;
  } | any;
}

/**
 * Log error with structured data
 *
 * @param error - Error object or any value to log
 * @param context - Context description (e.g., 'Request parsing', 'API call')
 * @param requestId - Optional request ID for tracing
 */
export function logError(error: any, context: string, requestId?: string): void {
  const errorData: ErrorLogData = {
    timestamp: new Date().toISOString(),
    context,
    requestId,
    error: error instanceof Error ? {
      message: error.message,
      stack: error.stack,
      name: error.name
    } : error
  };

  // In production, this would send to a logging service like Sentry, CloudWatch, etc.
  // For now, we log to console (can be enabled/disabled via env var)
  if (process.env.ENABLE_API_LOGGING === 'true') {
    console.error('[API_ERROR]', JSON.stringify(errorData, null, 2));
  }
}

/**
 * Generate unique request ID for tracing
 *
 * @returns Unique request ID string
 */
export function generateRequestId(): string {
  return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}
