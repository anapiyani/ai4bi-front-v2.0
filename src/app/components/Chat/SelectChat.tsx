import { useTranslations } from 'next-intl'
import Icons from '../Icons'


const SelectChat = () => {
	const t = useTranslations("dashboard");

	return (
		<div className="flex justify-center items-center h-full mt-5">
      <div className="flex flex-col gap-2 items-center">
				<Icons.Select_chat />
        <h2 className="text-secondary-foreground text-base font-semibold">{t("chats-not-selected")}</h2>
				<p className="text-sm">{t("chats-not-selected-description")}</p>
      </div>
    </div>
	)
}

export default SelectChat;