import { Toaster } from "@/components/ui/toaster"
import type { Metadata } from "next"
import { NextIntlClientProvider } from "next-intl"
import { getLocale, getMessages } from "next-intl/server"
import { Inter } from "next/font/google"
import "./globals.css"
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

  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body className={inter.className}>
        <NextIntlClientProvider messages={messages}>
          <>{children}</>
          <Toaster />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
