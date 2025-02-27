"use client"

import { format, Locale } from "date-fns"
import { enUS } from "date-fns/locale"
import * as React from "react"

import { Button, buttonVariants } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { useTranslations } from "next-intl"
import { DayPicker } from "react-day-picker"

export function DatePicker({ locale = enUS, onChange, value, open, setOpen }: { locale?: Locale, onChange: (date: Date) => void, value: Date | undefined, open: boolean, setOpen: (open: boolean) => void }) {
  const t = useTranslations("dashboard")

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-full justify-between text-left font-normal",
            !value && "text-muted-foreground"
          )}
        >
          {value ? format(value, "dd.MM.yyyy", { locale }) : <span>{t("pick-a-date")}</span>}
          <svg width="19" height="18" viewBox="0 0 19 18" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M2.75 9C2.75 5.81802 2.75 4.97703 3.73851 3.98851C4.72703 3 6.31802 3 9.5 3C12.682 3 14.273 3 15.2615 3.98851C16.25 4.97703 16.25 5.81802 16.25 9C16.25 12.182 16.25 13.773 15.2615 14.7615C14.273 15.75 12.682 15.75 9.5 15.75C6.31802 15.75 4.72703 15.75 3.73851 14.7615C2.75 13.773 2.75 12.182 2.75 9Z" stroke="#64748B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M2.9375 6H16.0625" stroke="#64748B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M12.875 3.75V2.25" stroke="#64748B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M6.125 3.75V2.25" stroke="#64748B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0 pointer-events-auto">
        <Calendar
          mode="single"
          selected={value}
          onSelect={(date) => {
            onChange(date as Date)
            setOpen(false)
          }}
          initialFocus
          locale={locale}
        />
      </PopoverContent>
    </Popover>
  )
}

const genMonths = (locale: Locale) => {
  const months = [];
  for (let i = 0; i < 12; i++) {
    const date = new Date(2021, i, 1);
    months.push({
      value: i,
      label: format(date, "MMMM", { locale }),
    });
  }
  return months;
};

const genYears = (locale: Locale, yearRange: number) => {
  const years = [];
  const currentYear = new Date().getFullYear();
  const startYear = currentYear - yearRange;
  const endYear = currentYear + yearRange;

  for (let year = startYear; year <= endYear; year++) {
    years.push({
      value: year,
      label: year.toString(),
    });
  }
  return years;
};

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  yearRange = 50,
  ...props
}: React.ComponentProps<typeof DayPicker> & { yearRange?: number }) {
  const MONTHS = React.useMemo(
    () => genMonths(props.locale || enUS),
    [props.locale]
  );
  const YEARS = React.useMemo(
    () => genYears(props.locale || enUS, yearRange),
    [props.locale, yearRange]
  );
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-3 bg-primary-foreground rounded-lg", className)}
      classNames={{
        months:
          "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0 justify-center",
        month: "space-y-4",
        caption: "flex justify-center pt-1 relative items-center",
        caption_label: "text-sm font-medium",
        nav: "space-x-1 flex items-center",
        nav_button: cn(
          buttonVariants({ variant: "outline" }),
          "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100"
        ),
        nav_button_previous: "absolute left-1",
        nav_button_next: "absolute right-1",
        table: "w-full border-collapse space-y-1",
        head_row: "flex",
        head_cell:
          "text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]",
        row: "flex w-full mt-2",
        cell: "h-9 w-9 text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
        day: cn(
          buttonVariants({ variant: "ghost" }),
          "h-9 w-9 p-0 font-normal aria-selected:opacity-100"
        ),
        day_range_end: "day-range-end",
        day_selected:
          "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
        day_today: "bg-accent text-accent-foreground",
        day_outside:
          "day-outside text-muted-foreground opacity-50 aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30",
        day_disabled: "text-muted-foreground opacity-50",
        day_range_middle:
          "aria-selected:bg-accent aria-selected:text-accent-foreground",
        day_hidden: "invisible",
        ...classNames,
      }}
      components={{
        IconLeft: ({ ...props }) => <ChevronLeft className="h-4 w-4" />,
        IconRight: ({ ...props }) => <ChevronRight className="h-4 w-4" />,
        CaptionLabel: ({ displayMonth }) => {
          return (
            <div className="inline-flex gap-2">
              <Select
                defaultValue={displayMonth.getMonth().toString()}
                onValueChange={(value) => {
                  const newDate = new Date(displayMonth);
                  newDate.setMonth(parseInt(value, 10));
                  props.onMonthChange?.(newDate);
                }}
              >
                <SelectTrigger className="w-fit border-none p-0 focus:bg-accent focus:text-accent-foreground">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-primary-foreground">
                  {MONTHS.map((month) => (
                    <SelectItem
                      key={month.value}
                      value={month.value.toString()}
                    >
                      {month.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select
                defaultValue={displayMonth.getFullYear().toString()}
                onValueChange={(value) => {
                  const newDate = new Date(displayMonth);
                  newDate.setFullYear(parseInt(value, 10));
                  props.onMonthChange?.(newDate);
                }}
              >
                <SelectTrigger className="w-fit border-none p-0 focus:bg-accent focus:text-accent-foreground">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-primary-foreground">
                  {YEARS.map((year) => (
                    <SelectItem key={year.value} value={year.value.toString()}>
                      {year.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          );
        },
      }}
      {...props}
    />
  );
}
Calendar.displayName = "Calendar";