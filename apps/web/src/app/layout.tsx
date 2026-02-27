import type { Metadata, Viewport } from 'next'
import { Suspense } from 'react'
import dynamic from 'next/dynamic'
import { Inter, Space_Grotesk } from 'next/font/google'
import './globals.css'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { JsonLd } from '@/components/seo/JsonLd'
import { DEFAULT_LOCALE, SITE_DESCRIPTION, SITE_NAME, getSiteUrl } from '@/lib/site'
import { Providers } from './providers'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-display',
})

const CartDrawer = dynamic(
  () => import('@/components/layout/CartDrawer').then((module) => module.CartDrawer),
  { ssr: false },
)

const AIChatWidget = dynamic(
  () => import('@/components/ai/AIChatWidget').then((module) => module.AIChatWidget),
  { ssr: false },
)

const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: SITE_NAME,
  url: getSiteUrl(),
  sameAs: [],
}

const websiteJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: SITE_NAME,
  url: getSiteUrl(),
  potentialAction: {
    '@type': 'SearchAction',
    target: `${getSiteUrl()}/products?search={search_term_string}`,
    'query-input': 'required name=search_term_string',
  },
}

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: {
    default: `${SITE_NAME} - Premium Commerce für B2B und B2C`,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  alternates: {
    canonical: '/',
  },
  manifest: '/manifest.webmanifest',
  category: 'shopping',
  keywords: ['Online-Shop', 'B2B', 'B2C', 'Premium Commerce', 'Deutschland', 'Simone'],
  authors: [{ name: 'Simone Schulze' }],
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-snippet': -1,
      'max-image-preview': 'large',
      'max-video-preview': -1,
    },
  },
  openGraph: {
    title: `${SITE_NAME} - Premium Commerce für B2B und B2C`,
    description: 'Trust-first Einkaufserlebnis mit klaren Kosten und schneller Abwicklung.',
    url: '/',
    type: 'website',
    siteName: SITE_NAME,
    locale: DEFAULT_LOCALE,
    images: [
      {
        url: 'https://picsum.photos/seed/simone-shop-og/1200/630',
        width: 1200,
        height: 630,
        alt: `${SITE_NAME} Open Graph`,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${SITE_NAME} - Premium Commerce für B2B und B2C`,
    description: SITE_DESCRIPTION,
    images: ['https://picsum.photos/seed/simone-shop-og/1200/630'],
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#101010',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="de" suppressHydrationWarning>
      <body className={`${inter.variable} ${spaceGrotesk.variable} min-h-screen bg-brand-bg font-sans text-brand-text`}>
        <JsonLd id="org-jsonld" data={organizationJsonLd} />
        <JsonLd id="website-jsonld" data={websiteJsonLd} />
        <Providers>
          <a
            href="#main-content"
            className="sr-only absolute left-2 top-2 z-[120] rounded-lg bg-brand-accent px-4 py-2 text-sm font-semibold text-white focus:not-sr-only"
          >
            Zum Hauptinhalt springen
          </a>
          <div className="flex flex-col min-h-screen">
            <Suspense fallback={<div className="h-[6.5rem] border-b border-brand-border bg-brand-surface" />}>
              <Navbar />
            </Suspense>
            <main id="main-content" className="flex-1">
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
