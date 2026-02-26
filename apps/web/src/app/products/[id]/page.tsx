'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { ProductGrid } from '@/components/products/ProductGrid'
import { ProductDetailSkeleton } from '@/components/products/ProductSkeleton'
import { JsonLd } from '@/components/seo/JsonLd'
import {
  ProductInfoPanel,
  ProductMediaPanel,
  getProductCategory,
  getProductDiscount,
  useProductDetail,
} from '@/features/product'
import { useCustomerSegmentStore } from '@/features/segment'
import { trackEvent } from '@/lib/analytics'
import { useExperimentVariant } from '@/lib/experiments'
import { buildBreadcrumbJsonLd, buildProductJsonLd } from '@/lib/seo'
import { useCartStore } from '@/lib/store'

export default function ProductDetailPage() {
  const params = useParams<{ id: string }>()
  const productId = params.id

  const { addItem } = useCartStore()
  const { segment } = useCustomerSegmentStore()
  const { product, related, loading } = useProductDetail(productId)
  const ctaVariant = useExperimentVariant({
    experimentId: 'pdp_cta_copy_v1',
    variants: ['control', 'benefit'] as const,
  })
  const trustVariant = useExperimentVariant({
    experimentId: 'pdp_trust_position_v1',
    variants: ['after_cta', 'before_cta'] as const,
  })
  const [quantity, setQuantity] = useState(1)

  const category = useMemo(() => (product ? getProductCategory(product) : null), [product])
  const discount = useMemo(() => (product ? getProductDiscount(product) : null), [product])
  const productJsonLd = useMemo(() => (product ? buildProductJsonLd(product) : null), [product])
  const breadcrumbJsonLd = useMemo(
    () =>
      product
        ? buildBreadcrumbJsonLd([
            { name: 'Start', path: '/' },
            { name: 'Produkte', path: '/products' },
            { name: product.name, path: `/products/${encodeURIComponent(product.id)}` },
          ])
        : null,
    [product],
  )

  useEffect(() => {
    if (!product) {
      return
    }

    void trackEvent('view_product', {
      payload: {
        product_id: product.id,
        category_id: product.categoryId,
        price: product.price,
      },
    })
  }, [product])

  const addToCart = async () => {
    if (!product) {
      return
    }

    addItem(
      {
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.images[0],
      },
      quantity,
    )

    await trackEvent('add_to_cart', {
      payload: {
        product_id: product.id,
        quantity,
      },
    })
  }

  if (loading) {
    return (
      <main className="shell-container py-10">
        <ProductDetailSkeleton />
      </main>
    )
  }

  if (!product || !category) {
    return (
      <main className="shell-container py-14">
        <div className="panel-soft px-6 py-10 text-center">
          <h1 className="text-3xl">Produkt nicht gefunden</h1>
          <p className="mt-3 text-brand-text-muted">Dieses Produkt ist aktuell nicht verfügbar oder wurde entfernt.</p>
          <Link href="/products" className="mt-5 inline-flex rounded-xl border border-brand-border px-4 py-2 text-sm font-semibold hover:border-brand-accent hover:text-brand-accent">
            Zurück zur Übersicht
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className="shell-container py-10">
      {productJsonLd ? <JsonLd id="pdp-product-jsonld" data={productJsonLd} /> : null}
      {breadcrumbJsonLd ? <JsonLd id="pdp-breadcrumb-jsonld" data={breadcrumbJsonLd} /> : null}
      <nav className="mb-5 text-sm text-brand-text-muted">
        <Link href="/" className="hover:text-brand-text">Start</Link>
        <span className="px-2">/</span>
        <Link href="/products" className="hover:text-brand-text">Produkte</Link>
        <span className="px-2">/</span>
        <span className="text-brand-text">{product.name}</span>
      </nav>

      <section className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <ProductMediaPanel product={product} discount={discount} />
        <ProductInfoPanel
          categoryName={category.name}
          product={product}
          segment={segment}
          quantity={quantity}
          ctaLabel={ctaVariant === 'benefit' ? 'Sicher kaufen und liefern lassen' : 'In den Warenkorb'}
          trustFirst={trustVariant === 'before_cta'}
          onQuantityChange={setQuantity}
          onAddToCart={addToCart}
        />
      </section>

      {related.length > 0 ? (
        <section className="mt-12">
          <h2 className="mb-5 text-3xl">Passende Alternativen</h2>
          <ProductGrid products={related} columns={4} />
        </section>
      ) : null}
    </main>
  )
}
