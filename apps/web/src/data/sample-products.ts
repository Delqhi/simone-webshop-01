import type { Product } from '@/types'
import { sampleCategories } from './sample-categories'
import { sampleProductsPartA } from './sample-products-a'
import { sampleProductsPartB } from './sample-products-b'

export { sampleCategories }

export const sampleProducts: Product[] = [...sampleProductsPartA, ...sampleProductsPartB]

export const getProductById = (id: string): Product | undefined => sampleProducts.find((product) => product.id === id)

export const getProductsByCategory = (categoryId: string): Product[] => sampleProducts.filter((product) => product.categoryId === categoryId)

export const getBestsellers = (): Product[] =>
  [...sampleProducts].sort((a, b) => (b.reviewCount ?? 0) - (a.reviewCount ?? 0)).slice(0, 4)

export const getNewArrivals = (): Product[] => sampleProducts.filter((product) => product.isNew).slice(0, 4)

export const getFeaturedProducts = (): Product[] =>
  sampleProducts
    .filter((product) => product.isFeatured || (product.reviewCount ?? 0) > 250)
    .slice(0, 8)

export const getNewProducts = (): Product[] => getNewArrivals()

export const getSaleProducts = (): Product[] => sampleProducts.filter((product) => product.isSale).slice(0, 4)

export const getRelatedProducts = (productId: string, limit = 4): Product[] => {
  const current = getProductById(productId)
  if (!current) {
    return []
  }

  return sampleProducts
    .filter((product) => product.id !== productId && product.categoryId === current.categoryId)
    .slice(0, limit)
}
