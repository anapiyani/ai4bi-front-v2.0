import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { useTranslations } from 'next-intl'

type Props = {
	date: string,
	type: 'auction' | 'technical-council'
}

const ToParticipate = ({date, type}: Props) => {
	const t = useTranslations('dashboard');
	return (
		<AlertDialog open={true}>
			<AlertDialogContent className='w-[600px] absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2'>
				<AlertDialogHeader>
					<AlertDialogTitle>
						{
							type === "auction" ? t("tech-con-finished-you-want-participate-auction") : t("tech-con-want-participate")
						}
					</AlertDialogTitle>
				</AlertDialogHeader>
				<AlertDialogDescription>	
						{date} | {t("you-have-48-hours-to-make-a-confirmation")}
				</AlertDialogDescription>
				<AlertDialogFooter>
					<div className='flex gap-3'>
						<Button variant="outline">
							{t('decline')}
						</Button>
						<Button>
							{t('accept')}
						</Button>
					</div>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	)
}

export default ToParticipate;