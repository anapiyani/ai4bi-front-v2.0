import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { useTranslations } from 'next-intl'


const FinishedForm = ({
	open,
	user,
	auctionDate,
	auctionTime,
}: {
	open: boolean,
	user?: "admin" | "user",
	auctionDate: string,
	auctionTime: string
}) => {
	const t = useTranslations("dashboard")

	return (
		<Dialog open={open}>
			<DialogContent className='w-80 bg-primary-foreground p-8'>
				<DialogHeader className='flex flex-col items-center mt-3'>
					<DialogTitle className='text-center'>
						<h1 className='text-2xl font-bold'>{t("technical-council-completed")}</h1>
					</DialogTitle>
				</DialogHeader>
				<DialogDescription className='text-center'>
					<p className='text-sm text-secondary-foreground font-medium leading-6'>{t("date-of-auction")}: {auctionDate} <br /> {t("time")}: {auctionTime}</p>
				</DialogDescription>
				{
					user === "admin" ? (
						<DialogFooter className='flex justify-between mt-2 sm:justify-between'>
							<Button variant="outline">{t("change")}</Button>
							<Button>{t("confirm")}</Button>
						</DialogFooter>
					) : (
						<DialogFooter className='flex justify-center mt-2 sm:justify-center'>
							<Button>{t("understood")}</Button>
						</DialogFooter>
					)
				}
			</DialogContent>
		</Dialog>
	)
}

export default FinishedForm