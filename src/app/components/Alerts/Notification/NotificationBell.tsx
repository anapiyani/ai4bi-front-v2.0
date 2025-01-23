import { Switch } from '@/components/ui/switch'
import { useTranslations } from 'next-intl'
import Icons from '../../Icons'

const Notification = () => {
	const t = useTranslations("dashboard");

	return (
		<div className='flex gap-2 w-full justify-between'>
			<div className='flex items-center gap-2'>
				<Icons.Bell />
				<p className='text-base '>{t("notification")}</p>
			</div>
			<div className='flex items-center gap-2'>
				<Switch onCheckedChange={(e) => {
					console.log("checked", e) // TODO: add switch logic later
				}} />
			</div>
		</div>
	)
}

export default Notification;