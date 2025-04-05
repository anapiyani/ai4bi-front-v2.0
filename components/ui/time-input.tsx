"use client"

import { cn } from "@/lib/utils"
import React from "react"
import { TimeChooser } from "./time-chooser"

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    openTimeChoose?: () => void
}

const TimeInput = React.forwardRef<HTMLInputElement, InputProps>(
    ({ className, type, openTimeChoose, value, onChange, ...props }, ref) => {
        const handleTimeChange = (newTime: string) => {
            if (onChange) {
                const event = {
                    target: {
                        value: newTime,
                    },
                } as React.ChangeEvent<HTMLInputElement>
                onChange(event)
            }
        }

        const clockIcon = (
            <span className="ml-2 text-muted-foreground flex items-center cursor-pointer">
        <svg width="19" height="18" viewBox="0 0 19 18" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M9.5 4.5V9H12.875" stroke="#64748B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          <circle
              cx="9.5"
              cy="9"
              r="6.75"
              stroke="#64748B"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
          />
        </svg>
      </span>
        )

        return (
            <div className="flex items-center border border-input bg-background rounded-md px-3 py-2 w-full">
                <input
                    type={type}
                    className={cn(
                        "flex-1 bg-transparent text-sm placeholder:text-muted-foreground focus-visible:outline-none [&::-webkit-calendar-picker-indicator]:hidden",
                        className,
                    )}
                    ref={ref}
                    value={value}
                    onChange={onChange}
                    {...props}
                />
                <TimeChooser value={value as string} onChange={handleTimeChange} trigger={clockIcon} />
            </div>
        )
    },
)
TimeInput.displayName = "TimeInput"

export { TimeInput }

