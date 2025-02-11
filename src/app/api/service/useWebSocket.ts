// useWebSocket.ts
"use client";

import { useCallback, useEffect, useState } from "react"
import { getCookie } from './cookie'

export interface WebSocketMessage {
  [key: string]: any;
}

interface UseWebSocketReturn {
  isConnected: boolean;
  lastMessage: WebSocketMessage | null;
  sendMessage: (msg: WebSocketMessage) => void;
}

export function useWebSocket(url: string): UseWebSocketReturn {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [lastMessage, setLastMessage] = useState<WebSocketMessage | null>(null);

  useEffect(() => {
    const token = getCookie('access_token')
    if (!token) {
      console.warn("[useWebSocket] No access token found; continuing without auth token...");
    }

    console.log("[useWebSocket] Creating WebSocket connection to:", url);
    const ws = new WebSocket(url);

    ws.onopen = () => {
      console.log("[useWebSocket] WebSocket connected");
      setIsConnected(true);
      if (token) {
        const authMsg = { type: "auth", token };
        console.log("[useWebSocket] Sending auth message:", authMsg);
        ws.send(JSON.stringify(authMsg));
      }
    };

    ws.onmessage = (event) => {
      try {
        const parsed = JSON.parse(event.data);
        console.log("[useWebSocket] Raw WebSocket message:", parsed);
        setLastMessage(parsed);
      } catch (err) { 
        console.error("[useWebSocket] Error parsing WebSocket message:", err);
      }
    };

    ws.onclose = () => {
      console.log("[useWebSocket] WebSocket disconnected");
      setIsConnected(false);
    };

    setSocket(ws);
    return () => {
      console.log("[useWebSocket] Closing WebSocket");
      ws.close();
    };
  }, [url]);

  const sendMessage = useCallback(
    (msg: WebSocketMessage) => {
      if (!socket || !isConnected) {
        console.warn("[useWebSocket] Cannot send message, socket not connected");
        return;
      }
      console.log("[useWebSocket] Sending message:", msg);
      socket.send(JSON.stringify(msg));
    },
    [socket, isConnected]
  );

  return { isConnected, lastMessage, sendMessage };
}