"use client";

import ChatHeader from "@/src/app/components/Chat/ChatHeader"
import dayjs from "dayjs"
import { useTranslations } from "next-intl"
import { useState } from "react"
import { getCookie } from "../api/service/cookie"
import { useGoToMessage } from '../hooks/useGoToMessage'
import { ChatContentProps, ChatMessage } from "../types/types"
import DropZoneModal from './Chat/Files/DropZoneModal'
import Message from "./Chat/Message"
import MessageInput from "./Chat/MessageInput"
import PinnedMessages from './Chat/PinnedMessages'
import SelectChat from './Chat/SelectChat'
import ChangeDates from "./Form/ChangeDates"

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
  handleTyping,
  typingStatuses,
  openMenu,
  handleForwardMessage,
}: ChatContentProps) => {
  const t = useTranslations("dashboard");
  const [openRescheduleModal, setOpenRescheduleModal] = useState<boolean>(false);
  const [editMessage, setEditMessage] = useState<ChatMessage | null>(null);
  const [replyTo, setReplyTo] = useState<ChatMessage | null>(null);
  const pinnedMessages = messages.filter((m) => m.is_pinned);
  const [openDropZoneModal, setOpenDropZoneModal] = useState<boolean>(false);
  const goToMessage = useGoToMessage();

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

  const handleSendMedia = (uuids: string[]) => {
    sendChatMessage(null, uuids);
  }

  const handleForward = (message_id: string) => {
    const target_chat_id = prompt("Enter the chat id to forward to");
    if (target_chat_id) {
      handleForwardMessage({message_ids: [message_id], source_chat_id: chatId, target_chat_id: target_chat_id});
    }
  }

  const handleTypingChat = (status: "typing" | "recording" | "stopped") => {
    handleTyping(status, chatId);
  }

  return (
    <div className="flex flex-col w-full h-full relative">
      <ChatHeader 
        title={title} 
        typingStatuses={typingStatuses}
        t={t} 
        onClickAboutAuction={() => {
          setOpenMenu(true);
        }}
        openMenu={openMenu} 
      />
      <div className="absolute top-[65px] left-0 right-0">
        <PinnedMessages 
          goToMessage={goToMessage} 
          pinnedMessages={pinnedMessages} 
          t={t} 
          handleUnpinMessage={(messageId: string) => handlePinUnpin(messageId, true)} 
        />
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
                      handleForward={() => handleForward(message.id)}
                      replyToMessage={
                        replyToSnippet
                          ? {
                              sender: replyToSnippet.sender_first_name,
                              content: replyToSnippet.content,
                              has_attachments: replyToSnippet.has_attachments || false,
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
        <div className="px-5 w-full mt-auto">
          <MessageInput
            t={t}
            handleTypingChat={handleTypingChat}
            value={newMessage}
            setNewMessage={setNewMessage}
            isConnected={isConnected}
            sendChatMessage={sendChatMessage}
            replyTo={replyTo}
            setReplyTo={setReplyTo}
            editMessage={editMessage}
            setEditMessage={setEditMessage}
            handleEdit={handleEdit}
            openDropZoneModal={openDropZoneModal}
            setOpenDropZoneModal={setOpenDropZoneModal}
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
    </div>
  );
};

export default ChatContent;
