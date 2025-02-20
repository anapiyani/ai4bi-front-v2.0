import { Button } from '@/components/ui/button'
import { getCookie } from '@/src/app/api/service/cookie'
import { useTranslations } from "next-intl"


const ScreenShareContent = () => {
	const t = useTranslations('dashboard');
	const user_role = getCookie('role');

	return (
		<div className="w-full h-full">
			<div className='flex justify-between items-center'>
				<div>
					<h1 className='text-brand-gray text-lg font-semibold'>{t("demonstration_of_technical_council")}</h1>
				</div>
				<div>
					<Button>
						{t("start_demonstration")}
					</Button>
				</div>
			</div>
		</div>
	)
}

export default ScreenShareContent;