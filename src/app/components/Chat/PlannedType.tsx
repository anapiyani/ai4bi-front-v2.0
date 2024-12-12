import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { useTranslations } from 'next-intl'
import Icons from '../Icons'

type PlannedTypeProps = {
	id: string;
	status: "planned_auction" | "planned_technical_council";
	date: string;
	time: string;
	onRescheduleClick: (id: string | number) => void;
	onDeclineClick: (id: string | number) => void;
}

const PlannedType = ({id, status, date, onRescheduleClick, onDeclineClick, time}: PlannedTypeProps) => {
	const t = useTranslations('dashboard')

	return (
		<div className='flex justify-between items-cente px-8 py-3 bg-white'>
			<div className='flex flex-col gap-1'>
				<h2 className='text-sm font-meduim text-secondary-foreground'>{status === "planned_technical_council" ? t("technical-council") : t("auction")}</h2>
				<p className='text-sm text-muted-foreground'>{date} {t('at')} {time}</p>
			</div>
			<div>
				<Popover>
					<PopoverTrigger className='flex items-center justify-center h-full'>
						<Icons.Dots />
					</PopoverTrigger>
					<PopoverContent className='bg-white p-0 w-40'>
						<div className='flex flex-col'>
							<Button variant="ghost" className='text-secondary-foreground text-sm' onClick={() => onRescheduleClick(id)}>{t('reschedule')}</Button>
							<Button variant="ghost" className='text-destructive text-sm' onClick={() => onDeclineClick(id)}>{t('decline')}</Button>
						</div>
					</PopoverContent>
				</Popover>
			</div>
		</div>
	)
}

export default PlannedType;