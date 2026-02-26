import type { Product } from '@/types'
import { absoluteUrl, DEFAULT_CURRENCY, SITE_NAME } from '@/lib/site'

type BreadcrumbItem = {
  name: string
  path: string
}

function productCategory(product: Product): string {
  if (typeof product.category === 'string') {
    return product.category
  }
  if (typeof product.category?.name === 'string' && product.category.name) {
    return product.category.name
  }
  return 'Allgemein'
}

function productImage(product: Product): string {
  const image = product.images[0] || '/placeholder.jpg'
  if (image.startsWith('http://') || image.startsWith('https://')) {
    return image
  }
  return absoluteUrl(image)
}

function productUrl(product: Product): string {
  return absoluteUrl(`/products/${encodeURIComponent(product.id)}`)
}

function availability(product: Product): string {
  const stock = typeof product.stock === 'number' ? product.stock : 0
  const inStock = product.inStock ?? stock > 0
  return inStock
    ? 'https://schema.org/InStock'
    : 'https://schema.org/OutOfStock'
}

export function buildProductJsonLd(product: Product): Record<string, unknown> {
  const output: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description || `Produkt im Sortiment von ${SITE_NAME}`,
    category: productCategory(product),
    image: [productImage(product)],
    sku: product.id,
    url: productUrl(product),
    brand: {
      '@type': 'Brand',
      name: SITE_NAME,
    },
    offers: {
      '@type': 'Offer',
      priceCurrency: DEFAULT_CURRENCY,
      price: Number(product.price).toFixed(2),
      availability: availability(product),
      url: productUrl(product),
      itemCondition: 'https://schema.org/NewCondition',
    },
  }

  if (typeof product.rating === 'number' && typeof product.reviewCount === 'number' && product.reviewCount > 0) {
    output.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: Number(product.rating).toFixed(1),
      reviewCount: product.reviewCount,
    }
  }

  return output
}

export function buildProductListJsonLd(
  products: Product[],
  listName: string,
  listPath: string,
): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: listName,
    url: absoluteUrl(listPath),
    itemListElement: products.slice(0, 24).map((product, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      url: productUrl(product),
      name: product.name,
    })),
  }
}

export function buildBreadcrumbJsonLd(items: BreadcrumbItem[]): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  }
}

