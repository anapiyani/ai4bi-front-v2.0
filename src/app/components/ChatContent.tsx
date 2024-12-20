import ChatHeader from '@/src/app/components/Chat/ChatHeader'
import { useChat } from "@/src/app/hooks/useChat"
import { useTranslations } from 'next-intl'
import TimeToStartAucTech from './Alerts/Organizers/TimeToStartAucTech'
import JoinLeftMessage from './Chat/JoinLeftMessage'
import Message from './Chat/Message'
import MessageInput from './Chat/MessageInput'
import PlannedType from './Chat/PlannedType'

/**
 * ChatContent component displays the chat interface for auctions and technical councils.
 * It handles different chat states and renders appropriate components based on chat status.
 */
const ChatContent = ({ chatId }: { chatId: string }) => {
  const t = useTranslations('dashboard')
  const chat = useChat(chatId)

  // Early return if chat data is not available
  if (!chat?.id || !chatId) {
    return (
      <div className='flex justify-center items-center h-full mt-5'>
        <p className='text-secondary-foreground text-base font-semibold'>{t('select-chat')}</p>
      </div>
    ) 
  }

  // Constants for chat statuses to avoid magic strings and improve maintainability
  const CHAT_STATUSES = {
    PLANNED_TECHNICAL_COUNCIL: 'planned_technical_council',
    PLANNED_AUCTION: 'planned_auction',
    TIME_TO_START_TECHNICAL_COUNCIL: 'time_to_start_technical_council',
    TIME_TO_START_AUCTION: 'time_to_start_auction',
    AUCTION_ON_PROGRESS: 'auction_on_progress',
    TECHNICAL_COUNCIL_ON_PROGRESS: 'technical_council_on_progress'
  } 

  // Determine if chat input components should be shown
  const shouldShowChatComponents = [
    CHAT_STATUSES.TIME_TO_START_AUCTION,
    CHAT_STATUSES.TIME_TO_START_TECHNICAL_COUNCIL,
    CHAT_STATUSES.AUCTION_ON_PROGRESS,
    CHAT_STATUSES.TECHNICAL_COUNCIL_ON_PROGRESS
  ].includes(chat.chat_status as keyof typeof CHAT_STATUSES)

  // Helper function to determine if chat is in planned state
  const isPlannedState = chat.chat_status === CHAT_STATUSES.PLANNED_TECHNICAL_COUNCIL || chat.chat_status === CHAT_STATUSES.PLANNED_AUCTION

  // Helper function to determine if chat is in "time to start" state                 
  const isTimeToStartState = chat.chat_status === CHAT_STATUSES.TIME_TO_START_TECHNICAL_COUNCIL || chat.chat_status === CHAT_STATUSES.TIME_TO_START_AUCTION

  return (
    <div className='flex flex-col w-full h-full'>
      <ChatHeader 
        title={chat.title} 
        onClickAboutAuction={() => {}} // TODO: Implement auction details handler
        t={t} 
      />
      
      <div className="flex-grow overflow-y-auto">
        {isPlannedState && (
          <PlannedType 
            id={chat.id} 
            status={chat.chat_status as "planned_auction" | "planned_technical_council"} 
            date={chat.date} 
            time={chat.time} 
            onRescheduleClick={() => {}} // TODO: Implement reschedule handler
            onDeclineClick={() => {}} // TODO: Implement decline handler
          />
        )}

        {isTimeToStartState && (
          <TimeToStartAucTech 
            open={false} 
            setOpen={() => {}} // TODO: Implement open/close handler
            date={chat.date}
            time={chat.time} 
            type={chat.chat_status === CHAT_STATUSES.TIME_TO_START_TECHNICAL_COUNCIL ? "technical-council" : "auction"}
          />
        )}

        {/* Chat messages section */}
        <div className="p-5 gap-2 flex flex-col">
          {/* Participant join/leave messages */}
          {chat.participant_actions?.map((participant) => (
            <JoinLeftMessage 
              key={participant.id}
              participant_name={participant.name} 
              type={participant.type as "technical_council" | "auction"} 
              action={participant.action as "joined" | "left" | "active"} 
              t={t} 
            />
          ))}
          
          {/* Chat messages */}
          {chat.messages?.map((message: any) => (
            <Message
              key={message.id}
              message={message.message} 
              sender={message.name} 
              t={t} 
            />
          ))}
        </div>
      </div>

      {shouldShowChatComponents && (
        <div className='px-5 w-full mt-auto'>
          <MessageInput 
            t={t} 
            sendMessage={() => {}} // TODO: Implement message sending handler
          />
        </div>
      )}
    </div>
  )
}

export default ChatContent
