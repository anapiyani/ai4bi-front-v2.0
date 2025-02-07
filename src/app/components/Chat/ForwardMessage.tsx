import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { SearchBar } from '../../dashboard/ChatMode/components/SearchBar'
import { Conversation } from '../../types/types'

const ForwardMessage = ({open, onClose, t, conversations, handleForward, forwardMessageIds}: {open: boolean, onClose: () => void, t: any, conversations: Conversation[], handleForward: (message_ids: string[], target_chat_id: string) => void, forwardMessageIds: string[]}) => {
	return (
		<Dialog open={open}  onOpenChange={(isOpen) => {
			if (!isOpen) {
				onClose();
			}
		}}>
			<DialogContent className='w-full max-w-md bg-primary-foreground'>
				<DialogHeader>
					<DialogTitle>{t("forward-message")}</DialogTitle>
				</DialogHeader>
				<DialogDescription>
					<SearchBar />
					{
						conversations.map((conversation) => (
							<div onClick={() => handleForward(forwardMessageIds, conversation.id)} key={conversation.id} className='flex items-center justify-between gap-2 my-2 px-3 cursor-pointer'>
								<div className='cursor-pointer'>
									<p>{conversation.name}</p>
								</div>
							</div>
						))
					}
				</DialogDescription>
			</DialogContent>
		</Dialog>
	)
}

export default ForwardMessage;