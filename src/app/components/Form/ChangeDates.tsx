import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { useTranslations } from 'next-intl'
import { useState } from 'react'
import { useChangeDateForm } from '../../hooks/useChangeDateForm'
import { DateTimeInput } from './components/FormDateTime'


const ChangeDates = () => {
	const t = useTranslations('dashboard');
	const { state, updateState } = useChangeDateForm();
	const [keepCurrentAuctionDate, setKeepCurrentAuctionDate] = useState<boolean>(false);

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		if (state.step === 2) {
			console.log('submit', state);
			// logic to send data to backend
		} else {
			updateState({ step: 2 })
		}
	}

	const handleBack = () => {
		updateState({ step: 1 })
	}

	return (
		<Dialog open={true}>
      <DialogContent className='bg-primary-foreground w-full max-w-md mx-auto p-6 sm:p-8 flex flex-col items-center justify-center'>
        <DialogHeader className='flex flex-col items-center justify-center gap-2'>
          <DialogTitle className='text-secondary-foreground text-2xl font-bold'>
            {state.step === 1 ? t("change-technical-council-dates") : t("change-auction-dates")}
          </DialogTitle>
          <p className='text-sm text-muted-foreground'>{t("step")} {state.step} {t("of")} 2</p>
        </DialogHeader>
        <form onSubmit={handleSubmit} className='w-full'>
          {state.step === 1 ? (
            <DateTimeInput
              dateLabel={t("new-date-technical-council")}
              timeLabel={t("new-time-technical-council")}
              locale={state.locale}
              dateValue={state.technicalCouncilDate}
              timeValue={state.technicalCouncilTime}
              onDateChange={(date) => updateState({ technicalCouncilDate: date })}
              onTimeChange={(time) => updateState({ technicalCouncilTime: time })}
            />
          ) : (
            <DateTimeInput
              dateLabel={keepCurrentAuctionDate ? t("date-of-auction") : t("new-date-auction")}
              timeLabel={keepCurrentAuctionDate ? t("time-of-auction") : t("new-time-auction")}
							keepCurrentAuctionLabel={t("keep-current-auction-date")}
              locale={state.locale}
							newDate={true}
							keepCurrentAuctionDate={keepCurrentAuctionDate}
							onKeepCurrentAuctionDateChange={(checked) => setKeepCurrentAuctionDate(checked)}
              dateValue={keepCurrentAuctionDate ? state.auctionDate : undefined}
              timeValue={keepCurrentAuctionDate ? state.auctionTime : ''}
              onDateChange={(date) => updateState({ auctionDate: date })}
              onTimeChange={(time) => updateState({ auctionTime: time })}
            />
          )}
          <div className='w-full flex items-center justify-between mt-6'>
            {state.step === 2 && (
              <Button type="button" variant='outline' onClick={handleBack}>
                {t("back")}
              </Button>
            )}
            <Button
              type="submit"
              className={state.step === 1 ? 'ml-auto' : ''}
            >
              {state.step === 1 ? t("next") : t("plan")}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
	)

}

export default ChangeDates