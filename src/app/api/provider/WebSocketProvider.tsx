"use client";

import { ReactNode, createContext, useContext, useEffect } from "react";
import { WebSocketMessage, useWebSocket } from "../service/useWebSocket";

interface WebSocketContextValue {
  isConnected: boolean;
  lastMessage: WebSocketMessage | null;
  sendMessage: (msg: WebSocketMessage) => void;
  addListener: (listener: (msg: WebSocketMessage) => void) => void;
  removeListener: (listener: (msg: WebSocketMessage) => void) => void;
}

const WebSocketContext = createContext<WebSocketContextValue | undefined>(undefined);

const WS_URL = process.env.NEXT_PUBLIC_WS_URL || "wss://staging.ai4bi.kz/ws/";

export function WebSocketProvider({ children }: { children: ReactNode }) {
  const { isConnected, lastMessage, sendMessage, addListener, removeListener } = useWebSocket(WS_URL);

  return (
    <WebSocketContext.Provider
      value={{ isConnected, lastMessage, sendMessage, addListener, removeListener }}
    >
      {children}
    </WebSocketContext.Provider>
  );
}

export function useWS(listener?: (msg: WebSocketMessage) => void) {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error("useWS should be used inside of <WebSocketProvider />");
  }
  useEffect(() => {
    if (listener) {
      context.addListener(listener);
      return () => {
        context.removeListener(listener);
      };
    }
  }, [listener, context]);
  return context;
}