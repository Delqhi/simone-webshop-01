import { Check } from 'lucide-react'
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

const QUICK_BENEFITS = ['Kostenfreie Versandoptionen', '30 Tage Rueckgabe', 'Schneller Support im Checkout']

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
    <article className="space-y-4 lg:sticky lg:top-24 lg:self-start">
      <section className="rounded-[1.8rem] border border-brand-border bg-white/90 p-6 shadow-[0_14px_36px_rgba(10,10,10,0.08)]">
        <p className="text-xs font-bold uppercase tracking-[0.1em] text-brand-text-muted">{categoryName}</p>
        <h1 className="mt-2 text-4xl leading-tight md:text-5xl">{product.name}</h1>
        <p className="mt-4 text-sm leading-7 text-brand-text-muted">{product.description}</p>

        <div className="mt-5 flex flex-wrap gap-2">
          {QUICK_BENEFITS.map((entry) => (
            <span
              key={entry}
              className="inline-flex items-center gap-1.5 rounded-full border border-brand-border bg-brand-bg-muted/70 px-3 py-1.5 text-xs font-semibold text-brand-text"
            >
              <Check className="h-3.5 w-3.5 text-emerald-600" />
              {entry}
            </span>
          ))}
        </div>
      </section>

      <ProductPricingBlock product={product} />

      {trustFirst ? <ProductTrustPanel /> : null}

      <PromotionBannerStrip placement="pdp" segment={segment} className="block" />

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
