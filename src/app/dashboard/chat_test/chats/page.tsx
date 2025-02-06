"use client";

/**
 * Test Page: WebSocket Chat Implementation (TO CREATE A NEW CHATS CUZ WE DONT HAVE IT THE ACTUAL CHAT SO I DELETE THIS LATER)
 * 
 * This page serves as a reference implementation for WebSocket-based chat functionality.
 * It demonstrates:
 * - WebSocket connection handling
 * - Real-time chat message processing
 * - Basic chat UI components
 * 
 * Note: This is a development/testing page only. The production implementation 
 * uses the useChatWebSocket hook with additional auction-related functionality,
 * pending backend completion.
 */

import { useWebSocket } from "@/src/app/api/service/useWebSocket"; // Adjust import path
import { useEffect, useRef, useState } from "react"

// UI components (replace with your own or remove)
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { getCookie } from '@/src/app/api/service/cookie'
import { ChatMessage, Conversation } from '@/src/app/types/types'
import dayjs from "dayjs"
import { MessageCircle, Search, Send, UserPlus } from "lucide-react"
// Point this to your actual server
const WS_URL = process.env.NEXT_PUBLIC_WS_URL || "ws://staging.ai4bi.kz/ws/";

export default function WebSocketChat() {
  const { sendMessage, isConnected, lastMessage } = useWebSocket(WS_URL);

  const [currentUser, setCurrentUser] = useState<string | null>(null);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const prevConversationRef = useRef<string | null>(null);

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
      } else if (Array.isArray(message.result)) {
        // Means we got a list of chats
        handleChatsReceived(message.result);
      } else if (message.result.count && message.result.messages) {
        // Means we got a list of messages
        handleMessagesReceived(message.result.messages);
      }
      return;
    }

    // (B) If it's a "subscribe" or "auth" confirmation
    if (message.type === "auth" || message.type === "subscribe") {
      getChats(); // For now, we just get chats when we subscribe
      return;
    }

    // (C) If it's a "message" type, then check the event
    if (message.type === "message") {
      if (message.event === "new_chat") {
         handleChatCreated({
          chat_id: message.data.id,
          name: message.data.user?.name || `Chat with ${message.data.id}`,
        });
      } 
      else if (message.event === "new_message") {
        const msgData = message.data.message;
        const chatId = message.chat_id || message.data.chat_id;
        getChats();

        if (message.channel?.startsWith("chat_room")) {
          const formattedMessage = {
            message_id: `${msgData.counter}-${msgData.timestamp}-${Math.random()}`,
            chat_id: chatId,
            sender: msgData.author.id === currentUser ? "user" : msgData.author.name,
            content: msgData.content,
            timestamp: msgData.timestamp || dayjs().toISOString(),
            authorId: msgData.author.id,
          };
          handleMessageReceived(formattedMessage);
        } else if (message.channel?.startsWith("chat_updates")) {
          // Update lastMessage in conversations
          setConversations((prev) =>
            prev.map((c) => {
              if (c.id === chatId) {
                return { ...c, lastMessage: msgData.content };
              }
              return c;
            })
          );
        }
      } else if (message.event === "new_participant") {
        handleNewParticipant(message);
      } else {
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
    console.log("[handleChatCreated] Chat created or received:", data);
    const newChat: Conversation = {
      id: data.chat_id,
      name: data.name || `Chat ${data.chat_id}`,
      chat_type: data.chat_type,
      lastMessage: {
				chat_id: data.chat_id,
				content: null,
				counter: null,
				deleted_at: null,
				delivered_at: null,
				edited_at: null,
				is_deleted: false,
				is_edited: false,
				media: null,
				has_attachements: false,
				media_ids: null,
				message_id: null,
				reply_message_id: null,
				send_at: null,
				sender_first_name: null,
				sender_id: null,
				sender_last_name: null,
				type: null,
			},
			participants: data.participants,
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
  // handleChatsReceived
  // ------------------------------------------------
  const handleChatsReceived = (chats: any[]) => {  
    const transformedChats = chats.map(chat => ({
      id: chat.chat_id,
      name: chat.name || `Chat with ${chat.chat_id}`,
      lastMessage: chat.last_message || "",
      chat_type: chat.chat_type,
      participants: chat.participants,
    }));
    
    setConversations(transformedChats);
  };

  // ------------------------------------------------
  // handleMessagesReceived
  // ------------------------------------------------
  const handleMessagesReceived = (msgs: any[]) => {
    const transformedMessages: ChatMessage[] = msgs.map((message: any) => ({
      id: message.message_id,
      sender_first_name: message.sender_first_name,
      sender_last_name: message.sender_last_name,
      content: message.content,
      timestamp: message.send_at,
      chat_id: message.chat_id,
      authorId: message.sender_id,
    }));
    setMessages(transformedMessages);
  };

  // ------------------------------------------------
  // handleMessageReceived
  // ------------------------------------------------
  const handleMessageReceived = (msg: any) => {
    // Convert to local shape
     const newMsg: ChatMessage = {
      id: msg.message_id ? `${msg.message_id}-${msg.timestamp}-${Math.random()}` : Date.now().toString(),
      sender_first_name: msg.sender_first_name,
      sender_last_name: msg.sender_last_name,
      content: msg.content,
      timestamp: msg.timestamp || dayjs().toISOString(),
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
  // handleNewParticipant
  // ------------------------------------------------
  const handleNewParticipant = (message: any) => {
    const { chat_id, data } = message;
    const { user_id } = data;

    // If the chat already exists in our list, we may do something else
    const chatExists = conversations.some((conv) => conv.id === chat_id);
    if (chatExists) {
      alert(`[handleNewParticipant] Chat ${chat_id} already exists.`);
      return;
    }

    // Optionally, push a "system" style message
    setMessages((prev) => [
      ...prev,
      {
        id: `${user_id}-${dayjs().toISOString()}-${Math.random()}`,
        sender_first_name: "System",
        sender_last_name: "",
        content: `User ${user_id} joined the chat`,
        timestamp: dayjs().toISOString(),
        chat_id,
      },
    ]);


      
    const newChat: Conversation = {
      id: chat_id,
      name: `User ${user_id} Joined`,
      chat_type: "auction_chat",
      lastMessage: {
        chat_id: chat_id,
        content: `User ${user_id} joined the chat`,
        counter: null,
        deleted_at: null,
        delivered_at: null,
        edited_at: null,
        is_deleted: false,
        is_edited: false,
        media_ids: null,
        media: null,
        has_attachements: false,
        message_id: null,
        reply_message_id: null,
        send_at: null,
        sender_first_name: null,
        sender_id: null,
        sender_last_name: null,
        type: null
      },
      participants: [],
    };

    setConversations((prev) => [...prev, newChat]);

    // Optionally auto-select the new chat
    setSelectedConversation(chat_id);

    // Subscribe to the new chat room
    subscribeToChatRoom(chat_id);
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
  // unsubscribeToChatRoom
  // ------------------------------------------------
  const unsubscribeToChatRoom = (chatId: string) => {
    console.log("[unsubscribeToChatRoom] Unsubscribing from chat room:", chatId);
    sendMessage({
      type: "unsubscribe",
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
  // create AuctionChat
  // Creates a new chat intended to be linked with an auction (or any custom business logic).
  // ------------------------------------------------
  const createAuctionChat = (auctionName: string, auctionId: number) => {
    const rpcId = Date.now().toString();
    const request = {
      jsonrpc: "2.0",
      method: "createAuctionChat",
      id: rpcId,
      params: {
        name: auctionName,
        type: "auction_chat",
        auction_id: auctionId,
        participants: [],
      },
    };
    console.log("[createAuctionChat] Request:", request);
    sendMessage(request);
  };

  // ------------------------------------------------
  // addAuctionChatParticipant
  // ------------------------------------------------
  const addAuctionChatParticipant = (user_id: string) => {
    const rpcId = Date.now().toString();
    const request = {
      jsonrpc: "2.0",
      method: "addParticipant",
      id: rpcId,
      params: {
        user_id: user_id,
        chat_id: selectedConversation,
        role: "user",
      },
    };
    sendMessage(request);
  }

  // ------------------------------------------------
  // getChats
  // ------------------------------------------------
    const getChats = () => {
      const rpcId = Date.now().toString();
      const request = {
        jsonrpc: "2.0",
        method: "getChats",
        id: rpcId,
        params: {},
      };
      sendMessage(request);
      console.log("[getChats] getting chats for user:", request);
    };

  // ------------------------------------------------
  // get ChatMessages
  // ------------------------------------------------
  const getChatMessages = () => {
    const rpcId = Date.now().toString();
    const request = {
      jsonrpc: "2.0",
      method: "getMessages",
      id: rpcId,
      params: {
        chat_id: selectedConversation,
        page: 1,
        page_size: 50,
      },
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
      sender_first_name: "user",
      sender_last_name: "",
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

  // ------------------------------------------------
  // Initialize currentUser from Cookies
  // ------------------------------------------------
  useEffect(() => {
    const userId = getCookie("user_id");
    if (userId) {
      setCurrentUser(userId);
    }
  }, []);


    // Unsubscribe from previous and subscribe to new conversation
    useEffect(() => {
      if (prevConversationRef.current) {
        unsubscribeToChatRoom(prevConversationRef.current);
      }
      if (selectedConversation) {
        subscribeToChatRoom(selectedConversation);
      }
      prevConversationRef.current = selectedConversation;
    }, [selectedConversation]);

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
  // Scroll to bottom when new message is received
  // ------------------------------------------------
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

  // ------------------------------------------------
  // Get chats when currentUser is set
  // ------------------------------------------------
  useEffect(() => {
    if (currentUser) {
      console.log("[WebSocketChat] Getting chats for user:", currentUser);
      getChats();
    }
  }, [currentUser]);

    // ------------------------------------------------
  // Get messages in selected conversation
  // ------------------------------------------------
  useEffect(() => {
    if (selectedConversation) {
      console.log("[WebSocketChat] Getting messages for:", selectedConversation);
      getChatMessages();
    }
  }, [selectedConversation]);

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
                    {typeof conv.lastMessage === 'string' ? conv.lastMessage : conv.lastMessage?.content}
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
          <Button
            variant="outline"
            className="w-full"
            onClick={() => {
              const auctionId = prompt("Auction ID:");
              const auctionName = prompt("Auction name:");
              if (auctionName && auctionId) {
                createAuctionChat(auctionName, Number(auctionId));
              }
            }}
          >
            Create Auction Chat
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
              <CardDescription>
                <Button onClick={() => {
                  const userId = prompt("Enter user ID to add to auction chat:");
                  if (userId) addAuctionChatParticipant(userId);
                }} variant="outline" className="w-full">
                  Add Participant
                </Button>
              </CardDescription>
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
                        m.sender_first_name === "user" ? "justify-end" : "justify-start"
                      } ${m.sender_first_name === "System" ? "justify-center" : ""}`}
                    >
                      <div
                        className={`rounded-lg p-2 max-w-[70%] ${
                          m.sender_first_name === "user"
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted"
                        } ${m.pending ? "opacity-50" : ""} ${m.sender_first_name === "System" ? "bg-transparent text-muted-foreground" : ""}`}
                      >
                        <p className='text-xs text-muted-foreground'>{m.sender_first_name === "System" ? "" : m.sender_first_name}</p>
                        <p>{m.content}</p>
                        {
                          m.sender_first_name !== "System" && (
                            <span className="text-xs text-muted-foreground block mt-1">
                          {dayjs(m.timestamp).isValid() 
                            ? dayjs(m.timestamp).format("HH:mm")
                            : "Now"}
                        </span>
                        )
                        }
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
