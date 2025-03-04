"use client";

import { useCallback, useEffect, useRef, useState } from "react"
import { getCookie } from "./cookie"

export interface WebSocketMessage {
  [key: string]: any;
}

interface UseWebSocketReturn {
  isConnected: boolean;
  lastMessage: WebSocketMessage | null;
  sendMessage: (msg: WebSocketMessage) => void;
  addListener: (listener: (msg: WebSocketMessage) => void) => void;
  removeListener: (listener: (msg: WebSocketMessage) => void) => void;
}

export function useWebSocket(url: string): UseWebSocketReturn {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [lastMessage, setLastMessage] = useState<WebSocketMessage | null>(null);
  const messageQueueRef = useRef<WebSocketMessage[]>([]);
  const processingRef = useRef(false);
  const listenersRef = useRef<Array<(msg: WebSocketMessage) => void>>([]);

  const addListener = useCallback((listener: (msg: WebSocketMessage) => void) => {
    listenersRef.current.push(listener);
  }, []);

  const removeListener = useCallback((listener: (msg: WebSocketMessage) => void) => {
    listenersRef.current = listenersRef.current.filter(l => l !== listener);
  }, []);

  const processMessageQueue = useCallback(() => {
    if (processingRef.current || messageQueueRef.current.length === 0) return;
    if (messageQueueRef.current.length >= 1) {
      console.log("Queue length:", messageQueueRef.current.length);
    }
    processingRef.current = true;
    const message = messageQueueRef.current.shift();
    if (message) {
      if (listenersRef.current.length > 0) {
        console.log("begin --------------------");
        listenersRef.current.forEach(listener => listener(message));
        console.log("------------------------ end");
      }
      // Fallback value, do not trust
      setLastMessage(message);

    }
    setTimeout(() => {
      processingRef.current = false;
      processMessageQueue();
    }, 0);
  }, []);

  useEffect(() => {
    const token = getCookie("access_token");
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
        messageQueueRef.current.push(parsed);
        processMessageQueue();
      } catch (err) {
        console.error("[useWebSocket] Error parsing WebSocket message:", err);
      }
    };

    ws.onclose = () => {
      console.log("[useWebSocket] WebSocket disconnected");
      setIsConnected(false);
      // Clear message queue on disconnect
      messageQueueRef.current = [];
      processingRef.current = false;
    };

    setSocket(ws);
    return () => {
      console.log("[useWebSocket] Closing WebSocket");
      ws.close();
      messageQueueRef.current = [];
      processingRef.current = false;
    };
  }, [url, processMessageQueue]);

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

  return { isConnected, lastMessage, sendMessage, addListener, removeListener };
}

