"use client"

import { cn } from "@/lib/utils"

type SpinnerSize = "sm" | "md" | "lg" | "xl";

const spinnerSizes: Record<SpinnerSize, string> = {
    sm: "h-4 w-4 border-2",
    md: "h-6 w-6 border-2",
    lg: "h-8 w-8 border-[3px]",
    xl: "h-12 w-12 border-4",
};

interface SpinnerProps {
    size?: SpinnerSize;
    className?: string;
}

export function Spinner({ size = "md", className }: SpinnerProps) {
    const sizeClass = spinnerSizes[size];

    return (
        <div
            className={cn(
                "inline-block animate-spin rounded-full border-current border-t-transparent",
                sizeClass,
                className
            )}
            role="status"
            aria-label="Loading"
        >
        </div>
    );
}