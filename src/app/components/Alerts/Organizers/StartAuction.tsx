import { Button } from '@/components/ui/button'
import { PopUpButtonAction } from '@/src/app/types/types'
import { useTranslations } from 'next-intl'
import { useState } from 'react'
import ChangeDates from '../../Form/ChangeDates'
import Icons from '../../Icons'

type StartAuctionProps = {
  body: string
  buttons: {
    id: string
    label: string
    button_style: 'primary' | 'secondary' | string,
    action: "STARTED_TENDER" | "RESCHEDULED_TENDER" | "ACCEPTED_PARTICIPATION_TENDER" | "REJECTED_PARTICIPATION_TENDER",
    order_index: number,
  }[]
  chat_id: string
  created_at: string
  expiration_time: string
  header: string
  user_id: string
	popup_id: string
	popup_type: "participation_question_tender" | "tender_start",
  handlePopUpButtonAction: (button: PopUpButtonAction, user_id?: string) => void
}

const StartAuction = ({
	body,
  buttons,
	user_id,
  chat_id,
  created_at,
	popup_id,
  expiration_time,
	popup_type,
  header,
  handlePopUpButtonAction
}: StartAuctionProps) => {
	const [isExpanded, setIsExpanded] = useState(false)
  const t = useTranslations('dashboard')
	const [openRescheduleModal, setOpenRescheduleModal] = useState(false)
	const [rescheduleAction, setRescheduleAction] = useState<"RESCHEDULED_TENDER" | null>(null)
	
	return (
		<div className="flex items-center justify-center w-full mt-3">
			<div className={`bg-white overflow-hidden ${!isExpanded ? "w-[340px] lg:w-[500px] rounded-lg" : "w-[300px] rounded-full"}`}>
			{!openRescheduleModal && !isExpanded ? (
					<div className="w-[340px] lg:w-[500px] bg-white rounded-lg p-6">
						<div className="space-y-4">
							<div className="flex flex-col gap-2">
								<h2 className="text-lg font-semibold">
									{
										popup_type === "participation_question_tender" ? t("tech_council_end") : t("time_to_start_tender")
									}
								</h2>
								<p className="text-sm text-gray-500">
									<p>{expiration_time} {popup_type === "participation_question_tender" ? t("you-have-48-hours-to-make-a-confirmation") : null}</p>
								</p>
							</div>
							<div className="flex justify-end gap-3">
								{
									buttons
									.sort((a, b) => b.order_index - a.order_index)
									.map((button) => (
										<Button 
											key={button.id}
											variant={`${button.button_style === "primary" ? "default" : "outline"}`}
											onClick={() => {
												if (button.action === "STARTED_TENDER") {
													handlePopUpButtonAction({
														popup_id: popup_id,
														user_id: user_id,
														button_id: button.id,
														chatId: chat_id,
													})
												} else {
													setOpenRescheduleModal(true)
													setRescheduleAction("RESCHEDULED_TENDER")
												}
											}}
										>
											{
												button.action === "STARTED_TENDER" ? t("start_auction") : t("reschedule")
											}
										</Button>
									))
								}
							</div>

							<div className="flex justify-center items-center">
								<Button
									onClick={() => setIsExpanded(true)}
									variant="ghost"
									className="w-fit h-fit flex justify-center items-center hover:bg-transparent"
									size="icon"
								>
									<Icons.ArrowUp />
								</Button>
							</div>
						</div>
					</div>
				) : (
					<ChangeDates
						open={openRescheduleModal}
						onClose={() => setOpenRescheduleModal(false)}
						rescheduleData={(datetime) => {
							handlePopUpButtonAction({
								popup_id: popup_id,
								user_id: user_id,
								button_id: buttons.find((button) => button.action === rescheduleAction)?.id || '',
								chatId: chat_id,
								auction_date: datetime,
							})
						}}
						rescheduleAction={rescheduleAction as "RESCHEDULED_TENDER" | null}
						chat_id={chat_id}
					/>
				)}

				{isExpanded && (
					<div className="w-full bg-white rounded-full py-3 px-4">
						<div className="flex justify-between items-center">
							<div className="flex gap-2 items-center">
								<Icons.DangerNigger />
								<p className="text-xs text-secondary-foreground">{t("reschedule-technical-council")}</p>
							</div>
							<Button
								onClick={() => setIsExpanded(false)}
								variant="ghost"
								className="w-fit h-fit flex justify-center items-center hover:bg-transparent"
								size="icon"
							>
								<Icons.ArrowDown />
							</Button>
						</div>
					</div>
				)}
			</div>
	</div>
	)
}

export default StartAuction