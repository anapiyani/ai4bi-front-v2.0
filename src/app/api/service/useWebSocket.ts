"use client"

import { useRouter } from "next/navigation"
import { useCallback, useEffect, useRef, useState } from "react"
import { getCookie } from "./cookie"

export interface WebSocketMessage {
  [key: string]: any
}

interface UseWebSocketReturn {
  isConnected: boolean
  lastMessage: WebSocketMessage | null
  sendMessage: (msg: WebSocketMessage) => void
  addListener: (listener: (msg: WebSocketMessage) => void) => void
  removeListener: (listener: (msg: WebSocketMessage) => void) => void
}

export function useWebSocket(url: string): UseWebSocketReturn {
  const [socket, setSocket] = useState<WebSocket | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [lastMessage, setLastMessage] = useState<WebSocketMessage | null>(null)
  const messageQueueRef = useRef<WebSocketMessage[]>([])
  const processingRef = useRef(false)
  const listenersRef = useRef<Array<(msg: WebSocketMessage) => void>>([])
  const router = useRouter()
  const [token, setToken] = useState<string | null>(null)
  const [tokenChecked, setTokenChecked] = useState(false)
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const reconnectAttemptsRef = useRef(0)
  const MAX_RECONNECT_ATTEMPTS = 5
  const RECONNECT_DELAY = 3000 // 3 seconds
  const outgoingMessagesQueueRef = useRef<WebSocketMessage[]>([])

  const addListener = useCallback((listener: (msg: WebSocketMessage) => void) => {
    listenersRef.current.push(listener)
  }, [])

  const removeListener = useCallback((listener: (msg: WebSocketMessage) => void) => {
    listenersRef.current = listenersRef.current.filter((l) => l !== listener)
  }, [])

  const processMessageQueue = useCallback(() => {
    if (processingRef.current || messageQueueRef.current.length === 0) return
    processingRef.current = true
    const message = messageQueueRef.current.shift()
    if (message) {
      if (listenersRef.current.length > 0) {
        listenersRef.current.forEach((listener) => listener(message))
      }
      setLastMessage(message)
    }
    setTimeout(() => {
      processingRef.current = false
      processMessageQueue()
    }, 0)
  }, [])

  // Process outgoing message queue when connection is established
  const processOutgoingQueue = useCallback(() => {
    if (!socket || !isConnected || outgoingMessagesQueueRef.current.length === 0) return

    console.log(`[useWebSocket] Processing ${outgoingMessagesQueueRef.current.length} queued messages`)

    while (outgoingMessagesQueueRef.current.length > 0) {
      const msg = outgoingMessagesQueueRef.current.shift()
      if (msg) {
        try {
          socket.send(JSON.stringify(msg))
        } catch (err) {
          console.error("[useWebSocket] Error sending queued message:", err)
          // Put the message back at the front of the queue
          outgoingMessagesQueueRef.current.unshift(msg)
          break
        }
      }
    }
  }, [socket, isConnected])

  useEffect(() => {
    if (isConnected) {
      processOutgoingQueue()
    }
  }, [isConnected, processOutgoingQueue])

  useEffect(() => {
    const checkToken = () => {
      const accessToken = getCookie("access_token")
      if (accessToken) {
        setToken(accessToken)
        setTokenChecked(true)
      } else {
        setTimeout(checkToken, 500)
      }
    }

    checkToken()
  }, [])

  const setupWebSocket = useCallback(() => {
    if (!token) return null

    console.log("[useWebSocket] Creating WebSocket connection to:", url)
    const ws = new WebSocket(url)

    // Set a connection timeout
    const connectionTimeout = setTimeout(() => {
      if (ws.readyState !== WebSocket.OPEN) {
        console.error("[useWebSocket] Connection timeout")
        ws.close()
      }
    }, 10000) // 10 seconds timeout

    ws.onopen = () => {
      console.info("[useWebSocket] WebSocket connected")
      clearTimeout(connectionTimeout)
      reconnectAttemptsRef.current = 0
      setIsConnected(true)

      try {
        if (token) {
          const authMsg = { type: "auth", token }
          console.info("[useWebSocket] Sending auth message")
          ws.send(JSON.stringify(authMsg))
        }
      } catch (err) {
        console.error("[useWebSocket] Error sending auth message:", err)
      }
    }

    ws.onmessage = (event) => {
      try {
        const parsed = JSON.parse(event.data)
        console.log("[useWebSocket] Received message:", parsed)
        messageQueueRef.current.push(parsed)
        processMessageQueue()
      } catch (err) {
        console.error("[useWebSocket] Error parsing WebSocket message:", err)
      }
    }

    ws.onerror = (error) => {
      console.error("[useWebSocket] WebSocket error:", error)
    }

    ws.onclose = (event) => {
      console.log(`[useWebSocket] WebSocket disconnected: ${event.code} - ${event.reason}`)
      clearTimeout(connectionTimeout)
      setIsConnected(false)

      // Attempt to reconnect unless this was a clean close
      if (event.code !== 1000 && reconnectAttemptsRef.current < MAX_RECONNECT_ATTEMPTS) {
        reconnectAttemptsRef.current++
        const delay = RECONNECT_DELAY * reconnectAttemptsRef.current
        console.log(
            `[useWebSocket] Attempting to reconnect in ${delay}ms (attempt ${reconnectAttemptsRef.current}/${MAX_RECONNECT_ATTEMPTS})`,
        )

        if (reconnectTimeoutRef.current) {
          clearTimeout(reconnectTimeoutRef.current)
        }

        reconnectTimeoutRef.current = setTimeout(() => {
          if (token) {
            const newWs = setupWebSocket()
            if (newWs) setSocket(newWs)
          }
        }, delay)
      } else if (event.code !== 1000) {
        console.error("[useWebSocket] Max reconnection attempts reached or clean close")
      }
    }

    return ws
  }, [url, token, processMessageQueue])

  useEffect(() => {
    if (!tokenChecked) return

    if (!token) {
      router.replace("/login")
      return
    }

    const ws = setupWebSocket()
    if (ws) setSocket(ws)

    return () => {
      console.log("[useWebSocket] Cleaning up WebSocket connection")
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current)
        reconnectTimeoutRef.current = null
      }

      if (ws) {
        // Use a clean close
        ws.close(1000, "Component unmounting")
      }

      messageQueueRef.current = []
      processingRef.current = false
    }
  }, [tokenChecked, token, router, setupWebSocket])

  const sendMessage = useCallback(
      (msg: WebSocketMessage) => {
        if (!socket || socket.readyState !== WebSocket.OPEN) {
          console.warn("[useWebSocket] Socket not connected, queueing message")
          outgoingMessagesQueueRef.current.push(msg)
          return
        }

        try {
          socket.send(JSON.stringify(msg))
        } catch (err) {
          console.error("[useWebSocket] Error sending message:", err)
          outgoingMessagesQueueRef.current.push(msg)
        }
      },
      [socket],
  )

  return { isConnected, lastMessage, sendMessage, addListener, removeListener }
}

