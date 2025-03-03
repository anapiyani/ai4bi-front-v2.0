"use client"

import { ReactNode, createContext, useContext } from "react"
import { WebSocketMessage, useWebSocket } from "../service/useWebSocket"

interface WebSocketContextValue {
  isConnected: boolean
  lastMessage: WebSocketMessage | null
  sendMessage: (msg: WebSocketMessage) => void
}

const WebSocketContext = createContext<WebSocketContextValue | undefined>(undefined)

const WS_URL = process.env.NEXT_PUBLIC_WS_URL || "wss://staging.ai4bi.kz/ws/";

export function WebSocketProvider({ children }: { children: ReactNode }) {
  const { isConnected, lastMessage, sendMessage } = useWebSocket(WS_URL)

  return (
    <WebSocketContext.Provider value={{ isConnected, lastMessage, sendMessage }}>
      {children}
    </WebSocketContext.Provider>
  )
}

export function useWS() {
  const context = useContext(WebSocketContext)
  if (!context) {
    throw new Error("useWS hsould be used inside of: <WebSocketProvider />")
  }
  return context
}
