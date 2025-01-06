import { Toaster } from "@/components/ui/toaster"
import type { Metadata } from "next"
import { getLocale, getMessages } from "next-intl/server"
import { Inter } from 'next/font/google'
import "./globals.css"
import { Providers } from './providers'

const inter = Inter({ subsets: ["latin", "cyrillic", "cyrillic-ext"] });

export const metadata: Metadata = {
  title: "AI 4 BI v2.0",
  description: "Портал для создания и управления тендерами",
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

