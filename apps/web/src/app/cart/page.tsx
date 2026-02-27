'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, ArrowRight, Minus, Plus, ShieldCheck, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { PromotionBannerStrip } from '@/features/promotions'
import { CHECKOUT_TRUST_SIGNALS, TrustPanel } from '@/features/trust'
import { useCustomerSegmentStore } from '@/features/segment/store'
import { trackEvent } from '@/lib/analytics'
import { useCartStore } from '@/lib/store'
import { formatPrice } from '@/lib/utils'

const FREE_SHIPPING_THRESHOLD = 50
const STANDARD_SHIPPING = 4.99

export default function CartPage() {
  const { items, total, itemCount, clearCart, removeItem, updateQuantity } = useCartStore()
  const { segment } = useCustomerSegmentStore()
  const shippingCost = total >= FREE_SHIPPING_THRESHOLD ? 0 : STANDARD_SHIPPING
  const grandTotal = total + shippingCost

  if (items.length === 0) {
    return (
      <main className="shell-container py-12">
        <section className="rounded-[2rem] border border-brand-border bg-white/85 px-8 py-16 text-center">
          <h1 className="text-4xl">Dein Warenkorb ist leer</h1>
          <p className="mx-auto mt-3 max-w-xl text-brand-text-muted">
            Fuge Produkte hinzu und starte danach direkt einen klaren, sicheren Checkout.
          </p>
          <Link href="/products" className="mt-6 inline-flex">
            <Button leftIcon={<ArrowLeft className="h-4 w-4" />}>Zum Sortiment</Button>
          </Link>
        </section>
      </main>
    )
  }

  return (
    <main className="shell-container py-10">
      <header className="mb-6 rounded-[1.8rem] border border-brand-border bg-gradient-to-br from-stone-50 via-white to-stone-100 p-6">
        <h1 className="text-4xl md:text-5xl">Warenkorb</h1>
        <p className="mt-2 text-brand-text-muted">
          {itemCount} Artikel, transparente Gesamtkosten vor dem Checkout.
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-[1.5fr_0.82fr]">
        <section className="space-y-4">
          {items.map((item) => (
            <article key={item.id} className="rounded-[1.4rem] border border-brand-border bg-white/85 p-4">
              <div className="flex gap-4">
                <div className="relative h-24 w-24 overflow-hidden rounded-2xl bg-brand-bg-muted">
                  <Image src={item.image} alt={item.name} fill className="object-cover" />
                </div>
                <div className="min-w-0 flex-1">
                  <Link href={`/products/${item.product.id}`} className="line-clamp-2 text-base font-semibold text-brand-text hover:text-black">
                    {item.name}
                  </Link>
                  <p className="mt-1 text-sm text-brand-text-muted">Einzelpreis: {formatPrice(item.price)}</p>
                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    <div className="inline-flex items-center rounded-full border border-brand-border bg-white p-1">
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.product.id, Math.max(1, item.quantity - 1))}
                        className="inline-flex h-8 w-8 items-center justify-center rounded-full text-brand-text-muted hover:bg-brand-bg-muted"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="w-8 text-center text-sm font-semibold text-brand-text">{item.quantity}</span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                        className="inline-flex h-8 w-8 items-center justify-center rounded-full text-brand-text-muted hover:bg-brand-bg-muted"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeItem(item.product.id)}
                      className="inline-flex h-8 w-8 items-center justify-center rounded-full text-brand-text-muted hover:bg-red-50 hover:text-red-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                <p className="text-right text-base font-semibold text-brand-text">{formatPrice(item.price * item.quantity)}</p>
              </div>
            </article>
          ))}

          <div className="flex justify-end">
            <button
              type="button"
              onClick={clearCart}
              className="rounded-full border border-brand-border px-4 py-2 text-sm font-medium text-brand-text-muted hover:border-black hover:text-black"
            >
              Warenkorb leeren
            </button>
          </div>

          <TrustPanel title="Sicherer Einkauf" signals={CHECKOUT_TRUST_SIGNALS} compact />
        </section>

        <aside className="sticky top-24 h-fit rounded-[1.7rem] border border-brand-border bg-white/90 p-5 shadow-[0_12px_30px_rgba(10,10,10,0.08)]">
          <h2 className="text-2xl">Bestellubersicht</h2>
          <dl className="mt-4 space-y-3 text-sm">
            <div className="flex items-center justify-between">
              <dt className="text-brand-text-muted">Zwischensumme</dt>
              <dd className="font-medium text-brand-text">{formatPrice(total)}</dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-brand-text-muted">Versand</dt>
              <dd className="font-medium text-brand-text">{shippingCost === 0 ? 'Kostenlos' : formatPrice(shippingCost)}</dd>
            </div>
            <div className="border-t border-brand-border pt-3">
              <div className="flex items-center justify-between text-base">
                <dt className="font-semibold text-brand-text">Gesamt</dt>
                <dd className="font-semibold text-brand-text">{formatPrice(grandTotal)}</dd>
              </div>
              <p className="mt-1 text-xs text-brand-text-muted">inkl. MwSt., keine versteckten Gebuehren</p>
            </div>
          </dl>

          {shippingCost > 0 ? (
            <p className="mt-4 rounded-2xl bg-brand-bg-muted px-3 py-2 text-xs text-brand-text-muted">
              Noch {formatPrice(FREE_SHIPPING_THRESHOLD - total)} bis zum kostenlosen Versand.
            </p>
          ) : null}

          <PromotionBannerStrip placement="cart" segment={segment} className="mt-4 block" />

          <Link
            href="/checkout"
            onClick={() => {
              void trackEvent('begin_checkout', {
                payload: {
                  item_count: itemCount,
                  total: grandTotal,
                },
              })
            }}
            className="mt-5 block"
          >
            <Button fullWidth size="lg" rightIcon={<ArrowRight className="h-4 w-4" />}>
              Sicher zur Kasse
            </Button>
          </Link>

          <p className="mt-3 inline-flex items-center gap-1 text-xs text-brand-text-muted">
            <ShieldCheck className="h-3.5 w-3.5 text-brand-text" />
            SSL-gesicherte Verarbeitung
          </p>
        </aside>
      </div>
    </main>
  )
}
