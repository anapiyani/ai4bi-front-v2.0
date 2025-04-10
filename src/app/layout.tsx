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
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();
  let messages;

  try {
    messages = await getMessages({ locale });
  } catch (e) {
    console.error("Missing translations for locale:", locale);
    throw e;
  }

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

