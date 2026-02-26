'use client'

import { useEffect, useMemo, useState } from 'react'
import { Search } from 'lucide-react'
import { Input } from '@/components/ui/Input'
import { ProductGrid } from '@/components/products/ProductGrid'
import { JsonLd } from '@/components/seo/JsonLd'
import { ProductFilters, defaultFilterState, type FilterState } from '@/components/products/ProductFilters'
import { loadCatalogCategories, loadCatalogProducts } from '@/features/catalog'
import { SEGMENT_LABELS, useCustomerSegmentStore } from '@/features/segment'
import { PRIMARY_TRUST_SIGNALS, TrustInlineBar } from '@/features/trust'
import { buildProductListJsonLd } from '@/lib/seo'
import type { Category, Product } from '@/types'

function sortProducts(items: Product[], sortBy: string) {
  const output = [...items]
  switch (sortBy) {
    case 'price-asc':
      return output.sort((a, b) => a.price - b.price)
    case 'price-desc':
      return output.sort((a, b) => b.price - a.price)
    case 'name-asc':
      return output.sort((a, b) => a.name.localeCompare(b.name))
    case 'name-desc':
      return output.sort((a, b) => b.name.localeCompare(a.name))
    case 'popular':
      return output.sort((a, b) => (b.reviewCount || 0) - (a.reviewCount || 0))
    default:
      return output.sort((a, b) => Date.parse(b.updatedAt) - Date.parse(a.updatedAt))
  }
}

export default function ProductsPage() {
  const { segment, setSegment } = useCustomerSegmentStore()

  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [filters, setFilters] = useState<FilterState>(defaultFilterState)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const initialSegment = params.get('segment')
    if (initialSegment === 'b2b' || initialSegment === 'b2c') {
      setSegment(initialSegment)
    }
  }, [setSegment])

  useEffect(() => {
    let active = true

    const run = async () => {
      setLoading(true)
      const [loadedProducts, loadedCategories] = await Promise.all([
        loadCatalogProducts({ limit: 120 }),
        loadCatalogCategories(),
      ])

      if (!active) {
        return
      }

      const maxPrice = Math.max(...loadedProducts.map((product) => product.price), 100)
      setProducts(loadedProducts)
      setCategories(loadedCategories)
      setFilters((current) => ({ ...current, priceRange: [0, Math.ceil(maxPrice)] }))
      setLoading(false)
    }

    void run()

    return () => {
      active = false
    }
  }, [])

  const filteredProducts = useMemo(() => {
    const bySearch = products.filter((product) => {
      if (!filters.search) {
        return true
      }
      const search = filters.search.toLowerCase()
      return product.name.toLowerCase().includes(search) || product.description.toLowerCase().includes(search)
    })

    const byCategory = bySearch.filter((product) => {
      if (filters.categories.length === 0) {
        return true
      }
      return filters.categories.includes(product.categoryId)
    })

    const byPrice = byCategory.filter(
      (product) => product.price >= filters.priceRange[0] && product.price <= filters.priceRange[1],
    )

    const byStock = byPrice.filter((product) => {
      if (filters.inStock === null) {
        return true
      }
      const isInStock = product.inStock ?? product.stock > 0
      return isInStock === filters.inStock
    })

    return sortProducts(byStock, filters.sortBy)
  }, [filters, products])

  const productListJsonLd = useMemo(
    () => buildProductListJsonLd(filteredProducts, 'Produktkatalog', '/products'),
    [filteredProducts],
  )

  return (
    <main className="shell-container py-10">
      <JsonLd id="products-item-list" data={productListJsonLd} />
      <header className="mb-6">
        <p className="text-sm font-semibold uppercase tracking-wide text-brand-text-muted">{SEGMENT_LABELS[segment]}</p>
        <h1 className="mt-1 text-4xl">Produkte mit klaren Kosten und Nutzen</h1>
        <p className="mt-3 max-w-3xl text-base leading-7 text-brand-text-muted">
          {segment === 'b2b'
            ? 'Filtere nach Verfügbarkeit, Preisrahmen und Kategorien, um wiederkehrende Beschaffung effizient zu planen.'
            : 'Finde schnell passende Produkte mit transparenter Preis- und Lieferkommunikation ohne unnötige Hürden.'}
        </p>
      </header>

      <TrustInlineBar signals={PRIMARY_TRUST_SIGNALS} className="mb-6" />

      <div className="mb-6 max-w-xl">
        <Input
          label="Produktsuche"
          placeholder="z. B. Kopfhörer, Smartwatch, Yoga"
          value={filters.search}
          onChange={(event) => setFilters({ ...filters, search: event.target.value })}
          leftIcon={<Search className="h-4 w-4" />}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-[18rem_1fr]">
        <ProductFilters
          categories={categories}
          filters={filters}
          onFiltersChange={setFilters}
          minPrice={0}
          maxPrice={Math.max(...products.map((product) => product.price), 100)}
          productCount={filteredProducts.length}
        />

        <section>
          <ProductGrid products={filteredProducts} loading={loading} columns={3} emptyMessage="Keine passenden Produkte gefunden." />
        </section>
      </div>
    </main>
  )
}
