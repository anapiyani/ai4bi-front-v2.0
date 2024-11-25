
import { useTranslations } from 'next-intl'

const Dashboard = () => {
	const t = useTranslations("dashboard");
	return (
		<div>
			<h1>{t("title")}</h1>
		</div>
	)
}

export default Dashboard;