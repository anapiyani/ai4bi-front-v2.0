import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { useTranslations } from 'next-intl'
import { PopUpHandlers } from '../../types/types'
import Icons from '../Icons'
import AuctionPopup from './AuctionPopup'
import ChatModePopup from './ChatModePopup'
import TechnicalCouncilPopup from './TechnicalCouncilPopup'

type PopUpProps = {
	open: boolean,
	title: string,
	description: string,
	t: ReturnType<typeof useTranslations>,
	handlers: PopUpHandlers
}

type PopUpFactoryProps = {
	type: string | null,
	handlers: PopUpHandlers
}

const PopUp = ({open, title, description, t, handlers}: PopUpProps) => {
	return (
		<AlertDialog open={open}>
			<AlertDialogContent className='bg-primary-foreground px-8 py-8'>
				<div className='flex items-center gap-2 justify-end'>
					<Button className='p-0 m-0 h-auto w-auto' variant='ghost' onClick={() => {
						handlers.stayButtonClick()
					}}><Icons.Close /></Button>
				</div>
				<AlertDialogHeader>
					<AlertDialogTitle className='text-secondary-foreground flex items-center justify-center text-2xl font-bold'>
						{title}
					</AlertDialogTitle>
				</AlertDialogHeader>
				<AlertDialogDescription className='text-muted-foreground flex items-center gap-2 justify-center text-sm font-medium'>
					{description}
				</AlertDialogDescription>
				<AlertDialogFooter className="mt-4">
					<AlertDialogCancel onClick={() => {
						handlers.stayButtonClick()
					}}>{t("stay")}</AlertDialogCancel>
					<AlertDialogAction className='bg-destructive text-destructive-foreground hover:bg-destructive/90' onClick={() => {
						handlers.exitButtonClick()
					}}>{t("exit")}</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	)
}

const PopUpFactory = ({type, handlers}: PopUpFactoryProps) => {
	switch (type) {
		case "auction":
			return <AuctionPopup {...handlers} />
		case "technical-council":
			return <TechnicalCouncilPopup {...handlers} />
		case "chat":	
			return <ChatModePopup {...handlers} />
		default:
			return null
	}
}

export { PopUp, PopUpFactory }
