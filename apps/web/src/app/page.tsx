'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { ArrowRight, LineChart, MessagesSquare } from 'lucide-react'
import { ProductGrid } from '@/components/products/ProductGrid'
import { Button } from '@/components/ui/Button'
import { loadCatalogProducts } from '@/features/catalog'
import { HeroSection, SegmentEntryCards, ValuePropsGrid } from '@/features/home'
import { useCustomerSegmentStore } from '@/features/segment'
import { PRIMARY_TRUST_SIGNALS, TrustInlineBar } from '@/features/trust'
import { useExperimentVariant } from '@/lib/experiments'
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

  return (
    <main className="pb-20">
      <HeroSection segment={segment} variant={heroVariant} />

      <section className="shell-container mt-7">
        <div className="panel px-4 py-4">
          <p className="section-eyebrow mb-3">Vertrauen im Checkout</p>
          <TrustInlineBar signals={PRIMARY_TRUST_SIGNALS} />
        </div>
      </section>

      <SegmentEntryCards />
      <ValuePropsGrid />

      <section className="shell-container mt-11">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="section-eyebrow">
              {segment === 'b2b' ? 'Verfügbare Kernartikel' : 'Beliebte Produkte'}
            </p>
            <h2 className="mt-2 text-3xl">
              {segment === 'b2b' ? 'Für Teams schnell wiederbestellbar' : 'Für den Alltag schnell entscheidbar'}
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
          emptyMessage="Noch keine Produkte verfügbar"
        />
      </section>

      <section className="shell-container mt-14">
        <div className="grid gap-4 md:grid-cols-3">
          <article className="panel-soft p-5">
            <LineChart className="h-5 w-5 text-brand-accent" />
            <h3 className="mt-3 text-lg">Transparente Preislogik</h3>
            <p className="mt-2 text-sm leading-6 text-brand-text-muted">
              Preise, Versand und steuerliche Hinweise bleiben von Produktseite bis Checkout konsistent sichtbar.
            </p>
          </article>
          <article className="panel-soft p-5">
            <MessagesSquare className="h-5 w-5 text-brand-accent" />
            <h3 className="mt-3 text-lg">Support im richtigen Moment</h3>
            <p className="mt-2 text-sm leading-6 text-brand-text-muted">
              Kritische Fragen zu Lieferung oder Rückgabe sind direkt aus dem Funnel erreichbar.
            </p>
          </article>
          <article className="panel-soft p-5">
            <ArrowRight className="h-5 w-5 text-brand-accent" />
            <h3 className="mt-3 text-lg">Klarer nächster Schritt</h3>
            <p className="mt-2 text-sm leading-6 text-brand-text-muted">
              Jede Seite führt mit einem eindeutigen CTA weiter, ohne versteckte Hürden oder Dark Patterns.
            </p>
          </article>
        </div>
      </section>
    </main>
  )
}
