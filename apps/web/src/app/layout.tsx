import type { Metadata } from 'next'
import { Suspense } from 'react'
import { Fraunces, Manrope } from 'next/font/google'
import './globals.css'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { CartDrawer } from '@/components/layout/CartDrawer'
import { AIChatWidget } from '@/components/ai/AIChatWidget'
import { Providers } from './providers'

const manrope = Manrope({
  subsets: ['latin'],
  variable: '--font-manrope',
})

const fraunces = Fraunces({
  subsets: ['latin'],
  variable: '--font-fraunces',
})

export const metadata: Metadata = {
  title: "Simone's Shop - Premium Commerce für B2B und B2C",
  description: 'Transparente Preise, schnelle Lieferung und verlässlicher Support für Privat- und Geschäftskunden.',
  keywords: ['Online-Shop', 'B2B', 'B2C', 'Premium Commerce', 'Deutschland', 'Simone'],
  authors: [{ name: 'Simone Schulze' }],
  openGraph: {
    title: "Simone's Shop - Premium Commerce für B2B und B2C",
    description: 'Trust-first Einkaufserlebnis mit klaren Kosten und schneller Abwicklung.',
    type: 'website',
    locale: 'de_DE',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="de" suppressHydrationWarning>
      <body className={`${manrope.variable} ${fraunces.variable} min-h-screen bg-brand-bg font-sans text-brand-text`}>
        <Providers>
          <div className="flex flex-col min-h-screen">
            <Suspense fallback={<div className="h-[6.5rem] border-b border-brand-border bg-brand-surface" />}>
              <Navbar />
            </Suspense>
            <main className="flex-1">
              {children}
            </main>
            <Footer />
          </div>
          <CartDrawer />
          <AIChatWidget />
        </Providers>
      </body>
    </html>
  )
}
