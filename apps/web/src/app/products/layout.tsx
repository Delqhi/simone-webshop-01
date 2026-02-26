import type { Metadata } from 'next'
import { SITE_DESCRIPTION, SITE_NAME } from '@/lib/site'

export const metadata: Metadata = {
  title: `Produkte`,
  description: `Produktkatalog von ${SITE_NAME}: ${SITE_DESCRIPTION}`,
  alternates: {
    canonical: '/products',
  },
  openGraph: {
    title: `Produkte | ${SITE_NAME}`,
    description: SITE_DESCRIPTION,
    url: '/products',
    type: 'website',
  },
}

export default function ProductsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}

