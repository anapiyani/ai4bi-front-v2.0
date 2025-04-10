import { Button } from '@/components/ui/button'
import { useTranslations } from 'next-intl'



const OnProgress = ({
	conference_type,
	handleJoinToCall
}: {
	conference_type: "tender" | "tech_council" | "group" | "private";
	handleJoinToCall: () => void;
}) => {
	const t = useTranslations("dashboard");
	
  return (
		<div className='flex justify-between w-full h-16 bg-brand-darkOrange px-4'>
			<div className='flex items-center'>
				<h1 className='text-white font-semibold text-xs md:text-base lg:text-base'>{conference_type === "tech_council" ? t("technical_council_on_progress") : conference_type === "tender" ? t("auction_on_progress") : conference_type === "group" ? t("group_on_progress") : t("private_on_progress")}</h1>
			</div>
			<div className='flex items-center'>
				<Button onClick={handleJoinToCall} className="text-brand-gray" variant="secondary">
					<span className="hidden md:inline">{t("join_to_call")}</span>
					<span className="md:hidden text-[10px] md:text-sm lg:text-sm">{t("join")}</span>
				</Button>
			</div>
		</div>
  );
};

export default OnProgress;