'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ShoppingCart, Star } from 'lucide-react'
import { useCartStore } from '@/lib/store'
import { formatPrice, calculateDiscount, cn } from '@/lib/utils'
import { trackEvent } from '@/lib/analytics'
import { useCustomerSegmentStore } from '@/features/segment'
import type { Product } from '@/types'

interface ProductCardProps {
  product: Product
  index?: number
}

function categoryName(product: Product): string {
  if (typeof product.category === 'string') {
    return product.category
  }
  if (typeof product.category?.name === 'string') {
    return product.category.name
  }
  return 'Produkt'
}

export function ProductCard({ product, index = 0 }: ProductCardProps) {
  const { addItem } = useCartStore()
  const { segment } = useCustomerSegmentStore()

  const hasDiscount = typeof product.compareAtPrice === 'number' && product.compareAtPrice > product.price
  const discountPercent = hasDiscount ? calculateDiscount(product.compareAtPrice!, product.price) : 0
  const hasRating = typeof product.rating === 'number' && product.rating > 0 && typeof product.reviewCount === 'number' && product.reviewCount > 0

  const handleAddToCart = async (event: React.MouseEvent) => {
    event.preventDefault()
    event.stopPropagation()

    addItem(
      {
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.images[0] || '/placeholder.jpg',
      },
      1,
    )

    await trackEvent('add_to_cart', {
      payload: {
        product_id: product.id,
        price: product.price,
        segment,
      },
    })
  }

  return (
    <motion.article
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04, duration: 0.2 }}
      className="h-full"
    >
      <div className="panel-soft flex h-full flex-col overflow-hidden transition-shadow hover:shadow-xl">
        <Link href={`/products/${product.id}`} className="block">
          <div className="relative aspect-square bg-brand-bg-muted">
            <Image
              src={product.images[0] || '/placeholder.jpg'}
              alt={product.name}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            />
            {hasDiscount ? (
              <span className="absolute left-3 top-3 rounded-full bg-red-600 px-2 py-1 text-xs font-semibold text-white">
                -{discountPercent}%
              </span>
            ) : null}
          </div>
        </Link>

        <div className="flex flex-1 flex-col p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-brand-text-muted">{categoryName(product)}</p>
          <Link href={`/products/${product.id}`} className="mt-1 line-clamp-2 text-base font-semibold text-brand-text hover:text-brand-accent">
            {product.name}
          </Link>

          {hasRating ? (
            <div className="mt-2 flex items-center gap-1 text-xs text-brand-text-muted">
              <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
              <span>{product.rating?.toFixed(1)}</span>
              <span>({product.reviewCount})</span>
            </div>
          ) : null}

          <div className="mt-3 flex items-end gap-2">
            <p className="text-lg font-semibold text-brand-text">{formatPrice(product.price)}</p>
            {hasDiscount ? <p className="text-sm text-brand-text-muted line-through">{formatPrice(product.compareAtPrice!)}</p> : null}
          </div>

          <p className="mt-1 text-xs text-brand-text-muted">
            {segment === 'b2b' ? `Lager: ${product.stock ?? 0} Stück` : 'inkl. MwSt., zzgl. Versand'}
          </p>

          <button
            type="button"
            onClick={handleAddToCart}
            disabled={product.inStock === false}
            className={cn(
              'mt-4 inline-flex items-center justify-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold transition-colors',
              product.inStock === false
                ? 'cursor-not-allowed bg-brand-bg-muted text-brand-text-muted'
                : 'bg-brand-accent text-white hover:bg-[color:var(--brand-accent-strong)]',
            )}
          >
            <ShoppingCart className="h-4 w-4" />
            {product.inStock === false ? 'Aktuell nicht verfügbar' : 'In den Warenkorb'}
          </button>
        </div>
      </div>
    </motion.article>
  )
}
