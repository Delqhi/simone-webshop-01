'use client'

import { motion } from 'framer-motion'
import { ProductCard } from './ProductCard'
import { ProductSkeleton } from './ProductSkeleton'
import type { Product } from '@/types'

interface ProductGridProps {
  products: Product[]
  loading?: boolean
  columns?: 2 | 3 | 4
  emptyMessage?: string
}

export function ProductGrid({
  products,
  loading = false,
  columns = 4,
  emptyMessage = 'Keine Produkte gefunden.',
}: ProductGridProps) {
  const gridCols = {
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
  }

  if (loading) {
    return (
      <div className={`grid ${gridCols[columns]} gap-6`}>
        {[...Array(8)].map((_, i) => (
          <ProductSkeleton key={i} />
        ))}
      </div>
    )
  }

  if (products.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="panel-soft flex flex-col items-center justify-center px-6 py-12 text-center"
      >
        <p className="text-xl font-semibold text-brand-text">{emptyMessage}</p>
        <p className="mt-2 max-w-md text-sm text-brand-text-muted">
          Prüfe Filter, Segment oder Suchbegriff. Alle Preise und Verfügbarkeiten werden transparent aktualisiert.
        </p>
      </motion.div>
    )
  }

  return (
    <div className={`grid ${gridCols[columns]} gap-6`}>
      {products.map((product, index) => (
        <ProductCard key={product.id} product={product} index={index} />
      ))}
    </div>
  )
}

interface FeaturedGridProps {
  products: Product[]
  title?: string
  subtitle?: string
}

export function FeaturedGrid({ products, title, subtitle }: FeaturedGridProps) {
  if (products.length === 0) {
    return null
  }

  const [featured, ...rest] = products

  return (
    <div className="space-y-6">
      {title || subtitle ? (
        <div className="text-center">
          {title ? <h2 className="text-3xl">{title}</h2> : null}
          {subtitle ? <p className="mt-2 text-brand-text-muted">{subtitle}</p> : null}
        </div>
      ) : null}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <ProductCard product={featured} index={0} />
        </div>
        {rest.slice(0, 4).map((product, index) => (
          <ProductCard key={product.id} product={product} index={index + 1} />
        ))}
      </div>
    </div>
  )
}
