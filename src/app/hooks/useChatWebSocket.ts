"use client"

import dayjs from 'dayjs'
import { useEffect, useRef, useState } from 'react'
import { getCookie } from '../api/service/cookie'
import { useWebSocket } from '../api/service/useWebSocket'
import { ChatMessage, Conversation } from '../types/types'

const WS_URL = "wss://staging.ai4bi.kz/ws/";

export const useChatWebSocket = () => {
  const { sendMessage, isConnected, lastMessage } = useWebSocket(WS_URL);

  const [currentUser, setCurrentUser] = useState<string | null>(null);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");

  const scrollRef = useRef<HTMLDivElement>(null);
  const prevConversationRef = useRef<string | null>(null);

  // **1. Create refs for audio instances**
  const notificationAudioRef = useRef(new Audio('/assets/sounds/notification.mp3'));
  const notification2AudioRef = useRef(new Audio('/assets/sounds/notification2.mp3'));

  // **2. Preload audio files**
  useEffect(() => {
    notificationAudioRef.current.load();
    notification2AudioRef.current.load();
  }, []);

  // **3. Create a ref for currentUser to access the latest value inside callbacks**
  const currentUserRef = useRef<string | null>(currentUser);

  useEffect(() => {
    currentUserRef.current = currentUser;
  }, [currentUser]);

  // **4. Track sent message IDs to differentiate between your messages and others**
  const sentMessageIdsRef = useRef<Set<string>>(new Set());

  // ---------------------------------------------------------------------------
  // handleWebSocketMessage
  // ---------------------------------------------------------------------------
  const handleWebSocketMessage = (rawMsg: any) => {
    let message: any;
    try {
      message = typeof rawMsg === "string" ? JSON.parse(rawMsg) : rawMsg;
    } catch (err) {
      console.error("[handleWebSocketMessage] Could not parse raw string:", err, rawMsg);
      return;
    }

    // --- JSONRpc response ---
    if (message.jsonrpc === "2.0" && message.result) {
      // 1) A newly created/returned chat
      if (message.result.chat_id) {
        handleChatCreated(message.result);

      // 2) A newly created message
      } else if (message.result.message_id) {
        handleMessageReceived(message.result);

      // 3) A list of chats or other data
      } else if (Array.isArray(message.result)) {
        handleChatsReceived(message.result);

      // 4) A paginated set of messages
      } else if (message.result.count && message.result.messages) {
        handleMessagesReceived(message.result.messages);
      }
      return;
    }

    // --- (B) "subscribe" or "auth" confirmation ---
    if (message.type === "auth" || message.type === "subscribe") {
      getChats(); // Re-fetch chats whenever we subscribe
      return;
    }

    // --- (C) Real-time "message" type updates (new_chat, new_message, new_participant, etc.) ---
    if (message.type === "message") {
      if (message.event === "new_chat") {
        // Handle a newly created chat
        handleChatCreated({
          chat_id: message.data.id,
          name: message.data.user?.name || `Chat with ${message.data.id}`,
        });
      } else if (message.event === "new_message") {
        const msgData = message.data.message;
        const chatId = message.chat_id || message.data.chat_id;
        // If it's in the chat_room channel...
        if (message.channel?.startsWith("chat_room")) {
          const formattedMessage = {
            message_id: `${msgData.counter}-${msgData.timestamp}-${Math.random()}`,
            chat_id: chatId,
            sender_first_name: msgData.sender_first_name,
            sender_last_name: msgData.sender_last_name,
            content: msgData.content,
            timestamp: msgData.timestamp || dayjs().toISOString(),
            authorId: msgData.sender_id,
            reply_message_id: msgData.reply_message_id,
          };
          handleMessageReceived(formattedMessage);
        } 
        else if (message.channel?.startsWith("chat_updates")) {
          setConversations((prev) =>
            prev.map((c) => (c.id === chatId ? { ...c, lastMessage: msgData.content } : c))
          );
          const isNotFromCurrentUser = String(message.data.message.sender_id) !== String(currentUserRef.current);
          const isInDifferentChat = message.data.message.chat_id !== selectedConversation;
      
          if (isNotFromCurrentUser && isInDifferentChat) {
            notification2AudioRef.current.play().catch((error) => {
              console.error("Failed to play notification2.mp3:", error);
            });
          }
      
          if (message.data.message.message_id) {
            sentMessageIdsRef.current.delete(message.data.message.message_id);
          }
        }
      } else if (message.event === "new_participant") {
        handleNewParticipant(message);
      }
      return;
    }

    // --- (D) Other message types (e.g. "message_received" ack) ---
    if (message.type === "message_received") {
      console.log("[handleWebSocketMessage] message_received ack:", message);
      return;
    }

    // --- (E) Fallback / unhandled ---
    console.log("[handleWebSocketMessage] Unhandled message:", message);
  };

  // ---------------------------------------------------------------------------
  // handleChatCreated
  // ---------------------------------------------------------------------------
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
        media_ids: null,
        message_id: null,
        reply_message_id: null,
        send_at: null,
        sender_first_name: null,
        sender_id: null,
        sender_last_name: null,
        type: null
      },
    };

    setConversations((prev) => {
      if (!prev.find((c) => c.id === newChat.id)) {
        return [...prev, newChat];
      }
      return prev;
    });

    setSelectedConversation(data.chat_id);
    subscribeToChatRoom(data.chat_id);
  };

  // ---------------------------------------------------------------------------
  // handleChatsReceived
  // ---------------------------------------------------------------------------
  const handleChatsReceived = (chats: any[]) => {
    console.log("[handleChatsReceived] Chats received:", chats);
    const transformed = chats.map((chat) => ({
      id: chat.chat_id,
      name: chat.name || `Chat ${chat.chat_id}`,
      lastMessage: chat.last_message || "",
      chat_type: chat.chat_type,
    }));
    setConversations(transformed);
  };

  // ---------------------------------------------------------------------------
  // handleMessagesReceived
  // ---------------------------------------------------------------------------
  const handleMessagesReceived = (msgs: any[]) => {
    const transformedMessages: ChatMessage[] = msgs
      .sort((a, b) => new Date(a.send_at).getTime() - new Date(b.send_at).getTime()) 
      .map((message: any) => ({
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

  // ---------------------------------------------------------------------------
  // handleMessageReceived
  // ---------------------------------------------------------------------------
  const handleMessageReceived = (msg: any) => {
    const realId = msg.message_id || Date.now().toString();
    const replyId = msg.reply_message_id || msg.reply_to || null;


    const newMsg: ChatMessage = {
      id: realId,
      chat_id: msg.chat_id,
      authorId: msg.authorId,
      sender_first_name: msg.sender_first_name,
      sender_last_name: msg.sender_last_name,
      content: msg.content,
      timestamp: msg.timestamp || dayjs().toISOString(),
      reply_to: replyId,
    };

    // Remove any pending messages with the same content, then add the new message
    setMessages((prev) => {
      const filtered = prev.filter((m) => !(m.pending && m.content === msg.content));
      return [...filtered, newMsg];
    });

    setConversations((prev) =>
      prev.map((c) =>
        c.id === newMsg.chat_id
          ? {
              ...c,
              lastMessage: {
                chat_id: newMsg.chat_id,
                content: newMsg.content,
                counter: null,
                deleted_at: null,
                delivered_at: null,
                edited_at: null,
                is_deleted: false,
                is_edited: false,
                media_ids: null,
                message_id: null,
                reply_message_id: newMsg.id,
                send_at: null,
                sender_first_name: null,
                sender_id: null,
                sender_last_name: null,
                type: null,
              },
            }
          : c
      )
    );

    const isNotFromCurrentUser = String(msg.authorId) !== String(currentUserRef.current);
    const isInDifferentChat = msg.chat_id !== selectedConversation;
    const isSentMessage = sentMessageIdsRef.current.has(msg.id);

    if (isNotFromCurrentUser && isInDifferentChat && isSentMessage) {
      notification2AudioRef.current.play().catch((error) => {
        console.error("Failed to play notification2.mp3:", error);
      });
    }

    if (isSentMessage) {
      sentMessageIdsRef.current.delete(msg.id);
    }
  };

  // ---------------------------------------------------------------------------
  // handleNewParticipant
  // ---------------------------------------------------------------------------
  const handleNewParticipant = (message: any) => {
    const { chat_id, data } = message;
    const { user_id } = data;

    // If the chat already exists in our list, we may do something else
    const chatExists = conversations.some((conv) => conv.id === chat_id);
    if (chatExists) {
      alert(`[handleNewParticipant] Chat ${chat_id} already exists.`);
      return;
    }
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
        message_id: null,
        reply_message_id: null,
        send_at: null,
        sender_first_name: null,
        sender_id: null,
        sender_last_name: null,
        type: null,
      },
    };
    setConversations((prev) => [...prev, newChat]);
    setSelectedConversation(chat_id);
    subscribeToChatRoom(chat_id);
  };

  // ---------------------------------------------------------------------------
  // subscribeToChatRoom
  // ---------------------------------------------------------------------------
  const subscribeToChatRoom = (chatId: string) => {
    console.log("[subscribeToChatRoom] Subscribing to chat room:", chatId);
    sendMessage({
      type: "subscribe",
      channel: "chat_room",
      chat_id: chatId,
    });
  };

  // ---------------------------------------------------------------------------
  // unsubscribeToChatRoom
  // ---------------------------------------------------------------------------
  const unsubscribeToChatRoom = (chatId: string) => {
    console.log("[unsubscribeToChatRoom] Unsubscribing from chat room:", chatId);
    sendMessage({
      type: "unsubscribe",
      channel: "chat_room",
      chat_id: chatId,
    });
  };

  // ---------------------------------------------------------------------------
  // createPrivateChat (JSON-RPC request)
  // ---------------------------------------------------------------------------
  const createPrivateChat = (userId: string) => {
    const rpcId = Date.now().toString();
    sendMessage({
      jsonrpc: "2.0",
      method: "createPrivateChat",
      params: { user_id: userId },
      id: rpcId,
    });
  };

  // ---------------------------------------------------------------------------
  // createAuctionChat (JSON-RPC request)
  // ---------------------------------------------------------------------------
  const createAuctionChat = (auctionName: string, auctionId: number) => {
    const rpcId = Date.now().toString();
    const request = {
      jsonrpc: "2.0",
      method: "createAuctionChat",
      params: {
        name: auctionName,
        type: "auction_chat",
        auction_id: auctionId,
        participants: [],
      },
      id: rpcId,
    };
    console.log("[createAuctionChat] Request:", request);
    sendMessage(request);
  };

  // ---------------------------------------------------------------------------
  // addAuctionChatParticipant (JSON-RPC request)
  // ---------------------------------------------------------------------------
  const addAuctionChatParticipant = (user_id: string) => {
    if (!selectedConversation) return;
    const rpcId = Date.now().toString();
    sendMessage({
      jsonrpc: "2.0",
      method: "addParticipant",
      params: {
        user_id,
        chat_id: selectedConversation,
        role: "user",
      },
      id: rpcId,
    });
  };

  // ---------------------------------------------------------------------------
  // getChats (JSON-RPC request)
  // ---------------------------------------------------------------------------
  const getChats = () => {
    if (!currentUser) return;
    const rpcId = Date.now().toString();
    const request = {
      jsonrpc: "2.0",
      method: "getChats",
      id: rpcId,
      params: {},
    };
    sendMessage(request);
    console.log("[getChats] Request:", request);
  };

  // ---------------------------------------------------------------------------
  // getChatMessages (JSON-RPC request)
  // ---------------------------------------------------------------------------
  const getChatMessages = () => {
    if (!selectedConversation) return;
    const rpcId = Date.now().toString();
    const request = {
      jsonrpc: "2.0",
      method: "getMessages",
      id: rpcId,
      params: {
        chat_id: selectedConversation,
        page: 1,
        page_size: 100,
      },
    };
    sendMessage(request);
    console.log("[getChatMessages] Request:", request);
  };

  // ---------------------------------------------------------------------------
  // sendChatMessage
  // ---------------------------------------------------------------------------
  const sendChatMessage = (reply?: ChatMessage | null) => {
    if (!selectedConversation || !newMessage.trim()) return;
    const replyId = reply?.id ?? null;
    const rpcId = Date.now().toString();
    const content = newMessage.trim();
    const pendingMsg: ChatMessage = {
      id: rpcId,
      authorId: getCookie("user_id"),
      sender_first_name: "user",
      sender_last_name: "",
      content,
      timestamp: dayjs().toISOString(),
      pending: true,
      chat_id: selectedConversation,
      reply_to: replyId,
    };
    setMessages((prev) => {
      const filtered = prev.filter((m) => !(m.pending && m.content === content));
      return [...filtered, pendingMsg];
    });

    sentMessageIdsRef.current.add(rpcId);

    // Send as JSON-RPC
    sendMessage({
      jsonrpc: "2.0",
      method: "sendMessage",
      params: {
        chat_id: selectedConversation,
        content,
        media: [],
        reply_to: replyId,
        timestamp: dayjs().toISOString(),
      },
      id: rpcId,
    });
    setNewMessage("");
    notificationAudioRef.current.play().catch((error) => {
      console.error("Failed to play notification.mp3:", error);
    });
  };

  // ---------------------------------------------------------------------------
  // deleteMessage
  // ---------------------------------------------------------------------------
  const deleteMessage = (messageId: string) => {
    if (!selectedConversation) return;
    const rpcId = Date.now().toString();
    sendMessage({
      jsonrpc: "2.0",
      method: "deleteMessage",
      id: rpcId,
      params: {
        message_id: messageId,
        chat_id: selectedConversation,
      },
    });
    setMessages((prev) => prev.filter((m) => m.id !== messageId));
  };

  // ---------------------------------------------------------------------------
  // handleEditMessage
  // ---------------------------------------------------------------------------
  const sendEditMessage = (message: ChatMessage) => {
    if (!selectedConversation) return;
    const rpcId = Date.now().toString();
    sendMessage({
      jsonrpc: "2.0",
      method: "editMessage",
      id: rpcId,
      params: {
        message_id: message.id,
        chat_id: selectedConversation,
        content: message.content,
      },
    });
  };

  // ---------------------------------------------------------------------------
  // Subscribe/unsubscribe to specific chat rooms when selectedConversation changes
  // ---------------------------------------------------------------------------
  useEffect(() => {
    // If previously selected a conversation, unsubscribe from it
    if (prevConversationRef.current) {
      unsubscribeToChatRoom(prevConversationRef.current);
    }
    // Subscribe to the newly selected conversation
    if (selectedConversation && isConnected) {
      subscribeToChatRoom(selectedConversation);
    }
    prevConversationRef.current = selectedConversation;
  }, [selectedConversation, isConnected]);

  // ---------------------------------------------------------------------------
  // Initialize currentUser from cookies
  // ---------------------------------------------------------------------------
  useEffect(() => {
    const userId = getCookie("user_id");
    if (userId) {
      setCurrentUser(userId);
      currentUserRef.current = userId; // Initialize ref
    }
  }, []);

  // ---------------------------------------------------------------------------
  // Subscribe to "chat_updates" once the WebSocket is connected
  // ---------------------------------------------------------------------------
  useEffect(() => {
    if (isConnected) {
      sendMessage({ type: "subscribe", channel: "chat_updates" });
    }
  }, [isConnected, sendMessage]);

  // ---------------------------------------------------------------------------
  // Handle the most recent WebSocket message
  // ---------------------------------------------------------------------------
  useEffect(() => {
    if (!lastMessage) return;
    handleWebSocketMessage(lastMessage);
  }, [lastMessage]);

  // ---------------------------------------------------------------------------
  // Fetch the full list of chats when currentUser is set
  // ---------------------------------------------------------------------------
  useEffect(() => {
    if (currentUser) {
      getChats();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser]);

  // ---------------------------------------------------------------------------
  // Fetch messages whenever a new conversation is selected
  // ---------------------------------------------------------------------------
  useEffect(() => {
    if (selectedConversation && isConnected) {
      getChatMessages();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedConversation, isConnected]);

  // ---------------------------------------------------------------------------
  // Optional: Scroll to bottom when new messages arrive or conversation changes
  // ---------------------------------------------------------------------------
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

  return {
    // WebSocket states
    isConnected,
    lastMessage,
    // Current user
    currentUser,
    setCurrentUser,
    // Chat data
    conversations,
    setConversations,
    selectedConversation,
    setSelectedConversation,
    messages,
    setMessages,
    // Draft message
    newMessage,
    setNewMessage,
    // Scroll container ref (if desired in UI)
    scrollRef,
    // Expose all relevant methods
    sendChatMessage,
    createPrivateChat,
    createAuctionChat,
    addAuctionChatParticipant,
    getChats,
    getChatMessages,
    deleteMessage,
    sendEditMessage,
  };
};
