'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Flame, ShoppingCart, Sparkles, Star } from 'lucide-react'
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

  const productHref = `/products/${encodeURIComponent(product.id)}`
  const primaryImage = product.images[0] || '/placeholder.jpg'
  const hasDiscount = typeof product.compareAtPrice === 'number' && product.compareAtPrice > product.price
  const discountPercent = hasDiscount ? calculateDiscount(product.compareAtPrice!, product.price) : 0
  const hasRating = typeof product.rating === 'number' && product.rating > 0
  const reviewCount = typeof product.reviewCount === 'number' ? product.reviewCount : 0
  const roundedRating = hasRating ? Math.max(0, Math.min(5, Math.round(product.rating!))) : 0
  const oldPrice = product.compareAtPrice ?? product.originalPrice

  const badge = (() => {
    if (hasDiscount) {
      return {
        label: `-${discountPercent}%`,
        className: 'bg-red-600 text-white',
        icon: <Flame className="h-3 w-3" />,
      }
    }
    if (product.isNew) {
      return {
        label: 'Neu',
        className: 'bg-emerald-600 text-white',
        icon: <Sparkles className="h-3 w-3" />,
      }
    }
    if (product.isFeatured) {
      return {
        label: 'Bestseller',
        className: 'bg-black text-white',
        icon: <Flame className="h-3 w-3" />,
      }
    }
    return null
  })()

  const handleAddToCart = async (event: React.MouseEvent) => {
    event.preventDefault()
    event.stopPropagation()

    addItem(
      {
        id: product.id,
        name: product.name,
        price: product.price,
        image: primaryImage,
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
      transition={{ delay: index * 0.04, duration: 0.22 }}
      className="h-full"
    >
      <div className="group flex h-full flex-col overflow-hidden rounded-3xl border border-brand-border bg-white shadow-[var(--shadow-soft)] transition-transform duration-300 hover:-translate-y-1">
        <Link href={productHref} className="block">
          <div className="relative aspect-square overflow-hidden bg-brand-bg-muted">
            <Image
              src={primaryImage}
              alt={product.name}
              fill
              className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            />
            {badge ? (
              <span className={cn('absolute left-3 top-3 inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold shadow-sm', badge.className)}>
                {badge.icon}
                {badge.label}
              </span>
            ) : null}
          </div>
        </Link>

        <div className="flex flex-1 flex-col p-5">
          <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-brand-text-muted">{categoryName(product)}</p>
          <Link href={productHref} className="mt-1 line-clamp-2 text-lg font-semibold text-brand-text transition-colors hover:text-black">
            {product.name}
          </Link>

          {hasRating ? (
            <div className="mt-2 flex items-center gap-1.5 text-xs text-brand-text-muted">
              <div className="flex items-center gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={cn('h-3.5 w-3.5', i < roundedRating ? 'fill-yellow-400 text-yellow-400' : 'text-brand-border-strong')}
                  />
                ))}
              </div>
              <span>{product.rating?.toFixed(1)}</span>
              <span>({reviewCount})</span>
            </div>
          ) : null}

          <div className="mt-3 flex items-end gap-2">
            <p className="text-2xl font-bold text-brand-text">{formatPrice(product.price)}</p>
            {typeof oldPrice === 'number' && oldPrice > product.price ? (
              <p className="text-sm text-brand-text-muted line-through">{formatPrice(oldPrice)}</p>
            ) : null}
          </div>

          <p className="mt-1 text-xs text-brand-text-muted">
            {segment === 'b2b' ? `Lager: ${product.stock ?? 0} Stück` : 'inkl. MwSt., zzgl. Versand'}
          </p>

          <button
            type="button"
            onClick={handleAddToCart}
            disabled={product.inStock === false}
            aria-label={product.inStock === false ? `${product.name} nicht verfügbar` : `${product.name} in den Warenkorb`}
            className={cn(
              'mt-5 inline-flex min-h-[2.8rem] items-center justify-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-colors',
              product.inStock === false
                ? 'cursor-not-allowed bg-brand-bg-muted text-brand-text-muted'
                : 'bg-black text-white hover:bg-zinc-800',
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
