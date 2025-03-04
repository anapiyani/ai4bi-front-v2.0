
import { Button } from '@/components/ui/button'
import { PopUpButtonAction } from '@/src/app/types/types'
import dayjs from 'dayjs'
import { useTranslations } from 'next-intl'
import { useState } from 'react'
import ChangeDates from '../../Form/ChangeDates'
import Icons from '../../Icons'
interface TimeToStartAucTechProps {
  body: string
  buttons: {
    id: string
    label: string
    button_style: 'primary' | 'secondary' | string,
    action: "RESCHEDULED_TECH_COUNCIL" | "STARTED_TECH_COUNCIL" | "ACCEPTED_PARTICIPATION_TECH_COUNCIL" | "REJECTED_PARTICIPATION_TECH_COUNCIL",
    order_index: number,
  }[]
  chat_id: string
  created_at: string
  expiration_time: string
  header: string
  user_id: string
	popup_id: string
	popup_type: "participation_question_tech_council" | "tech_council_start",
  handlePopUpButtonAction: (button: PopUpButtonAction, user_id?: string) => void
}

const TimeToStartAucTech = ({
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
}: TimeToStartAucTechProps) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const t = useTranslations('dashboard')
	const [openRescheduleModal, setOpenRescheduleModal] = useState(false)
	const [rescheduleAction, setRescheduleAction] = useState<"RESCHEDULED_TECH_COUNCIL" | null>(null)
	
  return (
    <div className="flex items-center justify-center w-full mt-3">
      <div className={`bg-white overflow-hidden ${!isExpanded ? "w-[500px] rounded-lg" : "w-[300px] rounded-full"}`}>
				{!openRescheduleModal && !isExpanded ? (
						<div className="w-[500px] bg-white rounded-lg p-6">
							<div className="space-y-4">
								<div className="flex flex-col gap-2">
									<h2 className="text-lg font-semibold">{popup_type === "tech_council_start" ? t("its-time-to-start-the-technical-council") : popup_type === "participation_question_tech_council" ? t("would-you-like-to-participate-in-the-technical-council") : t("its-time-to-start-the-auction")}</h2>
									<p className="text-sm text-gray-500">
										{dayjs(created_at).format('DD.MM.YYYY')}
									</p>
								</div>

								<div className="flex justify-end gap-3">
									{buttons.map((button) => (
										<Button
											key={button.id}
											variant={button.button_style === 'primary' ? 'default' : 'outline'}
											onClick={() => {
												if (button.action === "RESCHEDULED_TECH_COUNCIL") {
													setOpenRescheduleModal(true)
													setRescheduleAction(button.action)
												} else if (button.action === "STARTED_TECH_COUNCIL") {
													handlePopUpButtonAction({ // TODO: rewrite
														popup_id: popup_id,
														user_id: user_id,
														button_id: button.id,
														chatId: chat_id,
													}, user_id)
												} else if (button.action === "ACCEPTED_PARTICIPATION_TECH_COUNCIL") {
													handlePopUpButtonAction({
														popup_id: popup_id,
														user_id: user_id,
														button_id: button.id,
														chatId: chat_id,
													})
												} else if (button.action === "REJECTED_PARTICIPATION_TECH_COUNCIL") {
													handlePopUpButtonAction({
														popup_id: popup_id,
														user_id: user_id,
														button_id: button.id,
														chatId: chat_id,
													})
												}
											}}
										>
											{button.action === "RESCHEDULED_TECH_COUNCIL" //! rewrite
												? t("reschedule") 
												: button.action === "ACCEPTED_PARTICIPATION_TECH_COUNCIL" 
													? t("accept") 
													: button.action === "REJECTED_PARTICIPATION_TECH_COUNCIL" 
														? t("reject") 
														: button.action === "STARTED_TECH_COUNCIL" 
															? t("start")
															: t("start")}
										</Button>
									))}
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
							chat_id={chat_id}
							rescheduleData={(date, time) => {
								handlePopUpButtonAction({
									popup_id: popup_id,
									user_id: user_id,
									button_id: buttons.find((button) => button.action === rescheduleAction)?.id || '',
									tech_council_reschedule_date: date,
									chatId: chat_id,
								})
							}}
							rescheduleAction={rescheduleAction}
						/>
					)}

					{isExpanded && (
						<div className="w-full bg-white rounded-full py-3 px-4">
							<div className="flex justify-between items-center">
								<div className="flex gap-2 items-center">
									<Icons.DangerNigger />
									<p className="text-xs text-secondary-foreground">{popup_type === "tech_council_start" ? t("technical-council") : popup_type === "participation_question_tech_council" ? t("technical-council") : t("its-time-to-start-the-auction")}</p>
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

export default TimeToStartAucTech
