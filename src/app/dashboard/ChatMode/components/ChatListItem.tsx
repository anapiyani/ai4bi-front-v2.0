import BnectBadge from '@/src/app/components/BnectBadge'
import { ChatListItemData } from '@/src/app/types/types'

type ChatListItemProps = {
	data: ChatListItemData
	onClick: () => void
}

const ChatListItem = ({data, onClick}: ChatListItemProps) => {
	return (
		<div className={`relative flex items-center flex-col p-4 rounded-lg hover:cursor-pointer ${data.active ? 'bg-secondary' : ''}`} onClick={onClick}>
			{data.active && (
				<span className="absolute right-0 h-2/3 w-1 bg-primary"></span>
			)}
			<div className='flex flex-col'>
				<h2 className='text-secondary-foreground text-sm'>{data.title}</h2>
				<div className='flex items-center gap-2'>
					<p className='text-xs text-secondary-foreground'>{data.start_date} - {data.end_date}</p> 
					<BnectBadge status={data.bnect_status} /> 
				</div>
			</div>
		</div>
	)
}

export default ChatListItem;