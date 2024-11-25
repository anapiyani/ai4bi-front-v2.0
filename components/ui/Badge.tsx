import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "font-normal inline-flex items-center rounded-full px-4 py-0.5 text-xs transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "text-darkest-gray bg-lightest-gray border-lightest-gray hover:bg-lightest-gray/80",
        unknown:
          "text-darkest-gray bg-lightest-gray border-lightest-gray hover:bg-lightest-gray/80",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground shadow hover:bg-destructive/80",
        outline: "text-foreground",
        rollcall: "text-sec-txt bg-[#E1BAFF]",
        trading: "text-sec-txt bg-[#B1D9FF]",
        paused: "text-sec-txt bg-[#FFE680]",
        inProgress: "text-sec-txt bg-[#C8F4AD]",
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
        ended: "text-sec-txt bg-lightest-gray",
        botJoining: "text-sec-txt bg-[#B0C5A4]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
