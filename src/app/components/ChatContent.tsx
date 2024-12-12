import ChatHeader from '@/src/app/components/Chat/ChatHeader'
import { useChat } from "@/src/app/hooks/useChat"
import { useTranslations } from 'next-intl'
import TimeToStartAucTech from './Alerts/Organizers/TimeToStartAucTech'
import MessageInput from './Chat/MessageInput'
import PlannedType from './Chat/PlannedType'

const ChatContent = ({ chatId }: { chatId: string }) => {
  const t = useTranslations('dashboard')
  const chat = useChat(chatId)

  console.log(chat)

  if (!chat?.id || !chatId) {
    return (
      <div className='flex justify-center items-center h-full mt-5'>
        <p className='text-secondary-foreground text-base font-semibold'>{t('select-chat')}</p>
      </div>
    )
  }

  const show_chat_components = chat.chat_status === "time_to_start_auction" || 
                    chat.chat_status === "time_to_start_technical_council" || 
                    chat.chat_status === "auction_on_progress" ||
                    chat.chat_status === "technical_council_on_progress"

  return (
    <div className='flex flex-col gap-4 w-full h-full'>
      <ChatHeader title={chat.title} onClickAboutAuction={() => {}} t={t} />
      
      <div className="flex-grow overflow-y-auto">
        {(chat.chat_status === "planned_technical_council" || chat.chat_status === "planned_auction") && (
          <PlannedType 
            id={chat.id} 
            status={chat.chat_status} 
            date={chat.date} 
            time={chat.time} 
            onRescheduleClick={() => {}} 
            onDeclineClick={() => {}}
          />
        )}

        {(chat.chat_status === "time_to_start_technical_council" || chat.chat_status === "time_to_start_auction") && (
          <TimeToStartAucTech 
            open={false} 
            setOpen={() => {}} 
            date={chat.date}
            time={chat.time} 
            type={chat.chat_status === "time_to_start_technical_council" ? "technical-council" : "auction"}
          />
        )}

        {/* chat messages component here */}
        <div className="p-5">

        </div>
      </div>

      {show_chat_components && (
        <div className='px-5 w-full mt-auto'>
          <MessageInput t={t} sendMessage={() => {}} />
        </div>
      )}
    </div>
  )
}

export default ChatContent

