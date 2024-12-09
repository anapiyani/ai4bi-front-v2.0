import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { useLocale, useTranslations } from 'next-intl'

const CommercialProposal = () => {
	const t = useTranslations('dashboard');
	const locale = useLocale();
	return (
		<AlertDialog open={true}>
			<AlertDialogContent className='w-[500px] absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2'>
				<AlertDialogHeader>
					<AlertDialogTitle>
						{t('add-the-commercial-proposal')}
					</AlertDialogTitle>
					<AlertDialogDescription>
						{t("proposal-description-deadline")}
					</AlertDialogDescription>
					<AlertDialogFooter>
						<Button>
							{locale === 'kz' 
								? `${t('CP')} ${t('download')}`
								: `${t('download')} ${t('CP')}`
							}
						</Button>
					</AlertDialogFooter>
				</AlertDialogHeader>
			</AlertDialogContent>
		</AlertDialog>
	)
}

export default CommercialProposal