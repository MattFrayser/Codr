import { WebSocketMessage } from '@/types';
 
export class WebSocketClient {
  private ws: WebSocket | null = null;
  private messageHandlers = new Map<string, (data: any) => void>();
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 3;
 
  /**
   * Connect to WebSocket server
   */
  async connect(url: string): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        this.ws = new WebSocket(url);
 
        this.ws.onopen = () => {
          console.log('WebSocket connected');
          this.reconnectAttempts = 0;
          resolve();
        };
 
        this.ws.onerror = (error) => {
          console.error('WebSocket error:', error);
          reject(error);
        };
 
        this.ws.onmessage = (event) => {
          this.handleMessage(event);
        };
 
        this.ws.onclose = () => {
          console.log('WebSocket disconnected');
          this.attemptReconnect(url);
        };
      } catch (error) {
        reject(error);
      }
    });
  }
 
  /**
   * Register message handler for specific message type
   */
  on(messageType: string, handler: (data: any) => void): void {
    this.messageHandlers.set(messageType, handler);
  }
 
  /**
   * Remove message handler
   */
  off(messageType: string): void {
    this.messageHandlers.delete(messageType);
  }
 
  /**
   * Send message to server
   */
  send(type: string, data: Record<string, any>): void {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({ type, ...data }));
    } else {
      console.warn('WebSocket not connected, cannot send message');
    }
  }
 
  /**
   * Close connection
   */
  disconnect(): void {
    this.messageHandlers.clear();
    this.ws?.close();
    this.ws = null;
  }
 
  /**
   * Get connection state
   */
  get isConnected(): boolean {
    return this.ws?.readyState === WebSocket.OPEN;
  }
 
  private handleMessage(event: MessageEvent): void {
    try {
      const message: WebSocketMessage = JSON.parse(event.data);
      const handler = this.messageHandlers.get(message.type);
 
      if (handler) {
        handler(message);
      } else {
        console.warn('No handler for message type:', message.type);
      }
    } catch (error) {
      console.error('Failed to parse WebSocket message:', error);
    }
  }
 
  private attemptReconnect(url: string): void {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      console.log(`Attempting reconnect ${this.reconnectAttempts}/${this.maxReconnectAttempts}`);
 
      setTimeout(() => {
        this.connect(url).catch(console.error);
      }, 1000 * this.reconnectAttempts); // Exponential backoff
    }
  }
}
