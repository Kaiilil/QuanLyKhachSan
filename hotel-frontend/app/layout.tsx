import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import './globals.css'
import SiteFooter from '@/components/site-footer'
import ChatWidget from '@/components/chatbot/chat-widget'
import { Toaster } from '@/components/ui/toaster'

export const metadata: Metadata = {
  title: 'Hotel Management System',
  description: 'Hotel Management System',
  generator: 'Hotel Management System',
  icons: {
    icon: '/ODF.png',  // hoặc .png cũng được
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body className={GeistSans.className}>
        {children}
        <SiteFooter />
        <ChatWidget />
        <Toaster />
      </body>
    </html>
  )
}
