'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { ArrowRight, LineChart, MessagesSquare } from 'lucide-react'
import { ProductGrid } from '@/components/products/ProductGrid'
import { JsonLd } from '@/components/seo/JsonLd'
import { Button } from '@/components/ui/Button'
import { loadCatalogProducts } from '@/features/catalog'
import { HeroSection, SegmentEntryCards, ValuePropsGrid } from '@/features/home'
import { useCustomerSegmentStore } from '@/features/segment'
import { PRIMARY_TRUST_SIGNALS, TrustInlineBar } from '@/features/trust'
import { useExperimentVariant } from '@/lib/experiments'
import { buildProductListJsonLd } from '@/lib/seo'
import type { Product } from '@/types'

export default function HomePage() {
  const { segment } = useCustomerSegmentStore()
  const heroVariant = useExperimentVariant({
    experimentId: 'home_hero_copy_v1',
    variants: ['control', 'trust'] as const,
  })
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true

    const run = async () => {
      setLoading(true)
      const items = await loadCatalogProducts({ limit: 12 })
      if (!active) {
        return
      }
      setProducts(items)
      setLoading(false)
    }

    void run()

    return () => {
      active = false
    }
  }, [])

  const featuredProducts = useMemo(() => {
    if (segment === 'b2b') {
      return [...products]
        .sort((a, b) => b.stock - a.stock)
        .slice(0, 8)
    }
    return [...products]
      .sort((a, b) => (b.reviewCount ?? 0) - (a.reviewCount ?? 0))
      .slice(0, 8)
  }, [products, segment])

  const featuredProductsJsonLd = useMemo(
    () => buildProductListJsonLd(featuredProducts, 'Empfohlene Produkte', '/'),
    [featuredProducts],
  )

  return (
    <main className="pb-20">
      <JsonLd id="home-featured-products" data={featuredProductsJsonLd} />
      <HeroSection segment={segment} variant={heroVariant} />

      <section className="shell-container mt-7">
        <div className="rounded-[1.7rem] border border-brand-border bg-white/85 px-5 py-5 shadow-[0_10px_30px_rgba(10,10,10,0.06)]">
          <p className="section-eyebrow mb-3">Vertrauen im Checkout</p>
          <TrustInlineBar signals={PRIMARY_TRUST_SIGNALS} />
        </div>
      </section>

      <SegmentEntryCards />
      <ValuePropsGrid />

      <section className="shell-container mt-12">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="section-eyebrow">
              {segment === 'b2b' ? 'Verfuegbare Kernartikel' : 'Beliebte Produkte'}
            </p>
            <h2 className="mt-2 text-3xl md:text-4xl">
              {segment === 'b2b' ? 'Fuer Teams schnell wiederbestellbar' : 'Fuer den Alltag schnell entscheidbar'}
            </h2>
          </div>
          <Link href="/products">
            <Button variant="outline" rightIcon={<ArrowRight className="h-4 w-4" />}>
              Zum gesamten Sortiment
            </Button>
          </Link>
        </div>

        <ProductGrid
          products={featuredProducts}
          loading={loading}
          columns={4}
          emptyMessage="Noch keine Produkte verfugbar"
        />
      </section>

      <section className="shell-container mt-14">
        <div className="grid gap-4 md:grid-cols-3">
          <article className="rounded-[1.5rem] border border-brand-border bg-white/85 p-5 shadow-[0_8px_24px_rgba(10,10,10,0.05)]">
            <LineChart className="h-5 w-5 text-brand-text" />
            <h3 className="mt-3 text-xl">Transparente Preislogik</h3>
            <p className="mt-2 text-sm leading-7 text-brand-text-muted">
              Preise, Versand und steuerliche Hinweise bleiben von Produktseite bis Checkout konsistent sichtbar.
            </p>
          </article>
          <article className="rounded-[1.5rem] border border-brand-border bg-white/85 p-5 shadow-[0_8px_24px_rgba(10,10,10,0.05)]">
            <MessagesSquare className="h-5 w-5 text-brand-text" />
            <h3 className="mt-3 text-xl">Support im richtigen Moment</h3>
            <p className="mt-2 text-sm leading-7 text-brand-text-muted">
              Kritische Fragen zu Lieferung oder Rueckgabe sind direkt aus dem Funnel erreichbar.
            </p>
          </article>
          <article className="rounded-[1.5rem] border border-brand-border bg-white/85 p-5 shadow-[0_8px_24px_rgba(10,10,10,0.05)]">
            <ArrowRight className="h-5 w-5 text-brand-text" />
            <h3 className="mt-3 text-xl">Klarer naechster Schritt</h3>
            <p className="mt-2 text-sm leading-7 text-brand-text-muted">
              Jede Seite fuhrt mit einem eindeutigen CTA weiter, ohne versteckte Huerden oder Dark Patterns.
            </p>
          </article>
        </div>
      </section>
    </main>
  )
}
