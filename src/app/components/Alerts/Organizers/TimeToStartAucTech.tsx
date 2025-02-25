
import { Button } from '@/components/ui/button'
import { PopUpButtonAction } from '@/src/app/types/types'
import dayjs from 'dayjs'
import { AnimatePresence, motion } from 'framer-motion'
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
    action: "RESCHEDULED_TECH_COUNCIL" | "STARTED_TECH_COUNCIL",
    order_index: number,
  }[]
  chat_id: string
  created_at: string
  expiration_time: string
  header: string
  user_id: string
	popup_id: string
  handlePopUpButtonAction: (button: PopUpButtonAction) => void
}

const TimeToStartAucTech = ({
  body,
  buttons,
	user_id,
  chat_id,
  created_at,
	popup_id,
  expiration_time,
  header,
  handlePopUpButtonAction
}: TimeToStartAucTechProps) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const t = useTranslations('dashboard')
	const [openRescheduleModal, setOpenRescheduleModal] = useState(false)
	const [rescheduleAction, setRescheduleAction] = useState<"RESCHEDULED_TECH_COUNCIL" | null>(null)
  return (
    <div className="flex items-center justify-center w-full mt-3">
      <AnimatePresence mode="wait">
       {!openRescheduleModal && !isExpanded ? (
          <motion.div
            key="collapsed"
            className="w-[500px] bg-white rounded-lg p-6"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ duration: 0.5 }}
          >
            <div className="space-y-4">
              <div className="flex flex-col gap-2">
                <h2 className="text-lg font-semibold">{body}</h2>
                <p className="text-sm text-gray-500">
                  {dayjs(created_at).format('DD.MM.YYYY')} /{' '}
                  {expiration_time
                    ? dayjs(expiration_time).format('DD.MM.YYYY')
                    : 'No expiration time added'}
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
												handlePopUpButtonAction({
													popup_id: popup_id,
													user_id: user_id,
													button_id: button.id,
												})
											}
										}}
                  >
                    {button.label}
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
          </motion.div>
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
							})
						}}
						rescheduleAction={rescheduleAction}
					/>
				)}

        {isExpanded && (
          <motion.div
            key="expanded"
            className="w-[300px] bg-white rounded-full py-3 px-4"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex justify-between items-center">
              <div className="flex gap-2 items-center">
                <Icons.DangerNigger />
                <p className="text-sm text-secondary-foreground">{body}</p>
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
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default TimeToStartAucTech
