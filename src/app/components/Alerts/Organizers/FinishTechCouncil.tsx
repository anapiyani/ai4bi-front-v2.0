
import { Button } from '@/components/ui/button'
import { useTranslations } from 'next-intl'
import { useState } from 'react'
import { PopUpButtonAction } from '../../../types/types'
import ChangeDates from '../../Form/ChangeDates'
import Icons from '../../Icons'
interface FinishTechCouncilProps {
	body: string
	buttons: {
		id: string
		label: string
		button_style: string;
		action: "END_TECH_COUNCIL" | "RESCHEDULED_TECH_COUNCIL" 
		order_index: number,
	}[]
	chat_id: string
	created_at: string
	expiration_time: string
	header: string
	user_id: string
	popup_id: string
	popup_type: "tech_council_end",
	handlePopUpButtonAction: (button: PopUpButtonAction) => void
}

const FinishTechCouncil = ({
	body,
	buttons,
	chat_id,
	popup_id,
	created_at,
	expiration_time,
	header,
	user_id,
	handlePopUpButtonAction
}: FinishTechCouncilProps) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const t = useTranslations('dashboard')
	const [openRescheduleModal, setOpenRescheduleModal] = useState(false)
	const [rescheduleAction, setRescheduleAction] = useState<"RESCHEDULED_TECH_COUNCIL" | "END_TECH_COUNCIL" | null>(null)
	
  return (
    <div className="flex items-center justify-center w-full mt-3">
      <div className={`bg-white overflow-hidden ${!isExpanded ? "w-[340px] lg:w-[500px] rounded-lg" : "w-[300px] rounded-full"}`}>
				{!openRescheduleModal && !isExpanded ? (
						<div className="w-[340px] lg:w-[500px] bg-white rounded-lg p-6">
							<div className="space-y-4">
								<div className="flex flex-col gap-2">
									<h2 className="text-lg font-semibold">
										{t("reschedule-technical-council")}
									</h2>
									<p className="text-sm text-gray-500">
										{t("reschedule-technical-council-description")}
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
													if (button.action === "END_TECH_COUNCIL") {
														setOpenRescheduleModal(true)
														setRescheduleAction("END_TECH_COUNCIL")
													} else {
														setOpenRescheduleModal(true)
														setRescheduleAction("RESCHEDULED_TECH_COUNCIL")
													}
												}}
											>
												{
													button.action === "END_TECH_COUNCIL" ? t("no-plan-the-auction") : t("yes-reschedule")
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
									tech_council_reschedule_date: rescheduleAction === "RESCHEDULED_TECH_COUNCIL" ? datetime : undefined,
									auction_date: rescheduleAction === "END_TECH_COUNCIL" ? datetime : undefined,
								})
							}}
							rescheduleAction={rescheduleAction}
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

export default FinishTechCouncil
