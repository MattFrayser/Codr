export interface CreateJobResponse {
  job_id: string;
  job_token: string;
  expires_at: string;
}
 
export type WebSocketMessageType =
  | 'execute'
  | 'input'
  | 'output'
  | 'complete'
  | 'error';
 
export interface WebSocketOutputMessage {
  type: 'output';
  stream: 'stdout' | 'stderr';
  data: string;
}
 
export interface WebSocketCompleteMessage {
  type: 'complete';
  exit_code: number;
  execution_time: number;
}
 
export interface WebSocketErrorMessage {
  type: 'error';
  message: string;
}
 
export type WebSocketMessage =
  | WebSocketOutputMessage
  | WebSocketCompleteMessage
  | WebSocketErrorMessage;
