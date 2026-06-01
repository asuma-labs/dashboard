import { useEffect, useRef, useState } from 'react';
import { WebSocketService } from '../services/websocket.service';

export const useWebSocket = (url: string = 'wss://bot.asuma.my.id/ws') => {
  const wsServiceRef = useRef<WebSocketService | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [lastMessage, setLastMessage] = useState<string | null>(null);

  useEffect(() => {
    wsServiceRef.current = new WebSocketService({
      url,
      onConnect: () => setIsConnected(true),
      onDisconnect: () => setIsConnected(false),
      onMessage: (event) => setLastMessage(event.data),
    });

    wsServiceRef.current.connect();

    return () => {
      if (wsServiceRef.current) {
        wsServiceRef.current.disconnect();
      }
    };
  }, [url]);

  const sendMessage = (data: string) => {
    if (wsServiceRef.current) {
      wsServiceRef.current.send(data);
    }
  };

  return { isConnected, lastMessage, sendMessage };
};
