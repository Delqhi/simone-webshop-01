import Image from 'next/image'
import type { Product } from '@/types'

type ProductMediaPanelProps = {
  product: Product
  discount: number | null
}

export function ProductMediaPanel({ product, discount }: ProductMediaPanelProps) {
  return (
    <article className="panel overflow-hidden">
      <div className="relative aspect-square bg-brand-bg-muted">
        <Image
          src={product.images[0] || '/placeholder.jpg'}
          alt={product.name}
          fill
          className="object-cover"
          priority
        />
        {discount ? (
          <span className="absolute left-4 top-4 rounded-full bg-red-600 px-2 py-1 text-xs font-semibold text-white">
            -{discount}%
          </span>
        ) : null}
      </div>
    </article>
  )
}
