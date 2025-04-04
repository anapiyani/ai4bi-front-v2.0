"use client"

import { type ReactNode, createContext, useContext, useEffect, useState } from "react"
import { type WebSocketMessage, useWebSocket } from "../service/useWebSocket"
import {Button} from "@/components/ui/button";
import {useMutation} from "@tanstack/react-query";

interface WebSocketContextValue {
  isConnected: boolean
  lastMessage: WebSocketMessage | null
  sendMessage: (msg: WebSocketMessage) => void
  addListener: (listener: (msg: WebSocketMessage) => void) => void
  removeListener: (listener: (msg: WebSocketMessage) => void) => void
}

// const createNewAuction = (id: string) => post(`/test/create_auction_via_fsm?portal_id=${id}`)
// const useCreateAuction = () => {
//   useMutation({
//     mutationFn: createNewAuction,
//     onSuccess: () => {
//     }
//   })
// }

const WebSocketContext = createContext<WebSocketContextValue | undefined>(undefined)

const WS_URL = process.env.NEXT_PUBLIC_WS_URL || "wss://staging.ai4bi.kz/ws/"

export function WebSocketProvider({ children }: { children: ReactNode }) {
  const [connectionStatus, setConnectionStatus] = useState<string>("connecting")
  const { isConnected, lastMessage, sendMessage, addListener, removeListener } = useWebSocket(WS_URL)

  useEffect(() => {
    setConnectionStatus(isConnected ? "connected" : "disconnected")
  }, [isConnected])

  const createNewAuction = () => {
    const portal_id = prompt("Enter portal id: ")

  }

  return (
      <WebSocketContext.Provider value={{ isConnected, lastMessage, sendMessage, addListener, removeListener }}>
        {process.env.NODE_ENV === "development" && (
            <div
                className="fixed top-1 left-2 z-50 px-2 py-1 text-xs rounded-full bg-opacity-80"
                style={{
                  backgroundColor: isConnected ? "rgba(0, 128, 0, 0.2)" : "rgba(255, 0, 0, 0.2)",
                  color: isConnected ? "green" : "red",
                  border: `1px solid ${isConnected ? "green" : "red"}`,
                }}
            >
              WS: {connectionStatus}
              {/*test for creating chats*/}
              <Button onClick={createNewAuction} variant={"ghost"} className={"rounded-xl hover:text-primary hover:bg-transparent py-0 h-full m-0"}>+</Button>
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

