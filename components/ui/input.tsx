import { cn } from "@/lib/utils"
import * as React from "react"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode;
  ChooseFiles?: () => void;
}
const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, icon, ChooseFiles, ...props }, ref) => {
    const handleIconClick = () => {
      ChooseFiles?.(); 
    };
    return (
      <div className="relative w-full">
        <input
          type={type}
          className={cn(
            "flex min-h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 overflow-y-auto resize-none",
            icon && "pr-10",
            className
          )}
          {...props}
        />
        {icon && (
          <div onClick={handleIconClick} tabIndex={0} className="absolute inset-y-0 right-3 flex items-center cursor-pointer">
            {icon}
          </div>
        )}
      </div>
    );
  }
);

Input.displayName = "Input"

export { Input }
