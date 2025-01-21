import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { useTranslations } from 'next-intl'

const DeleteMessage = ({ isOpen, onClose, onDelete }: { isOpen: boolean, onClose: () => void, onDelete: () => void }) => {
	const t = useTranslations('dashboard')

	return (
		<AlertDialog open={isOpen} onOpenChange={onClose}>
			<AlertDialogContent className="bg-popover w-fit">
				<AlertDialogHeader>	
					<AlertDialogTitle>
						{t('are-you-sure-you-want-to-delete-this-message')}
					</AlertDialogTitle>
				</AlertDialogHeader>
				<AlertDialogDescription className="text-muted-foreground">
					{t('action-cannot-be-undone')}
				</AlertDialogDescription>
				<AlertDialogFooter className="mt-4">
					<Button onClick={onClose}>{t('cancel')}</Button>
					<Button onClick={onDelete} className="bg-destructive text-white hover:bg-destructive/90">
						{t('delete')}
					</Button>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	)
}

export default DeleteMessage