import { formatPrice } from '@/lib/utils'
import type { Product } from '@/types'

type ProductPricingBlockProps = {
  product: Product
}

export function ProductPricingBlock({ product }: ProductPricingBlockProps) {
  const hasComparePrice = typeof product.compareAtPrice === 'number' && product.compareAtPrice > product.price
  const inStock = product.inStock !== false && product.stock > 0

  return (
    <section className="rounded-[1.5rem] border border-brand-border bg-white/85 p-5">
      <div className="flex flex-wrap items-end gap-3">
        <p className="text-4xl font-semibold text-brand-text">{formatPrice(product.price)}</p>
        {hasComparePrice ? (
          <p className="text-lg text-brand-text-muted line-through">{formatPrice(product.compareAtPrice!)}</p>
        ) : null}
      </div>

      <div className="mt-3 inline-flex items-center gap-2 rounded-full border border-brand-border bg-brand-bg-muted/70 px-3 py-1 text-xs font-semibold text-brand-text">
        <span className={['inline-flex h-2 w-2 rounded-full', inStock ? 'bg-emerald-500' : 'bg-red-500'].join(' ')} />
        {inStock ? `${product.stock} Stueck auf Lager` : 'Aktuell nicht verfugbar'}
      </div>
    </section>
  )
}
