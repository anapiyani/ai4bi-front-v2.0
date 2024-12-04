import { Checkbox } from '@/components/ui/Checkbox'
import { DatePicker } from '@/components/ui/datepicker'
import { Label } from '@/components/ui/label'
import { TimeInput } from '@/components/ui/time-input'
import { Locale } from 'date-fns'

interface DateTimeInputProps {
  dateLabel: string
  timeLabel: string
  locale: Locale
  dateValue: Date | undefined
  timeValue: string
  onDateChange: (date: Date | undefined) => void
  onTimeChange: (time: string) => void
  newDate?: boolean,
  keepCurrentAuctionDate?: boolean,
  onKeepCurrentAuctionDateChange?: (checked: boolean) => void,
  keepCurrentAuctionLabel?: string
}

export function DateTimeInput({
  dateLabel,
  timeLabel,
  locale,
  dateValue,
  timeValue,
  onDateChange,
  onTimeChange,
  newDate = false,
  keepCurrentAuctionDate = false,
  keepCurrentAuctionLabel,
  onKeepCurrentAuctionDateChange
}: DateTimeInputProps) {
  return (
    <>
      <div className='w-full flex flex-col items-start justify-center gap-2 mb-3'>
        {newDate && (
          <div className='flex items-center justify-start gap-2 mb-3'>
            <Checkbox id={`new-date-${dateLabel}`} checked={keepCurrentAuctionDate} onCheckedChange={onKeepCurrentAuctionDateChange} />
            <Label htmlFor={`new-date-${dateLabel}`} className='text-sm text-secondary-foreground'>{keepCurrentAuctionLabel}</Label>
          </div>
        )}
        <Label htmlFor={`date-${dateLabel}`} className='text-sm text-secondary-foreground'>
          {dateLabel}
        </Label>
        <DatePicker
          value={dateValue}
          locale={locale}
          onChange={(date: Date) => onDateChange(date)}
        />
      </div>
      <div className='w-full flex flex-col items-start justify-center gap-2 mb-4'>
        <Label htmlFor={`time-${timeLabel}`} className='text-sm text-secondary-foreground'>
          {timeLabel}
        </Label>
        <TimeInput
          id={`time-${timeLabel}`}
          value={timeValue}
          type='time'
          onChange={(e) => onTimeChange(e.target.value)}
        />
      </div>
    </>
  )
}


