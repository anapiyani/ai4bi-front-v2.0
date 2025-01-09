"use client";

import { useWebSocket } from "@/src/app/api/service/useWebSocket"; // Adjust import path
import { useEffect, useRef, useState } from "react"

// UI components (replace with your own or remove)
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import dayjs from "dayjs"
import { MessageCircle, Search, Send, UserPlus } from "lucide-react"

interface Conversation {
  id: string;
  name: string;
  lastMessage: string;
}

interface ChatMessage {
  id: string;
  sender: string;
  content: string;
  timestamp: string;
  pending?: boolean;
  authorId?: string;
  chat_id?: string;
}

// Point this to your actual server
const WS_URL = "ws://cattle-giving-commonly.ngrok-free.app/ws/";

export default function WebSocketChat() {
  const { sendMessage, isConnected, lastMessage } = useWebSocket(WS_URL);

  const [currentUser, setCurrentUser] = useState<string | null>(null);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  // ------------------------------------------------
  // Initialize currentUser from localStorage
  // ------------------------------------------------
  useEffect(() => {
    const userId = localStorage.getItem("user_id");
    if (userId) {
      setCurrentUser(userId);
    }
  }, []);

  // ------------------------------------------------
  // Subscribe to chat_updates once connected
  // ------------------------------------------------
  useEffect(() => {
    if (isConnected) {
      console.log("[WebSocketChat] Subscribing to chat_updates...");
      sendMessage({ type: "subscribe", channel: "chat_updates" });
    }
  }, [isConnected, sendMessage]);

  // ------------------------------------------------
  // Whenever we get a new lastMessage, handle it
  // ------------------------------------------------
  useEffect(() => {
    if (!lastMessage) return;
    handleWebSocketMessage(lastMessage);
  }, [lastMessage]);

  // ------------------------------------------------
  // handleWebSocketMessage
  // ------------------------------------------------
  const handleWebSocketMessage = (rawMsg: any) => {
    // First, ensure it's an object
    let message: any;
    if (typeof rawMsg === "string") {
      try {
        message = JSON.parse(rawMsg);
      } catch (err) {
        console.error("[handleWebSocketMessage] Could not parse raw string:", err, rawMsg);
        return;
      }
    } else {
      message = rawMsg;
    }

    console.log("[handleWebSocketMessage] Final message object:", message);

    // (A) If it's JSON-RPC
    if (message.jsonrpc === "2.0" && message.result) {
      if (message.result.chat_id) {
        // Means we created or got a new chat
        handleChatCreated(message.result);
      } else if (message.result.message_id) {
        // Means we got a new message from a sendMessage response
        handleMessageReceived(message.result);
      }
      return;
    }

    // (B) If it's a "subscribe" or "auth" confirmation
    if (message.type === "auth" || message.type === "subscribe") {
      console.log("[handleWebSocketMessage] Auth/Subscribe message, ignoring:", message);
      return;
    }

    // (C) If it's a "message" type, then check the event
    if (message.type === "message") {
      if (message.event === "new_chat") {
        // A brand new chat
        const chatData = message.data; 
        handleChatCreated({
          chat_id: chatData.id,
          name: chatData.user?.name || `Chat with ${chatData.id}`,
        });
      } 
      else if (message.event === "new_message") {
        // Distinguish by channel
        const msgData = message.data.message;
        const chatId = message.chat_id || message.data.chat_id;

        // Check if channel is "chat_room.*" or "chat_updates.*"
        if (message.channel?.startsWith("chat_room")) {
          // Show message in the chat window
          const formattedMessage = {
            message_id: `${msgData.counter}-${msgData.timestamp}-${Math.random()}`,
            chat_id: chatId,
            sender: msgData.author.id === currentUser ? "You" : msgData.author.name,
            content: msgData.content,
            timestamp: msgData.timestamp || dayjs().toISOString(),
            authorId: msgData.author.id
          };
          handleMessageReceived(formattedMessage);
        } 
        else if (message.channel?.startsWith("chat_updates")) {
          // Only update the conversation list (lastMessage)
          setConversations((prev) =>
            prev.map((c) => {
              if (c.id === chatId) {
                return { ...c, lastMessage: msgData.content };
              }
              return c;
            })
          );
        }
      } 
      else {
        console.log("[handleWebSocketMessage] Unhandled message event:", message);
      }
      return;
    }

    // (D) If type === "message_received", "message_deleted", etc. (other events)
    if (message.type === "message_received") {
      console.log("[handleWebSocketMessage] message_received ack:", message);
      return;
    }

    // (E) Fallback
    console.log("[handleWebSocketMessage] Unhandled message:", message);
  };

  // ------------------------------------------------
  // handleChatCreated
  // ------------------------------------------------
  const handleChatCreated = (data: any) => {
    console.log("[handleChatCreated] Chat created:", data);
    const newChat: Conversation = {
      id: data.chat_id,
      name: data.name || `Chat with ${data.chat_id}`,
      lastMessage: "",
    };

    setConversations((prev) => {
      // If it already exists, do nothing
      if (!prev.find((c) => c.id === newChat.id)) {
        const updated = [...prev, newChat];
        console.log("[handleChatCreated] Updated conversations:", updated);
        return updated;
      }
      return prev;
    });

    // Optionally auto-select the new chat
    setSelectedConversation(data.chat_id);

    // Optionally also subscribe to the "chat_room"
    subscribeToChatRoom(data.chat_id);
  };

  // ------------------------------------------------
  // handleMessageReceived
  // ------------------------------------------------
  const handleMessageReceived = (msg: any) => {
    // Convert to local shape
    const newMsg: ChatMessage = {
      id: msg.message_id + '-' + msg.timestamp + '-' + Math.random(),
      sender: msg.sender,
      content: msg.content,
      timestamp: msg.timestamp,
      authorId: msg.authorId,
      chat_id: msg.chat_id,
    };

    setMessages((prev) => {
      // Remove any pending messages with the same content
      const filtered = prev.filter((m) => !(m.pending && m.content === msg.content));
      return [...filtered, newMsg];
    });

    // Update lastMessage in the conversation list
    setConversations((prev) =>
      prev.map((c) => {
        if (c.id === msg.chat_id) {
          return { ...c, lastMessage: msg.content };
        }
        return c;
      })
    );
  };

  // ------------------------------------------------
  // subscribeToChatRoom
  // ------------------------------------------------
  const subscribeToChatRoom = (chatId: string) => {
    console.log("[subscribeToChatRoom] Subscribing to chat room:", chatId);
    sendMessage({
      type: "subscribe",
      channel: "chat_room",
      chat_id: chatId,
    });
  };

  // ------------------------------------------------
  // createPrivateChat (JSON-RPC request)
  // ------------------------------------------------
  const createPrivateChat = (userId: string) => {
    const rpcId = Date.now().toString();
    const request = {
      jsonrpc: "2.0",
      method: "createPrivateChat",
      params: { user_id: userId },
      id: rpcId,
    };
    sendMessage(request);
  };

  // ------------------------------------------------
  // sendChatMessage
  // ------------------------------------------------
  const sendChatMessage = () => {
    if (!selectedConversation || !newMessage.trim()) return;
    const rpcId = Date.now().toString();
    const content = newMessage.trim();

    // Add pending message to local state
    const pendingMsg: ChatMessage = {
      id: rpcId,
      sender: "You",
      content,
      timestamp: dayjs().toISOString(),
      pending: true,
      chat_id: selectedConversation,
    };
    setMessages((prev) => {
      const deduped = prev.filter((m) => !(m.pending && m.content === content));
      return [...deduped, pendingMsg];
    });

    // Send JSON-RPC request
    sendMessage({
      jsonrpc: "2.0",
      method: "sendMessage",
      params: {
        chat_id: selectedConversation,
        content,
        media: [],
        timestamp: dayjs().toISOString(),
      },
      id: rpcId,
    });

    // Clear input
    setNewMessage("");
  };

  // If the user selects a conversation from the left sidebar,
  // subscribe to that chat room as well
  useEffect(() => {
    if (selectedConversation) {
      console.log("[WebSocketChat] setSelectedConversation =>", selectedConversation);
      subscribeToChatRoom(selectedConversation);
    }
  }, [selectedConversation]);

  useEffect(() => {
    const scrollTimeout = setTimeout(() => {
      if (scrollRef.current) {
        scrollRef.current.scrollTo({
          top: scrollRef.current.scrollHeight,
          behavior: 'smooth',
        });
      }
    }, 100);
  
    return () => clearTimeout(scrollTimeout);
  }, [messages, selectedConversation]);
  

  // -------------------------------------------
  // Render UI
  // -------------------------------------------
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Left side: list of conversations */}
      <Card className="w-80 h-full rounded-none border-r">
        <CardHeader className="p-4">
          <CardTitle className="text-xl font-bold">Chats</CardTitle>
          <div className="relative mt-2">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search conversations" className="pl-8" />
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <ScrollArea className="h-[calc(100vh-180px)]">
            {conversations.map((conv) => (
              <Button
                key={conv.id}
                variant="ghost"
                className={`w-full justify-start px-4 py-3 ${
                  selectedConversation === conv.id ? "bg-muted" : ""
                }`}
                onClick={() => setSelectedConversation(conv.id)}
              >
                <div className="flex flex-col items-start">
                  <span className="font-semibold">{conv.name}</span>
                  <span className="text-sm text-muted-foreground">
                    {conv.lastMessage}
                  </span>
                </div>
              </Button>
            ))}
          </ScrollArea>
        </CardContent>
        <CardFooter className="p-4">
          <Button
            variant="outline"
            className="w-full"
            onClick={() => {
              const userId = prompt("Enter user ID to create private chat with:");
              if (userId) createPrivateChat(userId);
            }}
          >
            <UserPlus className="mr-2 h-4 w-4" />
            New Chat
          </Button>
        </CardFooter>
      </Card>

      {/* Right side: messages in selected conversation */}
      <Card className="flex-1 rounded-none">
        {selectedConversation ? (
          <>
            <CardHeader className="border-b p-4">
              <CardTitle className="text-xl font-bold">
                {conversations.find((c) => c.id === selectedConversation)?.name}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
            <div
                ref={scrollRef}
                className="h-[calc(100vh-220px)] overflow-y-auto"
              >
                {messages
                  .filter((m) => m.chat_id === selectedConversation)
                  .map((m) => (
                    <div
                      key={`${m.id}`}
                      className={`flex mb-4 ${
                        m.sender === "You" ? "justify-end" : "justify-start"
                      }`}
                    >
                      <div
                        className={`rounded-lg p-2 max-w-[70%] ${
                          m.sender === "You"
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted"
                        } ${m.pending ? "opacity-50" : ""}`}
                      >
                        <p>{m.content}</p>
                        <span className="text-xs text-muted-foreground block mt-1">
                          {dayjs(m.timestamp).isValid()
                            ? dayjs(m.timestamp).format("HH:mm")
                            : "Now"}
                        </span>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
            <CardFooter className="border-t p-4">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  sendChatMessage();
                }}
                className="flex w-full items-center space-x-2"
              >
                <Input
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1"
                />
                <Button type="submit" size="icon" disabled={!isConnected}>
                  <Send className="h-4 w-4" />
                  <span className="sr-only">Send</span>
                </Button>
              </form>
            </CardFooter>
          </>
        ) : (
          // If no conversation is selected
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <MessageCircle className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-2 text-lg font-semibold">
                No Conversation Selected
              </h3>
              <p className="text-muted-foreground">
                Choose a conversation or start a new one.
              </p>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
