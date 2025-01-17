"use client"

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

type MessageInputProps = {
	t: any,
	sendChatMessage: () => void,
	isConnected: boolean,
	value: string,
	setNewMessage: (value: string) => void
}

const MessageInput = ({
	t,
	sendChatMessage,
	isConnected,
	value,
	setNewMessage,
}: MessageInputProps) => {
	return (
		<form onSubmit={(e) => {
			e.preventDefault();
      sendChatMessage();
			setNewMessage("");
		}} className='flex justify-between items-center gap-2 w-full'>
			<Input placeholder={t("type-your-message-here")} onChange={(e) => setNewMessage(e.target.value)} value={value} className='w-full focus:outline-none' />
			<Button disabled={!isConnected} type='submit'>
				{t("send")}
			</Button>
		</form>
	)
}

export default MessageInput