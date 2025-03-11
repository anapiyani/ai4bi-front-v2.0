// will be only on the chat mode and technical council pages!
import { Button } from '@/components/ui/button'
import Icons from '@/src/app/components/Icons'
import { useTranslations } from 'next-intl'
import { TypingStatus } from '../../types/types'

type ChatHeaderProps = {
	title: string,
	onClickAboutAuction: () => void
	t: ReturnType<typeof useTranslations>,
	openMenu?: boolean;
	typingStatuses: TypingStatus[];
	onMobileBack?: () => void;
}

const ChatHeader = ({title, onClickAboutAuction, t, openMenu, typingStatuses, onMobileBack}: ChatHeaderProps) => {
	return (
		<div className='flex flex-row justify-between bg-neutrals-secondary items-center border-b border-gray-200 px-2 sm:px-5 min-w-0'>
			<div onClick={onMobileBack} className='items-center gap-2 flex lg:hidden'>
				<Icons.ArrowLeft />
			</div>
			<div className='flex-1 flex gap-2 flex-col overflow-hidden'>
				<div className='w-fit flex flex-col h-16 justify-center min-w-0'>
					<h1 onClick={onClickAboutAuction} className='text-secondary-foreground text-sm lg:text-base font-semibold px-3 items-center flex truncate w-full'>{title}</h1>
					<div className={`text-xs font-normal px-3 items-center flex ${typingStatuses.length > 0 ? 'text-muted-foreground' : 'text-primary-foreground'}`}>
						{typingStatuses.length > 0 ? (
							<div className='flex items-center gap-1 truncate'>
								<Icons.AnimatedPencil className='w-4 h-4 flex-shrink-0' />
								<span className='truncate'>{typingStatuses.map((status) => status.user_first_name).join(", ")} {typingStatuses.map((status) => status.status === "recording" ? t("isRecording") : t("isTyping")).join(", ")}</span>
							</div>
						) : (
							<p className='text-primary-foreground text-xs font-normal px-3 items-center flex'>.</p>
						)}
					</div>
				</div>
			</div>
			{
				openMenu ? <div></div> : <>
				<span className="hidden sm:block w-0.5 h-1/2 bg-gray-200"></span>
				<div className='flex-shrink-0'>
					<Button variant='ghost' onClick={onClickAboutAuction} className='items-center flex flex-col w-16 sm:w-20 h-16 pb-4'>
						<Icons.Menu />
						<p className='text-[#616161] text-[10px] md:text-xs lg:text-xs font-normal text-center'>{t('aboutAuction')}</p>
					</Button>
				</div>
				</>
			}
		</div>
	)
}

export default ChatHeader