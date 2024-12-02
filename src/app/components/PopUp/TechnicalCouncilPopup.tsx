import { useTranslations } from 'next-intl'
import { PopUpHandlers } from '../../types/types'
import { PopUp } from './PopUp'

	
const TechnicalCouncilPopup = (handlers: PopUpHandlers) => {
	const t = useTranslations("dashboard");
	return (
		<PopUp open={true} title={t("leave-technical-council")} description={t("leave-technical-council-description")} t={t} handlers={handlers} />
	)
}

export default TechnicalCouncilPopup;