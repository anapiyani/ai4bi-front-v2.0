"use client"
import { toast } from '@/components/ui/use-toast'
import { useWS } from "@/src/app/api/provider/WebSocketProvider"
import dayjs from 'dayjs'
import { useTranslations } from 'next-intl'
import { useCallback, useEffect, useRef, useState } from 'react'
import { toast as HotToast } from 'react-hot-toast'
import { getCookie } from '../api/service/cookie'
import { ChatMessage, Conversation, ForwardData, LastMessage, Media, MessagesRecord, PopUpButtonAction, ReceivedChats, TypingStatus } from '../types/types'

export type PopUpsRecord = {
  [chatId: string]: {
    [popupId: string]: any
  }
}

export const useChatWebSocket = () => {
  const t = useTranslations("dashboard")
  const { sendMessage, isConnected, lastMessage } = useWS();

  const [currentUser, setCurrentUser] = useState<string | null>(null);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [messagesByChat, setMessagesByChat] = useState<MessagesRecord>({});
  const [popUpsByChat, setPopUpsByChat] = useState<PopUpsRecord>({});
  const [typingStatuses, setTypingStatuses] = useState<TypingStatus[]>([]);
  const typingTimeoutsRef = useRef<{ [chatId: string]: NodeJS.Timeout }>({});
  const [newMessage, setNewMessage] = useState("");

  const scrollRef = useRef<HTMLDivElement>(null);
  const prevConversationRef = useRef<string | null>(null);
  const notificationAudioRef = useRef(new Audio('/assets/sounds/notification.mp3'));
  const notification2AudioRef = useRef(new Audio('/assets/sounds/notification2.mp3'));
  useEffect(() => {
    notificationAudioRef.current.load();
    notification2AudioRef.current.load();
  }, []);
  const currentUserRef = useRef<string | null>(currentUser);

  useEffect(() => {
    currentUserRef.current = currentUser;
  }, [currentUser]);

  const sentMessageIdsRef = useRef<Set<string>>(new Set());

  // Man fuck this shit

  // ---------------------------------------------------------------------------
  // handleWebSocketMessage функция которая обрабатывает все сообщения от сервера
  // ---------------------------------------------------------------------------
  const handleWebSocketMessage = (rawMsg: any) => {
    let message: any;
    try {
      message = typeof rawMsg === "string" ? JSON.parse(rawMsg) : rawMsg;
    } catch (err) {
      console.error("[handleWebSocketMessage] Could not parse raw string:", err, rawMsg);
      toast({
        title: t("error.connection_error"),
        description: t("error.please_refresh"),
        variant: "destructive"
      })
      return;
    }

    if (message.jsonrpc === "2.0" && message.result) {
      if (message.result.chat_id) {
        handleChatCreated(message.result);
      } else if (message.result.event === "popups") {
        handleReceivedChatPopup(message.result);
      } else if (message.result.popup_id) {
        handlePopUpResponse(message);
      } else if (message.result.message_id) {
        handleMessageReceived(message.result);
      } else if (Array.isArray(message.result)) {
        handleChatsReceived(message.result);
      } else if (message.result.count && message.result.messages) {
        handleMessagesReceived(message.result.messages);
      } 
      return;
    }

    if (message.type === "message") {
      switch (message.event) {
        case "new_chat":
          handleChatCreated({
            chat_id: message.data.id,
            name: message.data.user?.name || `Chat with ${message.data.id}`,
          });
          break;
        case "edit_message":
          const editedMsg = message.data.message;
          const formattedEditedMessage = {
            message_id: editedMsg.message_id,
            content: editedMsg.content,
            is_edited: true
          }
          handleReceivedEditedMessage(formattedEditedMessage);
          break;
        case "typing_status":
          handleTypingStatus(message.data);
          break;
        case "pin_message":
          handleReceivedPinStatusChange(message.data, true);
          break;
        case "unpin_message":
          handleReceivedPinStatusChange(message.data, false);
          break;
        case "delete_message":
          handleReceivedDeleteMessage(message.data);
          break;
        case "read_message":
          getChats()
          break;
        case "new_message":
          const msgData = message.data.message;
          const chatId = message.chat_id || message.data.chat_id;
          if (message.channel?.startsWith("chat_room")) {
            const formattedMessage = {
              message_id: msgData.message_id,
              chat_id: chatId,
              sender_first_name: msgData.sender_first_name,
              sender_last_name: msgData.sender_last_name,
              content: msgData.content,
              type: msgData.type,
              counter: msgData.counter,
              timestamp: msgData.timestamp || dayjs().toISOString(),
              authorId: msgData.sender_id,
              forwarded_from: msgData.forwarded_from,
              forwarded_from_first_name: msgData.forwarded_from_first_name,
              forwarded_from_last_name: msgData.forwarded_from_last_name,
              reply_message_id: msgData.reply_message_id,
              media: msgData.media,
              is_pinned: msgData.is_pinned,
            };
            handleMessageReceived(formattedMessage);
          } 
          else if (message.channel?.startsWith("chat_updates")) {
            getChats();
            setConversations((prev) =>
              prev.map((c) => (c.id === chatId ? { ...c, lastMessage: { ...msgData, is_edited: msgData.is_edited || false } } : c))
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
          break;
        case "new_participant":
          handleNewParticipant(message);
          break;
      }
      return;
    } else if (message.type === "notifications") {
      handleShowNotification(message);
    } 
    if (message.type === "message_received") {
      console.log("[handleWebSocketMessage] message_received ack:", message);
      return;
    }
    console.log("[handleWebSocketMessage] Unhandled message:", message);
  };

  // --------------------------------------
  // addMessagesToChat функция которая добавляет новые сообщения в чат
  // --------------------------------------
  const addMessagesToChat = useCallback((chatId: string, newMsgs: ChatMessage[]) => {
    setMessagesByChat((prev) => {
      const existing = prev[chatId] || [];
      const allMsgs = [...existing, ...newMsgs];
      const uniqueMessages = allMsgs.reduce<ChatMessage[]>((acc, msg) => {
        if (!acc.find(m => m.id === msg.id)) {
          acc.push(msg);
        }
        return acc;
      }, []);
      uniqueMessages.sort(
        (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
      );
      return { ...prev, [chatId]: uniqueMessages };
    });
  }, []);
  

  // ---------------------------------------------------------------------------
  // handleChatCreated функция которая обрабатывает создание нового чата
  // ---------------------------------------------------------------------------
  const handleChatCreated = (data: any) => {
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
        has_attachements: false,
        media: null,
        is_edited: false,
        is_pinned: false,
        media_ids: null,
        message_id: null,
        reply_message_id: null,
        send_at: null,
        sender_first_name: null,
        sender_id: null,
        sender_last_name: null,
        type: data.type
      },
      participants: []
    };

    setConversations((prev) => {
      if (!prev.find((c) => c.id === newChat.id)) {
        return [...prev, newChat];
      }
      return prev;
    });

    setSelectedConversation(data.chat_id);
  };

  // ---------------------------------------------------------------------------
  // handleChatsReceived
  // ---------------------------------------------------------------------------
  const handleChatsReceived = (chats: ReceivedChats[]) => {
    const transformed = chats.map((chat) => ({
      id: chat.chat_id,
      name: chat.name || `Chat ${chat.chat_id}`,
      lastMessage: chat.last_message || null,
      chat_type: chat.chat_type,
      unread_count: chat.unread_count,
      updated_at: chat.updated_at || null,
      participants: chat.participants || null,
    }));
    setConversations(transformed);
  };

  // ---------------------------------------------------------------------------
  // createRPCRequest функция для отправки RPC запросов
  // ---------------------------------------------------------------------------
  function createRpcRequest(method: string, params: Record<string, any> = {}): any {
    return {
      jsonrpc: "2.0",
      method,
      params,
      id: Date.now().toString(),
    };
  }

  // ---------------------------------------------------------------------------
  // handleMessagesReceived
  // ---------------------------------------------------------------------------
  const handleMessagesReceived = useCallback((msgs: any[]) => {
    if (!selectedConversation) return;
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
        counter: message.counter,
        forwarded_from: message.forwarded_from,
        forwarded_from_first_name: message.forwarded_from_first_name,
        forwarded_from_last_name: message.forwarded_from_last_name,
        is_pinned: message.is_pinned,
        is_edited: message.is_edited,
        type: message.type,
        reply_to: message.reply_message_id,
        media: message.media?.length > 0 ? message.media : null,
        has_attachements: Boolean(message.media?.length),
      }));
    addMessagesToChat(selectedConversation, transformedMessages);
  }, [selectedConversation]);

  // ---------------------------------------------------------------------------
  // handleMessageReceived
  // ---------------------------------------------------------------------------
  const handleMessageReceived = useCallback((msg: any) => {
    const chatId = msg.chat_id;
    const realId = msg.message_id
    const replyId = msg.reply_message_id || msg.reply_to || null;

    const newMsg: ChatMessage = {
      id: realId,
      chat_id: msg.chat_id,
      authorId: msg.authorId,
      sender_first_name: msg.sender_first_name,
      sender_last_name: msg.sender_last_name,
      is_pinned: msg.is_pinned,
      content: msg.content,
      media: msg.media,
      has_attachements: msg.has_attachements,
      timestamp: msg.timestamp || dayjs().toISOString(),
      reply_to: replyId,
      counter: msg.counter,
    };
    
    setMessagesByChat((prev) => {
      const existingMessages = prev[chatId] || [];
      const filtered = existingMessages.filter((m) => !(m.pending && m.content === msg.content));
      return { ...prev, [chatId]: [...filtered, newMsg] };
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
                media: newMsg.media ?? null,
                has_attachements: newMsg.has_attachements ?? null,
                message_id: null,
                is_pinned: newMsg.is_pinned ?? null,
                reply_message_id: newMsg.id,
                send_at: null,
                sender_first_name: null,
                sender_id: null,
                sender_last_name: null,
                type: null,
              } as LastMessage,
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
  }, []);

  // ---------------------------------------------------------------------------
  // handleReceivedChatPopup
  // ---------------------------------------------------------------------------
  const handleReceivedChatPopup = useCallback((message: any) => {
    const { body, buttons, chat_id, created_at, expiration_time, header, id, popup_type, user_id } = message.result[0] || {};
    setPopUpsByChat((prev) => ({
      ...prev,
      [chat_id]: {
        data: {
          body,
          buttons,
          chat_id,
          created_at,
          expiration_time,
          header,
          id,
          popup_type,
          user_id,
        }
      }
    }));
  }, []);

  // ---------------------------------------------------------------------------
  // PopUpButtonAction
  // ---------------------------------------------------------------------------
  const handlePopUpButtonAction = useCallback((button: PopUpButtonAction) => {
    const { popup_id, user_id, button_id, tech_council_reschedule_date }: PopUpButtonAction = button;
    if (tech_council_reschedule_date) {
      sendMessage(createRpcRequest("respond_to_popup", {
        popup_id: popup_id,
        user_id: user_id,
        button_id: button_id,
        tech_council_reschedule_date: tech_council_reschedule_date
      }));
    } else {
      sendMessage(createRpcRequest("respond_to_popup", {
        popup_id: popup_id,
        user_id: user_id,
        button_id: button_id
      }));
    }
  }, []);

  // ---------------------------------------------------------------------------
  // handlePopUpResponse
  // ---------------------------------------------------------------------------
  const handlePopUpResponse = useCallback((message: any) => {
    const { popup_id } = message.result;
    setPopUpsByChat((prev) => {
      const updated = { ...prev };
      for (const chatId of Object.keys(updated)) {
        if (updated[chatId].data?.id === popup_id) {
          delete updated[chatId];
        }
      }
      return updated;
    });
  }, []);

  // ---------------------------------------------------------------------------
  // handleReceivedEditedMessage
  // ---------------------------------------------------------------------------
  const handleReceivedEditedMessage = useCallback((message: any) => {
    const { message_id, content, is_edited } = message;
    setMessagesByChat((prev) => {
      const updated = { ...prev };
      for (const cId of Object.keys(updated)) {
        updated[cId] = updated[cId].map((m) =>
          m.id === message_id ? { ...m, content, is_edited } : m
        );
      }
      return updated;
    });
  }, []);

  // ---------------------------------------------------------------------------
  // handleReceivedPinStatusChange
  // ---------------------------------------------------------------------------
  const handleReceivedPinStatusChange = useCallback((message: any, isPinned: boolean) => {
    const { message_id } = message;
    setMessagesByChat((prev) => {
      const updated = { ...prev };
      for (const cId of Object.keys(updated)) {
        updated[cId] = updated[cId].map((m) =>
          m.id === message_id ? { ...m, is_pinned: isPinned } : m
        );
      }
      return updated;
    });
  }, []);

  // ---------------------------------------------------------------------------
  // handleNewParticipant
  // ---------------------------------------------------------------------------
  const handleNewParticipant = useCallback((message: any) => {
    const { chat_id, data } = message;

    const chatExists = conversations.some((conv) => conv.id === chat_id);
    if (chatExists) {
      toast({
        title: t("error.chat_already_exists"),
        variant: "destructive"
      });
      return;
    }
    getChats();
    getChatMessages();
    setSelectedConversation(chat_id);
  }, []);

  // ---------------------------------------------------------------------------
  // subscribeToChatRoom
  // ---------------------------------------------------------------------------
  const subscribeToChatRoom = (chatId: string) => {
    sendMessage({
      type: "subscribe",
      channel: "chat_room",
      chat_id: chatId,
    });
  };

  // ---------------------------------------------------------------------------
  // handlePinMessage
  // ---------------------------------------------------------------------------
  const handlePinMessage = useCallback(({chat_id, message_id}: {chat_id: string, message_id: string}) => {
      setMessagesByChat((prev) => {
        const updated = { ...prev };
        for (const cId of Object.keys(updated)) {
          updated[cId] = updated[cId].map((m) =>
            m.id === message_id ? { ...m, is_pinned: true } : m
        );
      }
      return updated;
    });
  
    sendMessage(createRpcRequest("pinMessage", {
      chat_id,
      message_id
    }));
  }, []);

  // ---------------------------------------------------------------------------
  // handleUnpinMessage
  // ---------------------------------------------------------------------------
  const handleUnpinMessage = useCallback(({chat_id, message_id}: {chat_id: string, message_id: string}) => {
    setMessagesByChat((prev) => {
      const updated = { ...prev };
      for (const cId of Object.keys(updated)) {
        updated[cId] = updated[cId].map((m) =>
          m.id === message_id ? { ...m, is_pinned: false } : m
        );
      }
      return updated;
    });
    
    sendMessage(createRpcRequest("unpinMessage", {
      chat_id,
      message_id
    }));
  }, []);

  // ---------------------------------------------------------------------------
  // handleShowNotification
  // ---------------------------------------------------------------------------
  const handleShowNotification = (message: any) => {
    HotToast((t) => (
      message.data.content
    ), {
      duration: 5000,
      position: "top-right",
      style: {
        background: "white",
        color: "black",
        padding: "10px",
        borderRadius: "5px",
        maxWidth: "500px",
        width: "fit-content",
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        border: "1px solid #e2e8f0"
      },
      className: "custom-toast"
    });
  }

  // ---------------------------------------------------------------------------
  // handleGetChatInfo
  // ---------------------------------------------------------------------------
  const handleGetChatInfo = () => {
    if (!selectedConversation) return;
    sendMessage(createRpcRequest("getChatInfo", {
      chat_id: selectedConversation
    }));
  }

  // ---------------------------------------------------------------------------
  // handleTyping
  // ---------------------------------------------------------------------------
  const handleTyping = (status: "typing" | "recording" | "stopped", chat_id: string) => {
    sendMessage(createRpcRequest("setTypingStatus", {
      status,
      chat_id,
      user_first_name: getCookie('first_name')
    }));
  }

  // ---------------------------------------------------------------------------
  // handleReceivedDeleteMessage
  // ---------------------------------------------------------------------------
  const handleReceivedDeleteMessage = useCallback((message: any) => {
    setMessagesByChat((prev) => {
      const updated = { ...prev };
      for (const cId of Object.keys(updated)) {
        updated[cId] = updated[cId].filter((m) => m.id !== message.message_id);
      }
      return updated;
    });
    setConversations((prev) => prev.map((c) => c.id === message.chat_id ? { ...c, lastMessage: null } : c));
  }, []);

  // ---------------------------------------------------------------------------
  // handleTypingStatus
  // ---------------------------------------------------------------------------
  const handleTypingStatus = (data: TypingStatus) => {
    const currentUser = getCookie("user_id");
  
    if (data.user_id === currentUser) {
      return;
    }

    if (typingTimeoutsRef.current[data.chat_id]) {
      clearTimeout(typingTimeoutsRef.current[data.chat_id]);
      delete typingTimeoutsRef.current[data.chat_id];
    }

    setTypingStatuses((prev) => {
      const exists = prev.some((status) => status.chat_id === data.chat_id);
      if (!exists) return [...prev, data];
      return prev.map((status) =>
        status.chat_id === data.chat_id ? { ...status, status: data.status } : status
      );
    });

    typingTimeoutsRef.current[data.chat_id] = setTimeout(() => {
      setTypingStatuses((prev) =>
        prev.filter((status) => status.chat_id !== data.chat_id)
      );
      delete typingTimeoutsRef.current[data.chat_id];
    }, 2000);
  };


  // ---------------------------------------------------------------------------
  // unsubscribeToChatRoom
  // ---------------------------------------------------------------------------
  const unsubscribeToChatRoom = (chatId: string) => {
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
    sendMessage(createRpcRequest("createPrivateChat", {
      user_id: userId
    }));
  };

  // ---------------------------------------------------------------------------
  // createAuctionChat (JSON-RPC request)
  // ---------------------------------------------------------------------------
  const createAuctionChat = (auctionName: string, auctionId: number) => {
    const request = createRpcRequest("createAuctionChat", {
      name: auctionName,
      type: "auction_chat", 
      auction_id: auctionId,
      participants: []
    });
    sendMessage(request);
  };

  // ---------------------------------------------------------------------------
  // addAuctionChatParticipant (JSON-RPC request)
  // ---------------------------------------------------------------------------
  const addAuctionChatParticipant = (user_id: string) => {
    if (!selectedConversation) return;
    sendMessage(createRpcRequest("addParticipant", {
      user_id,
      chat_id: selectedConversation,
      role: "user"
    }));
  };

  // ---------------------------------------------------------------------------
  // Add participants to auction chat (JSON-RPC request)
  // ---------------------------------------------------------------------------
  const addParticipantsToAuctionChat = (user_ids: string[], is_auction_participant?: boolean) => {
    if (!selectedConversation) return;
    sendMessage(createRpcRequest("batchAddParticipants", {
      participants: user_ids.map((id: string) => ({
        user_id: id,
        chat_id: selectedConversation,
        role: "user",
        is_auction_participant: is_auction_participant
      }))
    }));
    getChatMessages();
    getChats();
  };

  // ---------------------------------------------------------------------------
  // getChats (JSON-RPC request)
  // ---------------------------------------------------------------------------
  const getChats = () => {
    if (!currentUser) return;
    const request = createRpcRequest("getChats", {});
    sendMessage(request);
  };

  // ---------------------------------------------------------------------------
  // getChatMessages (JSON-RPC request)
  // ---------------------------------------------------------------------------
  const getChatMessages = () => {
    if (!selectedConversation) return;
    const request = createRpcRequest("getMessages", {
      chat_id: selectedConversation,
      page: 1,
      page_size: 100
    });
    sendMessage(request);
  };

  const getPopUps = () => {
    if (!selectedConversation) return;
    const request = createRpcRequest("get_popups", {
      chat_id: selectedConversation,
    });
    sendMessage(request);
  }

  // ---------------------------------------------------------------------------
  // handleReadMessage
  // ---------------------------------------------------------------------------
  const handleReadMessage = (counter: number) => {
    if (!selectedConversation) return;
    const request = createRpcRequest("readMessage", {
      chat_id: selectedConversation,
      last_read_counter: counter
    });
    sendMessage(request);
  }


  // ---------------------------------------------------------------------------
  // handleForwardMessage
  // ---------------------------------------------------------------------------
  const handleForwardMessage = (forwardData: ForwardData) => {
    const { message_ids, source_chat_id, target_chat_id } = forwardData;
    sendMessage(createRpcRequest("forwardMessages", {
      message_ids,
      source_chat_id,
      target_chat_id
    }));
  }

  // ---------------------------------------------------------------------------
  // sendChatMessage
  // ---------------------------------------------------------------------------
  const sendChatMessage = useCallback((reply?: ChatMessage | null, media?: string[] | null, is_voice_message?: boolean, type?: "audio") => {
    if (!selectedConversation) return;
    const replyId = reply?.id ?? null;
    const rpcId = Date.now().toString();
    const content = newMessage.trim();
    let pendingMedia: Media[] | null = null;
    if (type === "audio") {
      pendingMedia = [{
        extension: "mp3",
        media_id: media?.[0] ?? "",
        media_type: "audio",
        mime_type: "audio/mpeg",
        name: "audio",
        size: 0,
      }]
    }
    const pendingMsg: ChatMessage = {
      id: rpcId,
      authorId: getCookie("user_id"),
      sender_first_name: "user",
      sender_last_name: "",
      content: content,
      is_pinned: false,
      media: pendingMedia || media || null,
      has_attachements: !!media?.length,
      is_voice_message: is_voice_message ?? false,
      timestamp: dayjs().toISOString(),
      pending: true,
      chat_id: selectedConversation,
      reply_to: replyId,
    };
    setMessagesByChat((prev) => {
      const existing = prev[selectedConversation] || [];
      return { ...prev, [selectedConversation]: [...existing, pendingMsg] };
    });

    sentMessageIdsRef.current.add(rpcId);

    // Send as JSON-RPC
    sendMessage(createRpcRequest("sendMessage", {
      chat_id: selectedConversation,
      content,
      is_pinned: false,
      has_attachments: !!media?.length,
      media: media || null,
      is_voice_message: is_voice_message ?? false,
      reply_to: replyId,
      timestamp: dayjs().toISOString()
    }));
    
    setNewMessage("");
    notificationAudioRef.current.play().catch((error) => {
      console.error("Failed to play notification.mp3:", error);
    });
  }, [selectedConversation, newMessage, addMessagesToChat, sendMessage]);

  // ---------------------------------------------------------------------------
  // deleteMessage
  // ---------------------------------------------------------------------------
  const deleteMessage = useCallback((messageId: string) => {
    if (!selectedConversation) return;
    sendMessage(createRpcRequest("deleteMessage", {
      message_id: messageId,
      chat_id: selectedConversation
    }));
    setMessagesByChat((prev) => {
      const updated = { ...prev };
      for (const cId of Object.keys(updated)) {
        updated[cId] = updated[cId].filter((m) => m.id !== messageId);
      }
      return updated;
    });
    getChatMessages();
  }, [selectedConversation, sendMessage]);

  // ---------------------------------------------------------------------------
  // handleEditMessage
  // ---------------------------------------------------------------------------
  const sendEditMessage = (message: ChatMessage) => {
    if (!selectedConversation) return;
    sendMessage(createRpcRequest("editMessage", {
      message_id: message.id,
      chat_id: selectedConversation,
      content: message.content
    }));
  };

  // ---------------------------------------------------------------------------
  // handleSubscribeToNotfications
  // ---------------------------------------------------------------------------
  const handleSubscribeToNotfications = () => {
    sendMessage({
      type: "subscribe",
      channel: "notifications",
    });
  }

  // ---------------------------------------------------------------------------
  // handleSubscribeToPopUp
  // ---------------------------------------------------------------------------
  const handleSubscribeToPopUp = () => {
    sendMessage({
      type: "subscribe",
      channel: "popup",
    });
  }

  // ---------------------------------------------------------------------------
  // unSubscribeToPopUp
  // ---------------------------------------------------------------------------
  const unSubscribeToPopUp = () => {
    sendMessage({
      type: "unsubscribe",
      channel: "popup",
    });
  }

  // ---------------------------------------------------------------------------
  // Subscribe/unsubscribe to specific chat rooms when selectedConversation changes
  // ---------------------------------------------------------------------------
  useEffect(() => {
    // If previously selected a conversation, unsubscribe from it
    if (prevConversationRef.current) {
      unsubscribeToChatRoom(prevConversationRef.current);
      unSubscribeToPopUp();
    }
    // Subscribe to the newly selected conversation
    if (selectedConversation && isConnected) {
      subscribeToChatRoom(selectedConversation);
      handleSubscribeToPopUp();
    }
    prevConversationRef.current = selectedConversation;
  }, [selectedConversation, isConnected]);

  useEffect(() => {
    handleSubscribeToNotfications();
  }, [isConnected]);

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
      handleGetChatInfo();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedConversation, isConnected]);

  useEffect(() => {
    if (selectedConversation) {
      getPopUps();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedConversation]);

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
  }, [messagesByChat, selectedConversation]);

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
    messagesByChat,
    setMessagesByChat,
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
    handlePinMessage,
    handleUnpinMessage,
    handleForwardMessage,
    handleTyping,
    addParticipantsToAuctionChat,
    handleReadMessage,
    typingStatuses,
    popUpsByChat,
    handlePopUpButtonAction,
  };
};
