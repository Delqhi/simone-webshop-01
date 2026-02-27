import { Minus, Plus, Share2, ShoppingCart } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import type { Product } from '@/types'

type ProductActionPanelProps = {
  product: Product
  quantity: number
  ctaLabel?: string
  onQuantityChange: (value: number) => void
  onAddToCart: () => void
}

export function ProductActionPanel({
  product,
  quantity,
  ctaLabel,
  onQuantityChange,
  onAddToCart,
}: ProductActionPanelProps) {
  const label = product.inStock === false ? 'Nicht verfugbar' : ctaLabel || 'In den Warenkorb'

  return (
    <section className="rounded-[1.5rem] border border-brand-border bg-white/85 p-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="inline-flex items-center rounded-full border border-brand-border bg-white p-1">
          <button
            type="button"
            onClick={() => onQuantityChange(Math.max(1, quantity - 1))}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full text-brand-text-muted transition-colors hover:bg-brand-bg-muted hover:text-brand-text"
          >
            <Minus className="h-4 w-4" />
          </button>
          <span className="min-w-[2.6rem] text-center text-sm font-semibold text-brand-text">{quantity}</span>
          <button
            type="button"
            onClick={() => onQuantityChange(Math.min(product.stock || 1, quantity + 1))}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full text-brand-text-muted transition-colors hover:bg-brand-bg-muted hover:text-brand-text"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>

        <Button
          size="lg"
          onClick={onAddToCart}
          disabled={product.inStock === false}
          leftIcon={<ShoppingCart className="h-4 w-4" />}
          className="sm:flex-1"
        >
          {label}
        </Button>
      </div>

      <button className="mt-4 inline-flex items-center gap-2 rounded-full border border-brand-border bg-white px-3 py-2 text-xs font-semibold text-brand-text-muted transition-colors hover:border-black/30 hover:text-black">
        <Share2 className="h-3.5 w-3.5" />
        Produkt teilen
      </button>
    </section>
  )
}
