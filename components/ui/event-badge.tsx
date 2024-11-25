import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const eventBadgeVariants = cva(
  "rounded-full w-6 max-w-6 max-h-6 h-6 bg-red-500 text-center flex items-center justify-center",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground shadow hover:bg-primary/80",
        unknown:
          "border-transparent bg-primary text-primary-foreground shadow hover:bg-primary/80",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground shadow hover:bg-destructive/80",
        outline: "text-foreground",
        rollcall: "text-sec-txt bg-[#E1BAFF]",
        trading: "text-sec-txt bg-[#B1D9FF]",
        paused: "text-sec-txt bg-[#FFE680]",
        inProgress: "text-sec-txt bg-[#C8F4AD]",
        ended: "text-sec-txt bg-lightest-gray",
        finished: "text-sec-txt bg-lightest-gray",
        created: "text-sec-txt bg-[#C8F4AD]",
        conversation_mode: "text-sec-txt bg-[#28F4AD]",
        askstep: "text-sec-txt bg-[#EBC49F]",
        team_registration: "text-sec-txt bg-[#3BC41F]",
        declaring_end: "text-sec-txt bg-[#D37676]",
        advance: "text-sec-txt bg-[#B0C5A4]",
        waiting_end: "text-sec-txt bg-lightest-gray",
        waiting_cancel: "text-sec-txt bg-lightest-gray",
        notStarted: "text-sec-txt bg-lightest-gray",
        cancelled: "text-sec-txt bg-[#FFD0CD]",
        botJoining: "text-sec-txt bg-[#B0C5A4]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface EventBadgeLogeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof eventBadgeVariants> {}

function EventBadgeLog({ className, variant, ...props }: EventBadgeLogeProps) {
  return (
    <div className={cn(eventBadgeVariants({ variant }), className)} {...props}>
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g clipPath="url(#clip0_103_28541)">
          <path
            d="M0.929932 13.9998H8.92993V15.3332H0.929932V13.9998ZM3.7566 5.37984L5.64326 3.49317L15.0699 12.9198L13.1833 14.8065L3.7566 5.37984ZM8.4766 0.666504L12.2499 4.43984L10.3633 6.3265L6.58993 2.55317L8.4766 0.666504ZM2.8166 6.31984L6.58993 10.0932L4.70326 11.9798L0.929932 8.2065L2.8166 6.31984Z"
            fill="#171A1C"
          />
        </g>
        <defs>
          <clipPath id="clip0_103_28541">
            <rect width="16" height="16" fill="white" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

export { EventBadgeLog, eventBadgeVariants };
