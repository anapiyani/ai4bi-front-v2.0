"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from '@/components/ui/card'
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from '@/lib/utils'
import { differenceInDays, format } from "date-fns"
import { enUS, Locale } from "date-fns/locale"
import { CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react'
import { useTranslations } from 'next-intl'
import React, { useEffect, useImperativeHandle, useRef, useState } from "react"
import { DateRange, DayPicker } from 'react-day-picker'

export interface DateSePickerProps {
  locale?: Locale
  value?: DateRange
  onChange?: (range: DateRange | undefined) => void
  disabled?: boolean
  placeholder?: string
  PlanningStyle?: boolean
}

export interface DateSePickerRef {
  value?: DateRange
}

const DateSePicker = React.forwardRef<DateSePickerRef, DateSePickerProps>(
  (
    {
      locale = enUS,
      value,
      onChange,
      disabled = false,
      placeholder = "Pick a date range",
      PlanningStyle,
      ...props
    },
    ref
  ) => {
    const [range, setRange] = React.useState<DateRange | undefined>(value)
    const [month, setMonth] = React.useState<Date>(new Date())
    const [isOpen, setIsOpen] = React.useState(false)
    const [errorMessage, setErrorMessage] = useState<string | null>(null)
    const buttonRef = useRef<HTMLButtonElement>(null)
    const t = useTranslations("Dashboard");

    useImperativeHandle(
      ref,
      () => ({
        ...buttonRef.current!,
        value: range,
      }),
      [range]
    )

    const handleSelect = (selectedRange: DateRange | undefined) => {
      if (selectedRange?.from && selectedRange?.to) {
        const daysDifference = differenceInDays(selectedRange.to, selectedRange.from)
        if (daysDifference > 30) {
          setErrorMessage(t("date-less-required"));
          return
        }
      }
      setErrorMessage(null)
      setRange(selectedRange)
      onChange?.(selectedRange)
    }

    const handleCancel = (e: React.MouseEvent) => {
      e.stopPropagation();
      setRange(undefined)
      setErrorMessage(null)
      onChange?.(undefined)
      setIsOpen(false)
    }

    const handleOk = (e: React.MouseEvent) => {
      e.stopPropagation();
      setIsOpen(false)
      setErrorMessage(null)
      onChange?.(range);
    }

    useEffect(() => {
      setRange(value)
    }, [value])

    return (
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            ref={buttonRef}
            variant="outline"
            className={cn(
              PlanningStyle ? "w-[400px]" : "w-full",
              "justify-start text-left font-normal",
              !range && "text-muted-foreground",
            )}
            disabled={disabled}
          >
            <CalendarIcon className="mr-2 h-4 w-4 text-bi-gray" />
            {range?.from ? (
              range.to ? (
                <>
                  {format(range.from, "LLL dd, y", { locale })} - {format(range.to, "LLL dd, y", { locale })}
                </>
              ) : (
                format(range.from, "LLL dd, y", { locale })
              )
            ) : (
              <span className='text-bi-gray'>{placeholder}</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Card className="w-fit border-0 shadow-none">
            <div className='p-2 pl-3'>
              <p className="font-normal leading-8 text-muted-foreground text-xs tracking-widest">{t("start-end-date")}</p>
            </div>
            <CardContent className="p-0">
              <div className="flex">
                <DayPicker
                  mode="range"
                  selected={range}
                  onSelect={handleSelect}
                  month={month}
                  weekStartsOn={1}
                  onMonthChange={setMonth}
                  numberOfMonths={2}
                  showOutsideDays
                  locale={locale}
                  className="p-3"
                  classNames={{
                    months: "flex space-x-4",
                    month: "space-y-4",
                    caption: "flex justify-center pt-1 relative items-center",
                    caption_label: "text-sm font-medium",
                    nav: "space-x-1 flex items-center",
                    nav_button: cn(
                      "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 absolute",
                      "text-primary hover:bg-muted hover:text-primary"
                    ),
                    nav_button_previous: "left-1",
                    nav_button_next: "right-1",
                    table: "w-full border-collapse space-y-1",
                    head_row: "flex",
                    head_cell: "text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]",
                    row: "flex w-full mt-2",
                    cell: cn(
                      "relative p-0 text-center text-sm focus-within:relative focus-within:z-20 [&:has([aria-selected])]:bg-accent",
                      "first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md"
                    ),
                    day: cn(
                      "h-9 w-9 p-0 font-normal rounded-full flex items-center justify-center",
                      "hover:bg-accent hover:text-accent-foreground"
                    ),
                    day_range_start: "day-range-start rounded-full bg-primary text-primary-foreground",
                    day_range_end: "day-range-end rounded-full bg-primary text-primary-foreground",
                    day_selected: "bg-primary rounded-full text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
                    day_today: "border rounded-full border-muted-foreground text-accent-foreground",
                    day_outside: "text-muted-foreground opacity-50",
                    day_disabled: "text-muted-foreground opacity-50",
                    day_range_middle: "aria-selected:bg-accent aria-selected:text-accent-foreground",
                    day_hidden: "invisible",
                  }}
                  components={{
                    IconLeft: ({ ...props }) => <ChevronLeft className="h-4 w-4 text-center" />,
                    IconRight: ({ ...props }) => <ChevronRight className="h-4 w-4 text-center" />,
                  }}
                />
              </div>
              {errorMessage && (
                <div className="text-red-500 text-sm p-2 text-center">
                  {errorMessage}
                </div>
              )}
              <div className="flex justify-end gap-2 p-2 border-t">
                <Button variant="outline" className='text-primary' onClick={handleCancel}>
                  {t("cancel")}
                </Button>
                <Button variant="outline" className='text-primary' onClick={handleOk}>
                  {t("add")}
                </Button>
              </div>
            </CardContent>
          </Card>
        </PopoverContent>
      </Popover>
    )
  }
)

DateSePicker.displayName = "DateSePicker"

export { DateSePicker }
