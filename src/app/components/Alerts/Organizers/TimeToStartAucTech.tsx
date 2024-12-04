import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog'
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
		<AlertDialog open={true}>
			<AlertDialogContent className='w-[500px] absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2'>
				<AlertDialogHeader>
					<AlertDialogTitle>
						{t(`its-time-to-start-the-${type}`)}
					</AlertDialogTitle>
					<AlertDialogDescription>
						{date} / {time}
					</AlertDialogDescription>
					<AlertDialogFooter>
						<Button variant='outline'>
							{t('reschedule')}
						</Button>
						<Button>
							{t('start')}
						</Button>
					</AlertDialogFooter>
				</AlertDialogHeader>
			</AlertDialogContent>
		</AlertDialog>
  )
}

export default TimeToStartAucTech;