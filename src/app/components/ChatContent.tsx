"use client"

import ChatHeader from '@/src/app/components/Chat/ChatHeader'
import dayjs from 'dayjs'
import { useTranslations } from 'next-intl'
import { useState } from 'react'
import { getCookie } from '../api/service/cookie'
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
  scrollRef: React.RefObject<HTMLDivElement>
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
  scrollRef
}: ChatContentProps) => {
  const t = useTranslations('dashboard')
  const [openRescheduleModal, setOpenRescheduleModal] = useState<boolean>(false);
  if (!chatId) {
    return (
      <div className='flex justify-center items-center h-full mt-5'>
        <p className='text-secondary-foreground text-base font-semibold'>{t('select-chat')}</p>
      </div>
    ) 
  }

  // For use in future but not sure if we need it
  // const CHAT_STATUSES = {
  //   PLANNED_TECHNICAL_COUNCIL: 'planned_technical_council',
  //   PLANNED_AUCTION: 'planned_auction',
  //   TIME_TO_START_TECHNICAL_COUNCIL: 'time_to_start_technical_council',
  //   TIME_TO_START_AUCTION: 'time_to_start_auction',
  //   AUCTION_ON_PROGRESS: 'auction_on_progress',
  //   TECHNICAL_COUNCIL_ON_PROGRESS: 'technical_council_on_progress'
  // } 

  // const shouldShowChatComponents = [
  //   CHAT_STATUSES.TIME_TO_START_AUCTION,
  //   CHAT_STATUSES.TIME_TO_START_TECHNICAL_COUNCIL,
  //   CHAT_STATUSES.AUCTION_ON_PROGRESS,
  //   CHAT_STATUSES.TECHNICAL_COUNCIL_ON_PROGRESS
  // ].includes(chat.chat_status as keyof typeof CHAT_STATUSES)

  // const isPlannedState = chat.chat_status === CHAT_STATUSES.PLANNED_TECHNICAL_COUNCIL || chat.chat_status === CHAT_STATUSES.PLANNED_AUCTION


  // const isTimeToStartState = chat.chat_status === CHAT_STATUSES.TIME_TO_START_TECHNICAL_COUNCIL || chat.chat_status === CHAT_STATUSES.TIME_TO_START_AUCTION

  // const handleStart = (type: "technical-council" | "auction", id: string) => {
  //   window.location.href = `/dashboard?active_tab=${type}&id=${id}`
  // }

  return (
    <div className='flex flex-col w-full h-full'>
      <ChatHeader 
        title={title}
        onClickAboutAuction={() => {}}
        t={t} 
      />
      
      <div className="flex-grow overflow-y-auto">
          {/* {isPlannedState && (
            <PlannedType 
              id={chat.id} 
              status={chat.chat_status as "planned_auction" | "planned_technical_council"} 
              date={chat.date} 
              time={chat.time} 
              onRescheduleClick={() => {}}
              onDeclineClick={() => {}}
            />
          )} */}

        {/* {isTimeToStartState && (
          <TimeToStartAucTech
            onRescheduleClick={() => {
              setOpenRescheduleModal(true)
            }} 
            onStartClick={() => {
              handleStart(chat.chat_status === CHAT_STATUSES.TIME_TO_START_TECHNICAL_COUNCIL ? "technical-council" : "auction", chat.id);
            }} 
            date={chat.date}
            time={chat.time} 
            type={chat.chat_status === CHAT_STATUSES.TIME_TO_START_TECHNICAL_COUNCIL ? "technical-council" : "auction"}
          />
        )} */}

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
            <div className='flex flex-col gap-2'>
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
                      timestamp={dayjs(message.timestamp).format('HH:mm')}
                      showSender={showSender}
                    />
                  )
                })}
            </div>
          </div>
        </div>
        {/* {shouldShowChatComponents && ( */}
        <div className='px-5 w-full mt-auto'>
          <MessageInput 
            t={t} 
            value={newMessage}
            setNewMessage={setNewMessage}
            isConnected={isConnected}
            sendChatMessage={sendChatMessage}
          />
        </div>
        {/* )} */}
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
