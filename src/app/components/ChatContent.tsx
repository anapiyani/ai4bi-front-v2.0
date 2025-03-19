"use client";
import { Button } from '@/components/ui/button'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import ChatHeader from "@/src/app/components/Chat/ChatHeader"
import dayjs from "dayjs"
import { useTranslations } from "next-intl"
import { memo, useEffect, useRef, useState } from "react"
import { getCookie } from "../api/service/cookie"
import RenderUsers from '../dashboard/TechnicalCouncil/components/RenderUsers'
import { useGoToMessage } from '../hooks/useGoToMessage'
import { ChatContentProps, ChatMessage, SelectActions } from "../types/types"
import TimeToStartAucTech from './Alerts/Organizers/TimeToStartAucTech'
import DropZoneModal from './Chat/Files/DropZoneModal'
import ForwardMessage from './Chat/ForwardMessage'
import Message from "./Chat/Message"
import MessageInput from "./Chat/MessageInput"
import OnProgress from './Chat/OnProgress'
import PinnedMessages from './Chat/PinnedMessages'
import SelectChat from './Chat/SelectChat'
import Icons from './Icons'

const ChatContent = ({
  chatId,
  selectedConversation,
  title,
  messages,
  isConnected,
  newMessage,
  setNewMessage,
  sendChatMessage,
  handleOpenDeleteMessage,
  sendEditMessage,
  setOpenMenu,
  handlePinMessage,
  handleUnpinMessage,
  participants,
  handleTyping,
  handleReadMessage,
  typingStatuses,
  openMenu,
  handleForwardMessage,
  isTechnicalCouncil,
  openSideMenu,
  conversations,
  handleCreateOrOpenChat,
  setOpenSideMenu,
  popUpsByChat,
  handlePopUpButtonAction,
  conferenceRoomsByChat,
  startedUserId,
  technicalCouncilUsers,
  onMobileBack
}: ChatContentProps) => {
  const t = useTranslations("dashboard");
  const [editMessage, setEditMessage] = useState<ChatMessage | null>(null);
  const [replyTo, setReplyTo] = useState<ChatMessage | null>(null);
  const pinnedMessages = messages.filter((m) => m.is_pinned);
  const [openDropZoneModal, setOpenDropZoneModal] = useState<boolean>(false);
  const [openForwardMessage, setOpenForwardMessage] = useState<boolean>(false);
  const [forwardMessageIds, setForwardMessageIds] = useState<string[] | null>(null);
  const currentChatPopup = popUpsByChat?.[chatId || ""]?.data ?? null;
  const conferenceRoom = conferenceRoomsByChat?.[chatId || ""] ?? null;
  const goToMessage = useGoToMessage();
  const [selectedMessages, setSelectedMessages] = useState<string[]>([]);
  const messagesRef = useRef<HTMLDivElement>(null);
  const [techCouncilMenuValue, setTechCouncilMenuValue] = useState<"chat" | "participants">("chat");
  useEffect(() => {
    if (!messagesRef.current) return;
    messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
  }, [messages, selectedConversation]);


  const handleJoinToCall = () => {
    if (!conferenceRoom) return;
    if (conferenceRoom.is_active) {
      const baseUrl = window.location.origin;
      const url = `${baseUrl}/dashboard?active_tab=technical-council&chat_id=${chatId}&conference_id=${conferenceRoom.conference_id}`;
      window.location.href = url;
    }
  }

  useEffect(() => {
    if (!conferenceRoom || !startedUserId) return;
    if (startedUserId === getCookie("user_id")) {
      handleJoinToCall();
    }
  }, [conferenceRoom, chatId, startedUserId]);

  useEffect(() => {
    if (!messagesRef.current) return;
    let lastSeenCounter = 0;
    let scrollTimer: NodeJS.Timeout | null = null;
    let readTimer: NodeJS.Timeout | null = null;

    const checkVisibleMessages = () => {
      if (!messagesRef.current) return;
      const messageElems = messagesRef.current.querySelectorAll<HTMLDivElement>(".message-item");
      let maxVisibleCounter = lastSeenCounter;
      messageElems.forEach((el) => {
        const rect = el.getBoundingClientRect();
        if (rect.top >= 0 && rect.bottom <= window.innerHeight) {
          const c = parseInt(el.getAttribute("data-counter") || "0", 10);
          if (c > maxVisibleCounter) {
            maxVisibleCounter = c;
          }
        }
      });
      if (maxVisibleCounter > lastSeenCounter) {
        lastSeenCounter = maxVisibleCounter;
      }
    };
    const handleScroll = () => {
      if (scrollTimer) clearTimeout(scrollTimer);
      scrollTimer = setTimeout(() => {
        checkVisibleMessages();
      }, 1000);
    };
    readTimer = setInterval(() => {
      if (lastSeenCounter > 0) {
        handleReadMessage(lastSeenCounter);
      }
    }, 5000);
    messagesRef.current.addEventListener("scroll", handleScroll);
    checkVisibleMessages();
    return () => {
      if (scrollTimer) clearTimeout(scrollTimer);
      if (readTimer) clearInterval(readTimer);
      messagesRef.current?.removeEventListener("scroll", handleScroll);
    };
  }, [selectedConversation, handleReadMessage]);
  
  const handleReplyClick = (message: ChatMessage) => {
    setReplyTo(message);
  };

  const handleEditClick = (message: ChatMessage) => {
    setEditMessage(message);
  };

  const handleEdit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (editMessage) {
      sendEditMessage(editMessage);
      setEditMessage(null);
    }
  };

  if (!chatId || !selectedConversation) {
    return <SelectChat />
  }

  const handlePinUnpin = (message_id: string, isPinned: boolean) => {
    if (isPinned) {
      handleUnpinMessage({chat_id: chatId, message_id: message_id});
    } else {
      handlePinMessage({chat_id: chatId, message_id: message_id}); 
    }
  }

  const handleSendMedia = (uuids: string[], message: string) => {
    sendChatMessage(null, uuids, false, null, message);
    setNewMessage("");
  }

  const handleForwardModal = (message_ids: string | string[]) => {
    setForwardMessageIds(Array.isArray(message_ids) ? message_ids : [message_ids]);
    setOpenForwardMessage(true);
  }

  const handleForward = (message_id: string | string[], target_chat_id: string) => {
    handleForwardMessage({message_ids: Array.isArray(message_id) ? message_id : [message_id], source_chat_id: chatId, target_chat_id: target_chat_id});
    setOpenForwardMessage(false);
    setForwardMessageIds(null);
    window.location.href = `/dashboard?active_tab=chat&id=${target_chat_id}`;
  }

  const handleTypingChat = (status: "typing" | "recording" | "stopped") => {
    handleTyping(status, chatId);
  }

  const handleSelectMessages = (
    action: SelectActions,
    messageId?: string
  ) => {
    switch (action) {
      case "select_all":
        setSelectedMessages(messages.map((m) => m.id));
        break;
      case "unselect_all":
        setSelectedMessages([]);
        break;
      case "select":
        if (messageId) {
          setSelectedMessages((prev) => [...prev, messageId]);
        }
        break;
      case "unselect":
        if (messageId) {
          setSelectedMessages((prev) => prev.filter((m) => m !== messageId));
        }
        break;
      case "delete_selected":
        handleOpenDeleteMessage(selectedMessages);
        break;
      case "forward_selected":
        handleForwardModal(selectedMessages);
        break;
    }
  };

  return (
    <div className="flex flex-col w-full h-full relative py-3 lg:py-0">
    {
      isTechnicalCouncil && setOpenSideMenu ? (
        <div className='flex mt-3 px-3 justify-center'>
          <div>
            <Button onClick={() => setOpenSideMenu(!openSideMenu)} variant="outline" className='p-2 bg-white' >
              {
                openSideMenu ? (
                  <Icons.SideMenu_Open />
                ) : (
                  <Icons.SideMenu />
                )
              }
            </Button>
          </div>
          {
            openSideMenu ? (
              null
            ) : (
              <div className='w-full flex justify-center mr-10'>
                <Tabs defaultValue="chat" value={techCouncilMenuValue} onValueChange={(value) => setTechCouncilMenuValue(value as "chat" | "participants")}>
                  <TabsList className='bg-white'>
                    <TabsTrigger className='text-brand-gray text-sm' value="chat">{t("chat")}</TabsTrigger>
                    <TabsTrigger className='text-brand-gray text-sm' value="participants">{t("participants")}</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            )
          }
        </div>
      ) : (
        <div className="lg:h-full">
          <ChatHeader  
            title={title || ""} 
            typingStatuses={typingStatuses}
            t={t} 
            onClickAboutAuction={() => {
              setOpenMenu(true);
            }}
            openMenu={openMenu} 
            onMobileBack={onMobileBack}
          />
        <div className="absolute top-[65px] left-0 right-0 z-50">
          <PinnedMessages 
            goToMessage={goToMessage} 
            pinnedMessages={pinnedMessages} 
            t={t}
            handleUnpinMessage={(messageId: string) => handlePinUnpin(messageId, true)} 
          />
        </div>
        <div>
          {
            conferenceRoom && conferenceRoom.is_active && (
              <div className="absolute top-[65px] left-0 right-0 z-50">
                <OnProgress conference_type={conferenceRoom.conference_type} handleJoinToCall={handleJoinToCall} />
              </div>
            )
          }
        </div>
        {
          currentChatPopup && currentChatPopup.popup_type && (
            <div className={`absolute top-[${pinnedMessages.length > 0 && conferenceRoom && conferenceRoom.is_active ? "120px" : "70px"}] lg:top-[65px] left-0 right-0 z-50 flex justify-self-center`}>
              <TimeToStartAucTech
                body={currentChatPopup.body}
                popup_id={currentChatPopup.id}
                buttons={currentChatPopup.buttons}
                popup_type={currentChatPopup.popup_type}
                chat_id={currentChatPopup.chat_id}
                created_at={currentChatPopup.created_at}
                expiration_time={currentChatPopup.expiration_time}
                header={currentChatPopup.header}
                user_id={currentChatPopup.user_id}
                handlePopUpButtonAction={handlePopUpButtonAction}
              />
            </div>
          )
        }
        </div>
      )
    }
    {
      openSideMenu ? (
        null
      ) : (
        techCouncilMenuValue === "chat" ? (
          <div className={`flex-grow ${isTechnicalCouncil ? "rounded-lg" : " bg-neutrals-secondary"}`}>
            <div className={`${isTechnicalCouncil ? "h-[calc(90vh-270px)]" : "h-[calc(100dvh-130px)] md:h-[calc(100dvh-180px)] lg:h-[calc(100dvh-240px)]"} overflow-y-auto flex flex-col pb-2`}
            ref={messagesRef}>
              <div className="flex flex-col gap-2 px-4 py-2 w-full mt-auto">
                <div className="flex flex-col gap-1">
                  {messages
                    .filter((m) => m.chat_id === selectedConversation)
                    .sort(
                      (a, b) =>
                        new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
                    )
                    .map((message, index, array) => {
                      const previousMessage = array[index - 1];
                      const showSender =
                        !previousMessage || previousMessage.authorId !== message.authorId;

                      const replyToSnippet = message.reply_to
                        ? messages.find((m) => m.id === message.reply_to)
                        : null;

                      return (
                        <Message
                          key={message.id}
                          counter={message.counter}
                          sender_id={message.authorId || null}
                          goToMessage={goToMessage} 
                          createPrivateChat={handleCreateOrOpenChat}
                          message={message.content}
                          handleSelectMessages={(action: SelectActions) => handleSelectMessages(action, message.id)}
                          selectedMessages={selectedMessages}
                          sender={
                            (message.authorId &&
                              message.authorId === getCookie("user_id")) ||
                            message.sender_first_name === "user"
                              ? "user"
                              : `${message.sender_first_name} ${message.sender_last_name}`
                          }
                          t={t}
                          messageId={message.id}
                          timestamp={dayjs(message.timestamp).format("HH:mm")}
                          showSender={showSender}
                          handleOpenDeleteMessage={handleOpenDeleteMessage}
                          handleReplyClick={() => handleReplyClick(message)}
                          handleEditClick={() => handleEditClick(message)}
                          forwarded_from={message.forwarded_from}
                          forwarded_from_first_name={message.forwarded_from_first_name}
                          forwarded_from_last_name={message.forwarded_from_last_name}
                          isEdited={message.is_edited || false}
                          reply_message_id={message.reply_to || null}
                          handlePin={() => handlePinUnpin(message.id, message.is_pinned || false)}
                          isPinned={message.is_pinned || false}
                          handleUnpin={() => handlePinUnpin(message.id, message.is_pinned || false)}
                          type={message.type}
                          media={Array.isArray(message.media) ? message.media : message.media ? [message.media] : null}
                          handleForward={() => handleForwardModal(message.id)}
                          replyToMessage={
                            replyToSnippet
                              ? {
                                  sender: replyToSnippet.sender_first_name,
                                  content: replyToSnippet.content,
                                  has_attachments: replyToSnippet.has_attachements || false,
                                  media: Array.isArray(replyToSnippet.media) ? replyToSnippet.media : replyToSnippet.media ? [replyToSnippet.media] : null,
                                }
                              : null
                          }
                        />
                      );
                    })}
                </div>
              </div>
            </div>
            <div className={`px-5 w-full mt-auto ${isTechnicalCouncil ? "pb-2" : ""}`}>
              <MessageInput
                t={t}
                handleTypingChat={handleTypingChat}
                value={newMessage}
                setNewMessage={setNewMessage}
                isConnected={isConnected}
                sendChatMessage={sendChatMessage}
                replyTo={replyTo}
                participants={participants}
                chatId={chatId}
                setReplyTo={setReplyTo}
                editMessage={editMessage}
                setEditMessage={setEditMessage}
                handleEdit={handleEdit}
                openDropZoneModal={openDropZoneModal}
                setOpenDropZoneModal={setOpenDropZoneModal}
              />
            </div>
        </div>
        ) : (
          <div className={`${isTechnicalCouncil ? "h-[calc(90vh-50px)]" : "h-[calc(100vh-240px)]"} overflow-y-auto flex flex-col`} ref={messagesRef}>
            {technicalCouncilUsers && 
              <RenderUsers users={technicalCouncilUsers} t={t} />
            }
          </div>
        )
      )
    }
    {
      openDropZoneModal && (
        <DropZoneModal
          open={openDropZoneModal}
          setOpen={setOpenDropZoneModal}
          handleSendMedia={handleSendMedia}
          t={t}
          value={newMessage}
          setNewMessage={setNewMessage}
          chatId={chatId}
        />
      )
    }
    {
      openForwardMessage && (
        <ForwardMessage
          open={openForwardMessage}
          t={t}
          conversations={conversations}
          onClose={() => setOpenForwardMessage(false)}
          handleForward={handleForward}
          forwardMessageIds={forwardMessageIds || []}
        />
      )
    }
  </div>
  );
};

export default memo(ChatContent);
