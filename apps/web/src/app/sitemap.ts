import type { MetadataRoute } from 'next'
import { sampleProducts } from '@/data/sample-products'
import { absoluteUrl } from '@/lib/site'

const STATIC_ROUTES = [
  '/',
  '/products',
  '/about',
  '/faq',
  '/kontakt',
  '/versand',
  '/rueckgabe',
  '/datenschutz',
  '/impressum',
  '/widerrufsrecht',
  '/agb',
]

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()

  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map((route) => ({
    url: absoluteUrl(route),
    lastModified: now,
    changeFrequency: route === '/' ? 'daily' : 'weekly',
    priority: route === '/' ? 1 : 0.7,
  }))

  const productEntries: MetadataRoute.Sitemap = sampleProducts.map((product) => ({
    url: absoluteUrl(`/products/${encodeURIComponent(product.id)}`),
    lastModified: new Date(product.updatedAt),
    changeFrequency: 'daily',
    priority: 0.8,
  }))

  return [...staticEntries, ...productEntries]
}

