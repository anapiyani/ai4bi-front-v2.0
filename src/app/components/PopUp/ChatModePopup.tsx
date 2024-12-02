import { useTranslations } from 'next-intl'
import { PopUpHandlers } from '../../types/types'
import { PopUp } from './PopUp'

const ChatModePopup = (handlers: PopUpHandlers) => {
	const t = useTranslations("dashboard")
	return (
		<PopUp open={true} title={t("leave-chat-mode")} description={t("leave-chat-mode-description")} t={t} handlers={handlers} />
	)
}

export default ChatModePopup;