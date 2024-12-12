import { Button } from '@/components/ui/button'
import { useTranslations } from 'next-intl'

const TimeToStartAucTech = ({
	open,
	setOpen,
	date,
	time,
	type,
}: {
	open: boolean,
	setOpen: (open: boolean) => void,
	date: string,
	time: string,
	type: 'technical-council' | 'auction'
}) => {
	const t = useTranslations('dashboard')

	return (
			<div className="flex items-center justify-center w-full mt-3">
				<div className="w-[500px] bg-white rounded-lg p-6">
					<div className="space-y-4">
						<div>
							<h2 className="text-lg font-semibold">
								{t(`its-time-to-start-the-${type}`)}
							</h2>
							<p className="text-sm text-gray-500">
								{date} / {time}
							</p>
						</div>
						<div className="flex justify-end gap-3">
							<Button variant='outline'>
								{t('reschedule')}
							</Button>
							<Button>
								{t('start')}
							</Button>
						</div>
					</div>
				</div>
			</div>
		)
}

export default TimeToStartAucTech;