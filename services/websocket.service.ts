import { WebSocketOptions } from '../types/websocket';

export class WebSocketService {
  private ws: WebSocket | null = null;
  private url: string;
  private options: WebSocketOptions;
  private reconnectAttempts = 0;
  private maxRetries: number;
  private reconnectTimeout: NodeJS.Timeout | null = null;
  private isIntentionalClose = false;

  constructor(options: WebSocketOptions) {
    this.url = options.url || 'wss://bot.asuma.my.id/ws';
    this.options = options;
    this.maxRetries = options.maxRetries || 5;
  }

  public connect(): void {
    if (this.ws && (this.ws.readyState === WebSocket.OPEN || this.ws.readyState === WebSocket.CONNECTING)) {
      return;
    }

    this.isIntentionalClose = false;
    this.ws = new WebSocket(this.url);

    this.ws.onopen = () => {
      this.reconnectAttempts = 0; // Reset retries on successful connection
      if (this.options.onConnect) this.options.onConnect();
    };

    this.ws.onmessage = (event: MessageEvent) => {
      if (this.options.onMessage) this.options.onMessage(event);
    };

    this.ws.onerror = (event: Event) => {
      if (this.options.onError) this.options.onError(event);
    };

    this.ws.onclose = () => {
      if (this.options.onDisconnect) this.options.onDisconnect();
      this.handleReconnect();
    };
  }

  private handleReconnect(): void {
    if (this.isIntentionalClose) return;

    if (this.reconnectAttempts < this.maxRetries) {
      const timeout = Math.pow(2, this.reconnectAttempts) * 1000;
      this.reconnectTimeout = setTimeout(() => {
        this.reconnectAttempts++;
        this.connect();
      }, timeout);
    } else {
      console.error('WebSocket maximum reconnect attempts reached.');
    }
  }

  public send(data: string | ArrayBuffer | Blob): void {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(data);
    } else {
      console.warn('WebSocket is not open. Unable to send data.');
    }
  }

  public disconnect(): void {
    this.isIntentionalClose = true;
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }
}
