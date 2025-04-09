'use client'

import { Switch } from '@/components/ui/switch'
import { useTranslations } from 'next-intl'
import Icons from '../../Icons'
import { useState } from 'react'
import {useMuteChatEvent, useUnmuteChatEvent} from "@/src/app/components/Alerts/Notification/useNotification";
import {getCookie} from "@/src/app/api/service/cookie";

interface NotificationProps {
	muted: boolean
	chatId: string
	chatName: string
	event: string
}

const Notification = ({ muted, chatId, chatName, event }: NotificationProps) => {
	const t = useTranslations("dashboard")
	const [isMuted, setIsMuted] = useState(muted)

	const muteMutation = useMuteChatEvent(getCookie("user_id") || "")
	const unmuteMutation = useUnmuteChatEvent(getCookie("user_id") || "")

	const handleToggle = (checked: boolean) => {
		setIsMuted(checked)

		if (checked) {
			muteMutation.mutate({
				chat_id: chatId,
				chat_name: chatName,
				event,
			})
		} else {
			unmuteMutation.mutate({
				chat_id: chatId,
				event,
			})
		}
	}

	return (
		<div className='flex w-full justify-between'>
			<div className='flex items-center gap-2'>
				<Icons.Bell />
				<p className='text-xs'>{t("notification")}</p>
			</div>
			<div className='flex items-center gap-2'>
				<Switch defaultChecked={isMuted} onCheckedChange={handleToggle} />
			</div>
		</div>
	)
}

export default Notification
