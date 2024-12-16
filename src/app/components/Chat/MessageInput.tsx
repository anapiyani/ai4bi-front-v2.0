import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useState } from 'react'

type MessageInputProps = {
	t: any,
	sendMessage: (message: string) => void,
}

const MessageInput = ({
	t,
	sendMessage,
}: MessageInputProps) => {
	const [message, setMessage] = useState<string>("");

	const handleSendMessage = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		await sendMessage(message);
		setMessage("");
	}

	return (
		<form onSubmit={(e) => handleSendMessage(e)} className='flex justify-between items-center gap-2 w-full'>
			<Input placeholder={t("type-your-message-here")} onChange={(e) => setMessage(e.target.value)} value={message} className='w-full focus:outline-none' />
			<Button type='submit'>
				{t("send")}
			</Button>
		</form>
	)
}

export default MessageInput