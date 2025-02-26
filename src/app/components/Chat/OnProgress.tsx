import { Button } from '@/components/ui/button'
import { useTranslations } from 'next-intl'



const OnProgress = ({
	conference_type,
	handleJoinToCall
}: {
	conference_type: string;
	handleJoinToCall: () => void;
}) => {
	const t = useTranslations("dashboard");
	
  return (
		<div className='flex justify-between w-full h-16 bg-brand-darkOrange px-4'>
			<div className='flex items-center '>
				<h1 className='text-white font-semibold text-base'>{t("technical_council_on_progress")}</h1>
			</div>
			<div className='flex items-center'>
				<Button onClick={handleJoinToCall} className="text-brand-gray" variant="secondary">
					{t("join_to_call")}
				</Button>
			</div>
		</div>
  );
};

export default OnProgress;