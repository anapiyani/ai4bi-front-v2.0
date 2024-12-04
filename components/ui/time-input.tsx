import { cn } from "@/lib/utils"
import React from "react"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const TimeInput = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <div className="flex items-center border border-input bg-background rounded-md px-3 py-2 w-full">
        <input
          type={type}
					className={cn(
						"flex-1 bg-transparent text-sm placeholder:text-muted-foreground focus-visible:outline-none [&::-webkit-calendar-picker-indicator]:hidden",
						className
					)}
          ref={ref}
          {...props}
        />
        <span className="ml-2 text-muted-foreground flex items-center">
          <svg width="19" height="18" viewBox="0 0 19 18" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9.5 4.5V9H12.875" stroke="#64748B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <circle cx="9.5" cy="9" r="6.75" stroke="#64748B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </span>
      </div>
    );
  }
);
TimeInput.displayName = "TimeInput";

export { TimeInput }

