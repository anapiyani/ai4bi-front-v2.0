"use client"

import { Button } from '@/components/ui/button'
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { X } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { PopUpHandlers } from '../../types/types'
import ChatModePopup from './ChatModePopup'

type PopUpProps = {
  open: boolean,
  title: string,
  description: string,
  t: ReturnType<typeof useTranslations>,
  handlers: PopUpHandlers
}

type PopUpFactoryProps = {
  type: string | null,
  handlers: PopUpHandlers
}

const PopUp = ({open, title, description, t, handlers}: PopUpProps) => {
  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      if (!isOpen) {
        handlers.stayButtonClick()
      }
    }}>
      <DialogContent className='bg-primary-foreground px-8 py-8 w-[500px]'>
        <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </DialogClose>
        <DialogHeader className='mt-4'>
          <DialogTitle className='text-secondary-foreground flex items-center justify-center text-2xl font-bold'>
            {title}
          </DialogTitle>
        </DialogHeader>
        <DialogDescription className='text-muted-foreground flex items-center gap-2 justify-center text-sm font-medium text-center'>
          {description}
        </DialogDescription>
        <DialogFooter className="mt-4">
          <Button variant='outline' onClick={handlers.stayButtonClick}>{t("stay")}</Button>
          <Button className='bg-destructive text-destructive-foreground hover:bg-destructive/90' onClick={() => handlers.exitButtonClick(false)}>{t("exit")}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

const PopUpFactory = ({type, handlers}: PopUpFactoryProps) => {
  switch (type) {
    case "chat":  
      return <ChatModePopup {...handlers} />
    default:
      return null
  }
}

export { PopUp, PopUpFactory }
