import { formatPrice } from '@/lib/utils'
import type { Product } from '@/types'

type ProductPricingBlockProps = {
  product: Product
}

export function ProductPricingBlock({ product }: ProductPricingBlockProps) {
  const hasComparePrice = typeof product.compareAtPrice === 'number' && product.compareAtPrice > product.price

  return (
    <div className="space-y-2">
      <div className="flex items-end gap-3">
        <p className="text-3xl font-semibold text-brand-text">{formatPrice(product.price)}</p>
        {hasComparePrice ? (
          <p className="text-lg text-brand-text-muted line-through">{formatPrice(product.compareAtPrice!)}</p>
        ) : null}
      </div>
      <p className="text-sm text-brand-text-muted">
        Lieferstatus: {product.inStock === false ? 'aktuell nicht verfügbar' : `${product.stock} Stück auf Lager`}
      </p>
    </div>
  )
}
