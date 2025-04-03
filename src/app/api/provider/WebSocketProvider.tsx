"use client"

import { type ReactNode, createContext, useContext, useEffect, useState } from "react"
import { type WebSocketMessage, useWebSocket } from "../service/useWebSocket"

interface WebSocketContextValue {
  isConnected: boolean
  lastMessage: WebSocketMessage | null
  sendMessage: (msg: WebSocketMessage) => void
  addListener: (listener: (msg: WebSocketMessage) => void) => void
  removeListener: (listener: (msg: WebSocketMessage) => void) => void
}

const WebSocketContext = createContext<WebSocketContextValue | undefined>(undefined)

const WS_URL = process.env.NEXT_PUBLIC_WS_URL || "wss://staging.ai4bi.kz/ws/"

export function WebSocketProvider({ children }: { children: ReactNode }) {
  const [connectionStatus, setConnectionStatus] = useState<string>("connecting")
  const { isConnected, lastMessage, sendMessage, addListener, removeListener } = useWebSocket(WS_URL)

  useEffect(() => {
    setConnectionStatus(isConnected ? "connected" : "disconnected")
  }, [isConnected])

  return (
      <WebSocketContext.Provider value={{ isConnected, lastMessage, sendMessage, addListener, removeListener }}>
        {process.env.NODE_ENV === "development" && (
            <div
                className="fixed bottom-2 right-2 z-50 px-2 py-1 text-xs rounded-full bg-opacity-80"
                style={{
                  backgroundColor: isConnected ? "rgba(0, 128, 0, 0.2)" : "rgba(255, 0, 0, 0.2)",
                  color: isConnected ? "green" : "red",
                  border: `1px solid ${isConnected ? "green" : "red"}`,
                }}
            >
              WS: {connectionStatus}
            </div>
        )}
        {children}
      </WebSocketContext.Provider>
  )
}

export function useWS(listener?: (msg: WebSocketMessage) => void) {
  const context = useContext(WebSocketContext)
  if (!context) {
    throw new Error("useWS should be used inside of <WebSocketProvider />")
  }

  useEffect(() => {
    if (listener) {
      context.addListener(listener)
      return () => {
        context.removeListener(listener)
      }
    }
  }, [listener, context])

  return context
}

