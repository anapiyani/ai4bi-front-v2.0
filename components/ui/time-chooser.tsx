"use client"

import * as React from "react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"

interface TimeChooserProps {
    value: string
    onChange: (time: string) => void
    trigger: React.ReactNode
}

export function TimeChooser({ value, onChange, trigger }: TimeChooserProps) {
    const [open, setOpen] = React.useState(false)

    // Parse the current value
    const [hours, minutes] = value ? value.split(":").map(Number) : [0, 0]

    // Generate hours and minutes options
    const hoursOptions = Array.from({ length: 24 }, (_, i) => i)
    const minutesOptions = Array.from({ length: 60 }, (_, i) => i)

    const handleTimeSelect = (newHours: number, newMinutes: number) => {
        const formattedHours = newHours.toString().padStart(2, "0")
        const formattedMinutes = newMinutes.toString().padStart(2, "0")
        onChange(`${formattedHours}:${formattedMinutes}`)
        setOpen(false)
    }

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>{trigger}</PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
                <div className="flex p-2 gap-2">
                    <div className="flex flex-col">
                        <div className="text-xs font-medium py-1 px-2">Hours</div>
                        <ScrollArea className="h-52 w-16">
                            <div className="flex flex-col">
                                {hoursOptions.map((hour) => (
                                    <Button
                                        key={hour}
                                        variant="ghost"
                                        className={cn(
                                            "justify-center rounded-sm h-8",
                                            hours === hour && "bg-primary text-primary-foreground",
                                        )}
                                        onClick={() => handleTimeSelect(hour, minutes)}
                                    >
                                        {hour.toString().padStart(2, "0")}
                                    </Button>
                                ))}
                            </div>
                        </ScrollArea>
                    </div>
                    <div className="flex flex-col">
                        <div className="text-xs font-medium py-1 px-2">Minutes</div>
                        <ScrollArea className="h-52 w-16">
                            <div className="flex flex-col">
                                {minutesOptions.map((minute) => (
                                    <Button
                                        key={minute}
                                        variant="ghost"
                                        className={cn(
                                            "justify-center rounded-sm h-8",
                                            minutes === minute && "bg-primary text-primary-foreground",
                                        )}
                                        onClick={() => handleTimeSelect(hours, minute)}
                                    >
                                        {minute.toString().padStart(2, "0")}
                                    </Button>
                                ))}
                            </div>
                        </ScrollArea>
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    )
}

