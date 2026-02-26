import type { Metadata } from 'next'
import { SITE_NAME } from '@/lib/site'
import { getSeoProduct } from '@/lib/server/catalog'

type ProductLayoutProps = {
  children: React.ReactNode
  params: {
    id: string
  }
}

export async function generateMetadata({ params }: ProductLayoutProps): Promise<Metadata> {
  const product = await getSeoProduct(params.id)
  const canonicalPath = `/products/${encodeURIComponent(params.id)}`

  if (!product) {
    return {
      title: 'Produkt nicht gefunden',
      description: `Dieses Produkt ist aktuell nicht verfügbar.`,
      alternates: {
        canonical: canonicalPath,
      },
      robots: {
        index: false,
        follow: false,
      },
    }
  }

  const description =
    product.description || `${product.name} im Sortiment von ${SITE_NAME}.`
  const title = `${product.name}`

  return {
    title,
    description,
    alternates: {
      canonical: canonicalPath,
    },
    openGraph: {
      title,
      description,
      url: canonicalPath,
      type: 'website',
      images: [
        {
          url: product.image,
          alt: product.name,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [product.image],
    },
  }
}

export default function ProductLayout({ children }: ProductLayoutProps) {
  return children
}

