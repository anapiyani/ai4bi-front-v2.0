"use client";

import ChatHeader from "@/src/app/components/Chat/ChatHeader"
import dayjs from "dayjs"
import { useTranslations } from "next-intl"
import { useState } from "react"
import { getCookie } from "../api/service/cookie"
import { ChatMessage } from "../types/types"
import Message from "./Chat/Message"
import MessageInput from "./Chat/MessageInput"
import PinnedMessages from './Chat/PinnedMessages'
import SelectChat from './Chat/SelectChat'
import ChangeDates from "./Form/ChangeDates"

interface ChatContentProps {
  chatId: string | null;
  selectedConversation: string | null;
  title: string;
  messages: ChatMessage[];
  isConnected: boolean;
  newMessage: string;
  setNewMessage: (message: string) => void;
  sendChatMessage: (reply?: ChatMessage | null) => void;
  scrollRef: React.RefObject<HTMLDivElement>;
  handleOpenDeleteMessage: (messageId: string) => void;
  createPrivateChat: (userId: string) => void;
  sendEditMessage: (message: ChatMessage) => void;
  setOpenMenu: (open: boolean) => void;
  openMenu: boolean;
  handlePinMessage: ({chat_id, message_id}: {chat_id: string, message_id: string}) => void;
  handleUnpinMessage: ({chat_id, message_id}: {chat_id: string, message_id: string}) => void;
}

const ChatContent = ({
  chatId,
  selectedConversation,
  title,
  messages,
  isConnected,
  newMessage,
  setNewMessage,
  sendChatMessage,
  scrollRef,
  handleOpenDeleteMessage,
  createPrivateChat,
  sendEditMessage,
  setOpenMenu,
  handlePinMessage,
  handleUnpinMessage,
  openMenu,
}: ChatContentProps) => {
  const t = useTranslations("dashboard");
  const [openRescheduleModal, setOpenRescheduleModal] = useState<boolean>(false);
  const [editMessage, setEditMessage] = useState<ChatMessage | null>(null);
  const [replyTo, setReplyTo] = useState<ChatMessage | null>(null);
  const pinnedMessages = messages
    .filter((m) => m.is_pinned)
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  const goToMessage = (messageId: string) => {
    const element = document.getElementById(`message-${messageId}`);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "center" });
      element.classList.add("highlight");
      setTimeout(() => {
        element.classList.remove("highlight");
      }, 1000); 
    } else {
      console.warn(`Element with ID message-${messageId} not found.`);
    }
  };

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

  const handlePin = (message_id: string) => {
    handlePinMessage({chat_id: chatId, message_id: message_id});
  }

  const handleUnpin = (message_id: string) => {
    handleUnpinMessage({chat_id: chatId, message_id: message_id});
  }

  return (
    <div className="flex flex-col w-full h-full relative">
      <ChatHeader 
        title={title} 
        t={t} 
        onClickAboutAuction={() => {
          setOpenMenu(true);
        }}
        openMenu={openMenu} 
      />
     <div className="absolute top-[65px] left-0 right-0">
      <PinnedMessages goToMessage={goToMessage} pinnedMessages={pinnedMessages} t={t} />
     </div>
      <div className="flex-grow overflow-y-auto">
        <div className="h-[calc(100vh-240px)] overflow-y-auto" ref={scrollRef}>
          <div className="flex flex-col gap-2 px-4 py-2">
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
                      sender_id={message.authorId || null}
                      goToMessage={goToMessage} 
                      createPrivateChat={createPrivateChat}
                      message={message.content}
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
                      isEdited={message.is_edited || false}
                      reply_message_id={message.reply_to || null}
                      handlePin={() => handlePin(message.id)}
                      isPinned={message.is_pinned || false}
                      handleUnpin={() => handleUnpin(message.id)}
                      replyToMessage={
                        replyToSnippet
                          ? {
                              sender: replyToSnippet.sender_first_name,
                              content: replyToSnippet.content,
                            }
                          : null
                      }
                    />
                  );
                })}
            </div>
          </div>
        </div>
        <div className="px-5 w-full mt-auto">
          <MessageInput
            t={t}
            value={newMessage}
            setNewMessage={setNewMessage}
            isConnected={isConnected}
            sendChatMessage={sendChatMessage}
            replyTo={replyTo}
            setReplyTo={setReplyTo}
            editMessage={editMessage}
            setEditMessage={setEditMessage}
            handleEdit={handleEdit}
          />
        </div>
      </div>

      {openRescheduleModal && (
        <ChangeDates
          open={openRescheduleModal}
          onClose={() => setOpenRescheduleModal(false)}
          chat_id={chatId}
        />
      )}
    </div>
  );
};

export default ChatContent;
