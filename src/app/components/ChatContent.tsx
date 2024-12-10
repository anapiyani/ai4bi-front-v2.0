import ChatHeader from '@/src/app/components/Headers/ChatHeader'
import { useChat } from "@/src/app/hooks/useChat"
import { useTranslations } from 'next-intl'

const ChatContent = ({chatId}: {chatId: string}) => {
	const t = useTranslations('dashboard')
	const chat = useChat(chatId);

  return (
    <div className='flex flex-col gap-4 w-full'>
			{
				chat?.id && chatId ? (
					<div>
						<ChatHeader title={chat.title} onClickAboutAuction={() => {}} t={t} />
						<div className='px-5'>
							
						</div>
					</div>
				) : (
					<div className='flex justify-center items-center h-full mt-5'>
						<p className='text-secondary-foreground text-base font-semibold'>{t('select-chat')}</p>
					</div>
				)
			}
		</div>
  )
}		

export default ChatContent