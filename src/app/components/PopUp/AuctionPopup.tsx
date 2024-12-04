import { useTranslations } from 'next-intl'
import { PopUpHandlers } from '../../types/types'
import { PopUp } from './PopUp'

const AuctionPopUp = (handlers: PopUpHandlers) => {
	const t = useTranslations("dashboard");
	return (
		<PopUp open={true} title={t("exit-auction")} description={t("description-exit-auction")} t={t} handlers={handlers} />
	)
}

export default AuctionPopUp;