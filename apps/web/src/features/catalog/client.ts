import {
  CatalogCategoryListSchema,
  CatalogProductListSchema,
  CatalogProductSchema,
  type CatalogCategory,
  type CatalogProduct,
} from '@simone/contracts'
import { sampleCategories, sampleProducts } from '@/data/sample-products'
import type { Category, Product } from '@/types'

const DEFAULT_IMAGE = '/placeholder.jpg'

type ProductQuery = {
  search?: string
  category?: string
  page?: number
  limit?: number
}

function allowSampleFallback(): boolean {
  if (process.env.NEXT_PUBLIC_WEB_CATALOG_FALLBACK_ENABLED === 'true') {
    return true
  }
  return process.env.NODE_ENV !== 'production'
}

function toCategoryReference(product: CatalogProduct): NonNullable<Product['category']> {
  const fallback = 'allgemein'
  const id = product.categoryId || fallback
  const name = product.categoryName || 'Allgemein'
  const slug = product.categorySlug || id
  return {
    id,
    name,
    slug,
  }
}

function toUIProduct(product: CatalogProduct): Product {
  const categoryRef = toCategoryReference(product)
  const rating = typeof product.rating === 'number' ? product.rating : undefined
  const reviewCount = typeof product.reviewCount === 'number' ? product.reviewCount : undefined

  return {
    id: product.id,
    slug: product.slug || product.id,
    name: product.name,
    description: product.description || '',
    price: product.price,
    originalPrice: product.originalPrice,
    compareAtPrice: product.originalPrice,
    images: product.images.length ? product.images : [DEFAULT_IMAGE],
    category: categoryRef,
    categoryId: categoryRef.id,
    rating,
    reviewCount,
    inStock: product.stock > 0 && product.isActive,
    isSale: typeof product.originalPrice === 'number' && product.originalPrice > product.price,
    stock: product.stock,
    createdAt: product.createdAt || new Date().toISOString(),
    updatedAt: product.updatedAt || new Date().toISOString(),
  }
}

function normalizeLegacySampleProduct(product: Product): Product {
  if (typeof product.category === 'object' && product.category !== null) {
    return {
      ...product,
      images: product.images.length ? product.images : [DEFAULT_IMAGE],
      inStock: product.inStock ?? product.stock > 0,
    }
  }

  const knownCategory = sampleCategories.find((entry) => entry.id === product.categoryId)

  return {
    ...product,
    category: {
      id: knownCategory?.id || product.categoryId || 'allgemein',
      name: knownCategory?.name || (typeof product.category === 'string' ? product.category : 'Allgemein'),
      slug: knownCategory?.slug || product.categoryId || 'allgemein',
    },
    images: product.images.length ? product.images : [DEFAULT_IMAGE],
    inStock: product.inStock ?? product.stock > 0,
    compareAtPrice: product.compareAtPrice || product.originalPrice,
  }
}

function normalizeSampleProducts(items: Product[]): Product[] {
  return items.map(normalizeLegacySampleProduct)
}

function normalizeSampleCategories(): Category[] {
  return sampleCategories.map((category) => ({
    ...category,
    productCount: sampleProducts.filter((product) => product.categoryId === category.id).length,
  }))
}

function buildQuery(params: ProductQuery) {
  const query = new URLSearchParams()
  if (params.search) {
    query.set('search', params.search)
  }
  if (params.category) {
    query.set('category', params.category)
  }
  if (params.page) {
    query.set('page', String(params.page))
  }
  if (params.limit) {
    query.set('limit', String(params.limit))
  }
  return query.toString()
}

export async function loadCatalogProducts(params: ProductQuery = {}): Promise<Product[]> {
  const query = buildQuery(params)
  const url = query ? `/api/products?${query}` : '/api/products'

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        accept: 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error(`catalog products request failed (${response.status})`)
    }

    const payload = CatalogProductListSchema.parse(await response.json())
    return payload.items.map(toUIProduct)
  } catch (error) {
    if (!allowSampleFallback()) {
      console.error('catalog_products_fetch_failed_no_fallback', error)
      return []
    }
    return normalizeSampleProducts(sampleProducts)
  }
}

export async function loadCatalogProductById(id: string): Promise<Product | null> {
  try {
    const response = await fetch(`/api/products/${id}`, {
      method: 'GET',
      headers: {
        accept: 'application/json',
      },
    })

    if (!response.ok) {
      if (response.status === 404) {
        return null
      }
      throw new Error(`catalog product request failed (${response.status})`)
    }

    const payload = CatalogProductSchema.parse(await response.json())
    return toUIProduct(payload)
  } catch (error) {
    if (!allowSampleFallback()) {
      console.error('catalog_product_fetch_failed_no_fallback', error)
      return null
    }
    const fallback = sampleProducts.find((product) => product.id === id)
    return fallback ? normalizeLegacySampleProduct(fallback) : null
  }
}

function toUICategory(category: CatalogCategory): Category {
  return {
    id: category.id,
    name: category.name,
    slug: category.slug,
    description: category.description || undefined,
    image: category.image || undefined,
    productCount: undefined,
  }
}

export async function loadCatalogCategories(): Promise<Category[]> {
  try {
    const response = await fetch('/api/categories', {
      method: 'GET',
      headers: {
        accept: 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error(`catalog categories request failed (${response.status})`)
    }

    const payload = CatalogCategoryListSchema.parse(await response.json())
    return payload.items.map(toUICategory)
  } catch (error) {
    if (!allowSampleFallback()) {
      console.error('catalog_categories_fetch_failed_no_fallback', error)
      return []
    }
    return normalizeSampleCategories()
  }
}
