// will be only on the chat mode and technical council pages!
import { Button } from '@/components/ui/button'
import Icons from '@/src/app/components/Icons'
import { useTranslations } from 'next-intl'

type ChatHeaderProps = {
	title: string,
	onClickAboutAuction: () => void
	t: ReturnType<typeof useTranslations>,
}

const ChatHeader = ({title, onClickAboutAuction, t}: ChatHeaderProps) => {
	return (
		<div className='grid grid-cols-10 justify-between items-center border-b border-gray-200 px-5'>
			<div className='col-span-8 grid-rows-2 flex gap-2'>
				<h1 className='text-secondary-foreground text-base font-semibold px-3'>{title}</h1>
			</div>
			<span className="col-span-1 grid grid-cols-1 h-1/2 w-0.5 bg-gray-200 justify-self-center"></span>
			<div className='col-span-1 grid grid-cols-1 items-center gap-2'>
				<Button variant='ghost' onClick={onClickAboutAuction} className='items-center flex flex-col w-20 h-16 pb-4'>
					<Icons.Menu />
					<p className='text-[#616161] text-xs font-normal text-center'>{t('aboutAuction')}</p>
				</Button>
			</div>
		</div>
	)
}

export default ChatHeader