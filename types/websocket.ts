export interface WebSocketOptions {
  url: string;
  onMessage?: (event: MessageEvent) => void;
  onConnect?: () => void;
  onDisconnect?: () => void;
  onError?: (event: Event) => void;
  maxRetries?: number;
}
