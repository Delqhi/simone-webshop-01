import { ProductActionPanel } from '@/features/product/actions/ProductActionPanel'
import { ProductPricingBlock } from '@/features/product/pricing/ProductPricingBlock'
import { ProductTrustPanel } from '@/features/product/trust/ProductTrustPanel'
import { PromotionBannerStrip } from '@/features/promotions'
import type { CustomerSegment } from '@simone/contracts'
import type { Product } from '@/types'

type ProductInfoPanelProps = {
  categoryName: string
  product: Product
  segment: CustomerSegment
  quantity: number
  ctaLabel?: string
  trustFirst?: boolean
  onQuantityChange: (value: number) => void
  onAddToCart: () => void
}

export function ProductInfoPanel({
  categoryName,
  product,
  segment,
  quantity,
  ctaLabel,
  trustFirst = false,
  onQuantityChange,
  onAddToCart,
}: ProductInfoPanelProps) {
  return (
    <article className="space-y-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-brand-text-muted">{categoryName}</p>
        <h1 className="mt-2 text-4xl leading-tight">{product.name}</h1>
        <p className="mt-3 text-sm leading-6 text-brand-text-muted">{product.description}</p>
      </div>

      <ProductPricingBlock product={product} />

      {trustFirst ? <ProductTrustPanel /> : null}

      <PromotionBannerStrip placement="pdp" segment={segment} />

      <ProductActionPanel
        product={product}
        quantity={quantity}
        ctaLabel={ctaLabel}
        onQuantityChange={onQuantityChange}
        onAddToCart={onAddToCart}
      />

      {!trustFirst ? <ProductTrustPanel /> : null}
    </article>
  )
}
