import { Toaster } from "@/components/ui/toaster"
import type { Metadata, Viewport } from "next"
import { getLocale, getMessages } from "next-intl/server"
import { Inter } from 'next/font/google'
import "./globals.css"
import { Providers } from './providers'

const inter = Inter({ subsets: ["latin", "cyrillic", "cyrillic-ext"] });

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  // Also supported by less commonly used
  // interactiveWidget: 'resizes-visual',
}

export const metadata: Metadata = {
  title: "AI 4 BI v2.0",
  description: "Портал для создания и управления тендерами",
  viewport: "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body className={inter.className}>
        <Providers locale={locale} messages={messages}>
          {children}
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}

