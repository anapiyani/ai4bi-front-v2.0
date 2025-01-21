"use client";

import ChatHeader from "@/src/app/components/Chat/ChatHeader"
import dayjs from "dayjs"
import { useTranslations } from "next-intl"
import { useState } from "react"
import { getCookie } from "../api/service/cookie"
import { ChatMessage } from "../types/types"
import Message from "./Chat/Message"
import MessageInput from "./Chat/MessageInput"
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
}: ChatContentProps) => {
  const t = useTranslations("dashboard");
  const [openRescheduleModal, setOpenRescheduleModal] = useState<boolean>(false);
  const [replyTo, setReplyTo] = useState<ChatMessage | null>(null);

 const goToMessage = (messageId: string) => {
  console.log(`Highlighting message with ID: message-${messageId}`);
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


  if (!chatId) {
    return (
      <div className="flex justify-center items-center h-full mt-5">
        <p className="text-secondary-foreground text-base font-semibold">
          {t("select-chat")}
        </p>
      </div>
    );
  }

  const handleReplyClick = (message: ChatMessage) => {
    setReplyTo(message);
  };

  return (
    <div className="flex flex-col w-full h-full">
      <ChatHeader title={title} onClickAboutAuction={() => {}} t={t} />

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
                      goToMessage={goToMessage} 
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
                      reply_message_id={message.reply_to || null}
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
