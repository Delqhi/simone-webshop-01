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
  const label = product.inStock === false ? 'Nicht verfügbar' : ctaLabel || 'In den Warenkorb'

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="inline-flex items-center rounded-xl border border-brand-border bg-brand-surface">
          <button
            type="button"
            onClick={() => onQuantityChange(Math.max(1, quantity - 1))}
            className="rounded-l-xl px-3 py-2 text-brand-text-muted hover:bg-brand-bg-muted hover:text-brand-text"
          >
            <Minus className="h-4 w-4" />
          </button>
          <span className="min-w-[3.2rem] text-center text-sm font-semibold text-brand-text">{quantity}</span>
          <button
            type="button"
            onClick={() => onQuantityChange(Math.min(product.stock || 1, quantity + 1))}
            className="rounded-r-xl px-3 py-2 text-brand-text-muted hover:bg-brand-bg-muted hover:text-brand-text"
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

      <button className="inline-flex items-center gap-2 text-sm text-brand-text-muted hover:text-brand-text">
        <Share2 className="h-4 w-4" />
        Produkt teilen
      </button>
    </div>
  )
}
