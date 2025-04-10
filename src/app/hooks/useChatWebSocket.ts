"use client"
import { toast } from '@/components/ui/use-toast'
import { useWS } from "@/src/app/api/provider/WebSocketProvider"
import dayjs from 'dayjs'
import { useTranslations } from 'next-intl'
import { useCallback, useEffect, useRef, useState } from 'react'
import { toast as HotToast } from 'react-hot-toast'
import { v4 as uuidv4 } from 'uuid'
import { getCookie } from '../api/service/cookie'
import {
  TAuctionProtocol,
  ChatInfo,
  ChatMessage,
  Conversation,
  ForwardData,
  LastMessage,
  Media,
  MessagesRecord,
  PopUpButtonAction,
  Protocol,
  ReceivedChats,
  TypingStatus
} from '../types/types'

export type PopUpsRecord = {
  [chatId: string]: {
    [popupId: string]: any
  }
}

export type ConferenceRoom = {
  chat_id: string;
  conference_id: string;
  conference_type: string;
  created_at: string;
  is_active: boolean;
}

export type ConferenceRoomsRecord = {
  [chatId: string]: ConferenceRoom;
}

export const useChatWebSocket = () => {
  // ------------------------
  // Incoming Message Listener
  // ------------------------

  const handleWebSocketMessage = async (rawMsg: any) => {
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
      } else if (Array.isArray(message.result)) {
        handleChatsReceived(message.result);
      } else if (message.result.message_id) {
        handleMessageReceived(message.result);
      } else if (message.result.count && message.result.messages) {
        handleMessagesReceived(message.result.messages);
      } else if (message.result.events === "protocol") {
        handleProtocolReceived(message.result.result);
      } else if (message.result.event === "popups") {
        const { result, event, chat_id } = message.result;
        if (Array.isArray(result) && result.length === 0) {
          delete popUpsByChat[chat_id];
        }
      } else if (message.result.auction && message.result.chat) {
        setChatInfo(message.result);
      }
      return;
    }

    if (message.type === "popups" && message.event === "popups") {
      handleReceivedChatPopup(message.data);
    } else if (message.type === "message") {
      switch (message.event) {
        case "new_chat":
          handleChatCreated({
            chat_id: message.data.id,
            name: message.data.user?.name || `Chat with ${message.data.id}`,
          });
          break;
        case "conference_room":
          console.log("conference_room", message.data)
          setConferenceRoomsByChat((prev) => ({
            ...prev,
            [message.data.chat_id]: {
              chat_id: message.data.chat_id,
              conference_id: message.data.conference_id,
              conference_type: message.data.conference_type,
              created_at: message.data.created_at,
              is_active: message.data.is_active,
            }
          }));
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
          console.log("read_message")
          break;
        case "conference_room_stop":
          setConferenceRoomsByChat((prev) => ({
            ...prev,
            [message.data.chat_id]: {
              chat_id: message.data.chat_id,
              conference_id: message.data.conference_id,
              conference_type: message.data.conference_type,
              created_at: message.data.created_at,
              is_active: message.data.is_active,
            }
          }));
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
    } else if (message.event === "updated_popups") {
      const chatId = message.chat_id;
      if (Array.isArray(message.data) && message.data.length === 0) {
        setPopUpsByChat(prev => {
          const updated = { ...prev };
          delete updated[chatId];
          return updated;
        });
      }
    }
    if (message.type === "message_received") {
      console.log("[handleWebSocketMessage] message_received ack:", message);
      return;
    }
    // console.log("[handleWebSocketMessage] Unhandled message:", message);
  };

  // ------------------------
  // WebSocket Basic
  // ------------------------

  const { sendMessage, isConnected, lastMessage } = useWS(handleWebSocketMessage);
  const currentUserId = getCookie("user_id") || null;
  const [currentUser, setCurrentUser] = useState<string | null>(currentUserId);
  const t = useTranslations("dashboard")

  // ------------------------
  // Chat-Related States
  // ------------------------
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [messagesByChat, setMessagesByChat] = useState<MessagesRecord>({});
  const [popUpsByChat, setPopUpsByChat] = useState<PopUpsRecord>({});
  const [conferenceRoomsByChat, setConferenceRoomsByChat] = useState<ConferenceRoomsRecord>({});
  const [typingStatuses, setTypingStatuses] = useState<TypingStatus[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [protocols, setProtocols] = useState<Protocol | TAuctionProtocol[] | null>(null);
  const [chatInfo, setChatInfo] = useState<ChatInfo | null>(null)

  // Refs
  const typingTimeoutsRef = useRef<{ [chatId: string]: ReturnType<typeof setTimeout> }>({});
  const notificationAudioRef = useRef(new Audio("/assets/sounds/notification.mp3"));
  const notification2AudioRef = useRef(new Audio("/assets/sounds/notification2.mp3"));
  const sentMessageIdsRef = useRef<Set<string>>(new Set());
  const [startedUserId, setStartedUserId] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const prevConversationRef = useRef<string | null>(null);
  const currentUserRef = useRef<string | null>(currentUser);


  useEffect(() => {
    notificationAudioRef.current.load();
    notification2AudioRef.current.load();
  });

  useEffect(() => {
    currentUserRef.current = currentUser;
  }, [currentUser]);

  // ------------------------
  // Helpers
  // ------------------------
  function createRpcRequest(method: string, params: Record<string, any> = {}): any {
    return {
      jsonrpc: "2.0",
      method,
      params,
      id: uuidv4(),
    };
  }

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

  // ------------------------
  // Message Handlers
  // ------------------------
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

  const handleProtocolReceived = (protocol: Protocol) => {
    setProtocols(protocol);
  }

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
  };

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

  const handleMessagesReceived = useCallback((msgs: any[]) => {
    if (!selectedConversation) return;
    const transformedMessages: ChatMessage[] = msgs
      .sort((a, b) => new Date(a.send_at).getTime() - new Date(b.send_at).getTime())
      .map((message: any) => ({
        id: message.id,
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

  const handleReceivedChatPopup = useCallback((message: any) => {
    const { body, buttons, chat_id, created_at, expiration_time, header, id, popup_type, user_id } = message || {};
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

  const handlePopUpButtonAction = useCallback((button: PopUpButtonAction, clicked_user_id?: string) => {
    const { popup_id, chatId, user_id, button_id, tech_council_reschedule_date, auction_date }: PopUpButtonAction = button;
    setStartedUserId(clicked_user_id || null);
    setPopUpsByChat(prev => {
      const updated = { ...prev };
      delete updated[chatId];
      return updated;
    });
    console.log("sending message: ", {
      popup_id: popup_id,
      user_id: user_id,
      button_id: button_id,
    })
    sendMessage(createRpcRequest("respond_to_popup", {
      popup_id: popup_id,
      user_id: user_id,
      button_id: button_id,
      tech_council_reschedule_date: tech_council_reschedule_date || null,
      auction_date: auction_date || null
    }));
  }, []);

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

  const handleNewParticipant = useCallback((message: any) => {
    getChats();
    getChatMessages();
  }, []);

  const handlePinMessage = useCallback(({ chat_id, message_id }: { chat_id: string, message_id: string }) => {
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

  const handleUnpinMessage = useCallback(({ chat_id, message_id }: { chat_id: string, message_id: string }) => {
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

  const handleReceivedDeleteMessage = useCallback((message: any) => {
    setMessagesByChat((prev) => {
      const updated = { ...prev };
      for (const cId of Object.keys(updated)) {
        updated[cId] = updated[cId].filter((m) => m.id !== message.message_id);
      }
      return updated;
    });
    setConversations((prev) => prev.map((c) => c.id === message.chat_id ? { ...c, lastMessage: null } : c));
    getChats()
  }, []);

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
    setSelectedConversation(selectedConversation);
  };

  const sendChatMessage = useCallback((message: string, reply?: ChatMessage | null, media?: string[] | null, is_voice_message?: boolean, type?: "audio" | "file" | null) => {
    if (!selectedConversation) return;
    const replyId = reply?.id ?? null;
    const rpcId = (Date.now() + Math.random() * 1000000).toString();
    const content = message.trim();
    let pendingMedia: Media[] | null = null;
    if (type === "audio") {
      pendingMedia = [{
        extension: "mp3",
        id: media?.[0] ?? "",
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

  const handleGetChatInfo = () => {
    if (!selectedConversation) return;
    sendMessage(createRpcRequest("getChatInfo", {
      chat_id: selectedConversation
    }));
  }

  const handleTyping = (status: "typing" | "recording" | "stopped", chat_id: string) => {
    sendMessage(createRpcRequest("setTypingStatus", {
      status,
      chat_id,
      user_first_name: getCookie('first_name')
    }));
  }

  const createPrivateChat = (userId: string) => {
    sendMessage(createRpcRequest("createPrivateChat", {
      user_id: userId
    }));
  };

  const createAuctionChat = (auctionName: string, auctionId: number) => {
    const request = createRpcRequest("createAuctionChat", {
      name: auctionName,
      type: "auction_chat",
      auction_id: auctionId,
      participants: []
    });
    sendMessage(request);
  };

  const PostponeTechAuction = ({type, chat_id, reschedule_date}: {type: "reschedule_tender_date" | "reschedule_tech_council_date", chat_id: string, reschedule_date: string}) => {
    const request = createRpcRequest(type, {
      chat_id: chat_id,
      reschedule_date: reschedule_date,
    })
    sendMessage(request);
  }

  const updateTechnicalMeetingProtocol = (protocol: Protocol) => {
    if (!selectedConversation) return;
    console.log("updateTechnicalMeetingProtocol sending request to update protocol", protocol);
    sendMessage(createRpcRequest("update_technical_meeting_protocol", {
      protocol_id: protocol.id,
      updates: protocol
    }));
  }

  const addAuctionChatParticipant = (user_id: string) => {
    if (!selectedConversation) return;
    sendMessage(createRpcRequest("addParticipant", {
      user_id,
      chat_id: selectedConversation,
      role: "user"
    }));
  };

  const getChats = () => {
    if (!currentUser) return;
    const request = createRpcRequest("getChats", {});
    sendMessage(request);
  };

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

  const handleGetProtocolUpdates = useCallback((tech_council_protocol?: boolean) => {
    if (!selectedConversation) return;
    const request = createRpcRequest("get_protocol", {
      chat_id: selectedConversation,
      tech_council_protocol: tech_council_protocol
    })
    sendMessage(request);
  }, [selectedConversation, sendMessage]);

  const handleReadMessage = (counter: number) => {
    if (!selectedConversation) return;
    const request = createRpcRequest("readMessage", {
      chat_id: selectedConversation,
      last_read_counter: counter
    });
    sendMessage(request);
  }

  const handleForwardMessage = (forwardData: ForwardData) => {
    const { message_ids, source_chat_id, target_chat_id } = forwardData;
    sendMessage(createRpcRequest("forwardMessages", {
      message_ids,
      source_chat_id,
      target_chat_id
    }));
  }

  const sendEditMessage = (message: ChatMessage, newContent: string) => {
    if (!selectedConversation) return;
    sendMessage(createRpcRequest("editMessage", {
      message_id: message.id,
      chat_id: selectedConversation,
      content: newContent
    }));
  };

  const subscribeToChatRoom = (chatId: string) => {
    sendMessage({
      type: "subscribe",
      channel: "chat_room",
      chat_id: chatId,
    });
  };

  const unsubscribeToChatRoom = (chatId: string) => {
    sendMessage({
      type: "unsubscribe",
      channel: "chat_room",
      chat_id: chatId,
    });
  };

  const handleSubscribeToNotfications = () => {
    sendMessage({
      type: "subscribe",
      channel: "notifications",
    });
  }

  const handleSubscribeToPopUp = () => {
    sendMessage({
      type: "subscribe",
      channel: "popup",
    });
  }

  const unSubscribeToPopUp = () => {
    sendMessage({
      type: "unsubscribe",
      channel: "popup",
    });
  }

  const handleSubscribeToProtocols = () => {
    sendMessage({
      type: "subscribe",
      channel: "protocol_updates",
    });
  }

  // ---------------------------------------------------------------------------
  // Effects 
  // ---------------------------------------------------------------------------
  useEffect(() => {
    const userId = getCookie("user_id");
    if (userId) {
      setCurrentUser(userId);
      currentUserRef.current = userId;
    }
  }, []);

  useEffect(() => {
    const hasAuth = getCookie("access_token") && getCookie("user_id");
    if (hasAuth && isConnected) {
      sendMessage({ type: "subscribe", channel: "chat_updates" });
      sendMessage({ type: "subscribe", channel: "chat_room" });
    }
  }, [isConnected]);

  useEffect(() => {
    if (currentUser && isConnected) {
      console.log('Calling getChats(), currentUser:', currentUser, 'isConnected:', isConnected);
      getChats();
    }
  }, [currentUser, isConnected]);

  useEffect(() => {
    const previousChat = prevConversationRef.current;

    if (previousChat) {
      unsubscribeToChatRoom(previousChat);
      unSubscribeToPopUp();
      setPopUpsByChat(prev => {
        const updated = { ...prev };
        delete updated[previousChat];
        return updated;
      });
    }

    if (selectedConversation && isConnected) {
      subscribeToChatRoom(selectedConversation);
      handleSubscribeToPopUp();
    }

    prevConversationRef.current = selectedConversation;
  }, [selectedConversation, isConnected]);

  useEffect(() => {
    handleSubscribeToNotfications();
  }, [isConnected]);

  useEffect(() => {
    if (selectedConversation && isConnected) {
      getChatMessages();
      handleGetChatInfo();
      handleSubscribeToProtocols();
    }
  }, [selectedConversation, isConnected]);

  useEffect(() => {
    if (selectedConversation) {
      getPopUps();
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
  }, [messagesByChat, selectedConversation]);

  return {
    isConnected,
    lastMessage,
    currentUser,
    setCurrentUser,
    conversations,
    setConversations,
    selectedConversation,
    setSelectedConversation,
    messagesByChat,
    setMessagesByChat,
    newMessage,
    setNewMessage,
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
    conferenceRoomsByChat,
    handlePopUpButtonAction,
    startedUserId,
    protocols,
    handleGetProtocolUpdates,
    updateTechnicalMeetingProtocol,
    chatInfo,
    PostponeTechAuction
  };
};
