import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'
import { useTranslations } from 'next-intl'
import toast from 'react-hot-toast'
import { useChangeDateForm } from '../../hooks/useChangeDateState'
import { DateTimeInput } from './components/FormDateTime'

const ChangeDates = ({
  open,
  onClose,
  chat_id,
  rescheduleAction,
  rescheduleData,
}: {
  open: boolean;
  onClose: () => void;
  chat_id: string;
  rescheduleAction: "RESCHEDULED_TECH_COUNCIL" | "END_TECH_COUNCIL" | "RESCHEDULED_TENDER" | null;
  rescheduleData: (datetime: string) => void;
}) => {
	const t = useTranslations('dashboard');
	const { state, updateState } = useChangeDateForm();

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()
    const dateObj = state.date ? new Date(state.date) : null
    if (dateObj) dateObj.setDate(dateObj.getDate() + 1)
    const date = dateObj?.toISOString().split('T')[0] || ''
    const time = state.time || ''
    const localDateTimeString = `${date}T${time}:00`
    const localDate = new Date(localDateTimeString)
    const utcString = localDate.toISOString()
    if (utcString) {
      rescheduleAction ? rescheduleData(utcString) : onClose()
    } else {
      toast.error(t("please-select-date-and-time"))
    }
	}

	if (!open) return null;

	return (
		<motion.div 
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 50 }}
      transition={{ duration: 0.5 }}
      className="items-center justify-center z-50">  
      <div className='bg-primary-foreground w-full max-w-md mx-auto p-6 sm:p-7 flex flex-col items-center justify-center rounded-lg'>
        <div className='flex flex-col items-center justify-center gap-2'>
          <h2 className='text-brand-gray text-2xl font-bold mb-4'>
            {rescheduleAction === "RESCHEDULED_TECH_COUNCIL" ? t("change-technical-council-dates") : t("change-auction-dates")}
          </h2>
        </div>
        <form onSubmit={handleSubmit} className='w-full'>
          <DateTimeInput
            dateLabel={rescheduleAction === "RESCHEDULED_TECH_COUNCIL" ? t("new-date-technical-council") : t("date-of-auction")}
            timeLabel={rescheduleAction === "RESCHEDULED_TECH_COUNCIL" ? t("new-time-technical-council") : t("time-of-auction")}
            locale={state.locale}
						newDate={true}
            dateValue={state.date}
            timeValue={state.time}
            onDateChange={(date) => updateState({ date })}
            onTimeChange={(time) => updateState({ time })}
          />
          <div className='w-full flex items-center justify-end gap-2 mt-6'>
              <Button type="button" variant='outline' onClick={onClose}>
                {t("cancel")}
              </Button>
              <Button type="submit">
                {t("confirm")}
              </Button>
          </div>
        </form>
      </div>
    </motion.div>
	)
}

export default ChangeDates