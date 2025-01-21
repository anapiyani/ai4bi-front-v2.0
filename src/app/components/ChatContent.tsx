"use client"

import ChatHeader from '@/src/app/components/Chat/ChatHeader'
import dayjs from 'dayjs'
import { useTranslations } from 'next-intl'
import { useState } from 'react'
import { getCookie } from '../api/service/cookie'
import { ChatMessage } from '../types/types'
import Message from './Chat/Message'
import MessageInput from './Chat/MessageInput'
import ChangeDates from './Form/ChangeDates'

interface ChatContentProps {
  chatId: string | null,
  selectedConversation: string | null,
  title: string,
  messages: any[],
  isConnected: boolean,
  newMessage: string,
  setNewMessage: (message: string) => void,
  sendChatMessage: () => void,
  scrollRef: React.RefObject<HTMLDivElement>,
  handleOpenDeleteMessage: (messageId: string) => void
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
  const t = useTranslations('dashboard')
  const [openRescheduleModal, setOpenRescheduleModal] = useState<boolean>(false);
  const [replyTo, setReplyTo] = useState<ChatMessage | null>(null)
  
  if (!chatId) {
    return (
      <div className='flex justify-center items-center h-full mt-5'>
        <p className='text-secondary-foreground text-base font-semibold'>{t('select-chat')}</p>
      </div>
    ) 
  }

  const handleReplyClick = (message: ChatMessage) => {
    setReplyTo(message)
  }

  return (
    <div className='flex flex-col w-full h-full'>
      <ChatHeader 
        title={title}
        onClickAboutAuction={() => {}}
        t={t} 
      />
      
      <div className="flex-grow overflow-y-auto">
        <div className="h-[calc(100vh-240px)] overflow-y-auto" ref={scrollRef}>
          {/* {chat.participant_actions?.map((participant) => (
            <JoinLeftMessage
              key={participant.id}
              participant_name={participant.name} 
              type={participant.type as "technical_council" | "auction"} 
              action={participant.action as "joined" | "left" | "active"} 
              t={t} 
            />
          ))} */}
          <div className='flex flex-col gap-2 px-4 py-2'>
            <div className='flex flex-col gap-1'>
            {messages
                .filter((m: any) => m.chat_id === selectedConversation)
                .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()) 
                .map((message: any, index: number, array: any[]) => {
                  const previousMessage = array[index - 1];
                  const showSender = !previousMessage || previousMessage.authorId !== message.authorId;

                  return (
                    <Message
                      key={message.id}
                      message={message.content} 
                      sender={message.authorId && message.authorId === getCookie("user_id") || message.sender_first_name === "user" ? "user" : `${message.sender_first_name} ${message.sender_last_name}`} 
                      t={t}
                      messageId={message.id}
                      timestamp={dayjs(message.timestamp).format('HH:mm')}
                      showSender={showSender}
                      handleOpenDeleteMessage={handleOpenDeleteMessage}
                      handleReplyClick={() => handleReplyClick(message)}
                      replyToMessage={(() => {
                        if (!message.reply_to) return null;
                        const original = messages.find(m => m.id === message.reply_to);
                        return original
                          ? {
                              sender: original.sender_first_name,
                              content: original.content
                            }
                          : null;
                      })()}
                    />
                  )
                })}
            </div>
          </div>
        </div>
        <div className='px-5 w-full mt-auto'>
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
      {
        openRescheduleModal && (
          <ChangeDates 
            open={openRescheduleModal} 
            onClose={() => setOpenRescheduleModal(false)}
            chat_id={chatId}
          />
        )
      }
    </div>
  )
}

export default ChatContent
