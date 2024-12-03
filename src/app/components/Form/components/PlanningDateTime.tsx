import { DatePicker } from '@/components/ui/datepicker'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Locale } from 'date-fns'

interface DateTimeInputProps {
  dateLabel: string
  timeLabel: string
  locale: Locale
  dateValue: Date | undefined
  timeValue: string
  onDateChange: (date: Date | undefined) => void
  onTimeChange: (time: string) => void
}

export function DateTimeInput({
  dateLabel,
  timeLabel,
  locale,
  dateValue,
  timeValue,
  onDateChange,
  onTimeChange,
}: DateTimeInputProps) {
  return (
    <>
      <div className='w-full flex flex-col items-start justify-center gap-2 mb-3'>
        <Label htmlFor={`date-${dateLabel}`} className='text-sm text-secondary-foreground'>
          {dateLabel}
        </Label>
        <DatePicker
          locale={locale}
          onChange={(date: Date) => onDateChange(date)}
        />
      </div>
      <div className='w-full flex flex-col items-start justify-center gap-2 mb-4'>
        <Label htmlFor={`time-${timeLabel}`} className='text-sm text-secondary-foreground'>
          {timeLabel}
        </Label>
        <Input
          id={`time-${timeLabel}`}
          type='time'
          value={timeValue}
          onChange={(e) => onTimeChange(e.target.value)}
        />
      </div>
    </>
  )
}


