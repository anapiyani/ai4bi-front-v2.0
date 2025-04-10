'use client'

import { WebSocketProvider } from "@/src/app/api/provider/WebSocketProvider"
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { NextIntlClientProvider } from 'next-intl'
import { useState } from 'react'

export function Providers({ children, messages, locale }: { children: React.ReactNode, messages: any, locale: string }) {
  const [queryClient] = useState(() => new QueryClient())
  return (
    <NextIntlClientProvider messages={messages} locale={locale}>
      <QueryClientProvider client={queryClient}>
        <WebSocketProvider>
          {children}
        </WebSocketProvider>
      </QueryClientProvider>   
    </NextIntlClientProvider>
  )
}


