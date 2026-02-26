import { calculateDiscount } from '@/lib/utils'
import type { Product } from '@/types'

export function getProductCategory(product: Product): { name: string; slug: string } {
  if (typeof product.category === 'object' && product.category !== null) {
    return {
      name: product.category.name || 'Kategorie',
      slug: product.category.slug || product.categoryId,
    }
  }

  return {
    name: typeof product.category === 'string' ? product.category : 'Kategorie',
    slug: product.categoryId,
  }
}

export function getProductDiscount(product: Product): number | null {
  if (!product.compareAtPrice || product.compareAtPrice <= product.price) {
    return null
  }

  return calculateDiscount(product.compareAtPrice, product.price)
}
