'use client'

import { useMemo, useState } from 'react'
import Image from 'next/image'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import type { Product } from '@/types'

type ProductMediaPanelProps = {
  product: Product
  discount: number | null
}

export function ProductMediaPanel({ product, discount }: ProductMediaPanelProps) {
  const images = useMemo(() => {
    if (product.images.length > 0) {
      return product.images
    }
    return ['/placeholder.jpg']
  }, [product.images])

  const [activeIndex, setActiveIndex] = useState(0)

  const nextImage = () => {
    setActiveIndex((prev) => (prev + 1) % images.length)
  }

  const prevImage = () => {
    setActiveIndex((prev) => (prev - 1 + images.length) % images.length)
  }

  return (
    <article className="space-y-3">
      <div className="group relative aspect-square overflow-hidden rounded-[2rem] border border-brand-border bg-gradient-to-br from-zinc-100 to-zinc-200 shadow-[0_22px_55px_rgba(10,10,10,0.16)]">
        <Image
          src={images[activeIndex]}
          alt={product.name}
          fill
          className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
          priority
          sizes="(max-width: 1024px) 100vw, 55vw"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent" />

        {discount ? (
          <span className="absolute left-4 top-4 rounded-full bg-black px-3 py-1.5 text-xs font-semibold text-white">
            -{discount}%
          </span>
        ) : null}

        {images.length > 1 ? (
          <>
            <button
              type="button"
              onClick={prevImage}
              aria-label="Vorheriges Bild"
              className="absolute left-3 top-1/2 inline-flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/70 bg-white/80 text-brand-text opacity-0 transition-all group-hover:opacity-100 hover:bg-white"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={nextImage}
              aria-label="Nachstes Bild"
              className="absolute right-3 top-1/2 inline-flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/70 bg-white/80 text-brand-text opacity-0 transition-all group-hover:opacity-100 hover:bg-white"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </>
        ) : null}

        <div className="glass-card absolute bottom-4 left-4 right-4 rounded-xl p-3">
          <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-brand-text-muted">Premium Product View</p>
          <p className="text-sm font-semibold text-brand-text">{product.name}</p>
        </div>
      </div>

      {images.length > 1 ? (
        <div className="grid grid-cols-4 gap-2">
          {images.slice(0, 8).map((image, index) => {
            const selected = activeIndex === index
            return (
              <button
                key={`${product.id}-thumb-${index}`}
                type="button"
                onClick={() => setActiveIndex(index)}
                className={[
                  'relative aspect-square overflow-hidden rounded-2xl border transition-all',
                  selected
                    ? 'border-black shadow-[0_10px_24px_rgba(10,10,10,0.14)]'
                    : 'border-brand-border opacity-75 hover:opacity-100',
                ].join(' ')}
                aria-label={`${product.name} Bild ${index + 1}`}
              >
                <Image
                  src={image}
                  alt={`${product.name} Thumbnail ${index + 1}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 25vw, 12vw"
                />
              </button>
            )
          })}
        </div>
      ) : null}
    </article>
  )
}
