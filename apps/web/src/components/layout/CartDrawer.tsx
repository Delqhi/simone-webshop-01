'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Minus, Plus, Trash2, X } from 'lucide-react'
import { useCartStore, useUIStore } from '@/lib/store'
import { formatPrice } from '@/lib/utils'

export function CartDrawer() {
  const { items, removeItem, updateQuantity, total } = useCartStore()
  const { isCartOpen, closeCart } = useUIStore()

  if (!isCartOpen) {
    return null
  }

  return (
    <>
      <button
        type="button"
        onClick={closeCart}
        className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
        aria-label="Warenkorb schließen"
      />

      <aside className="fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col border-l border-brand-border bg-brand-surface shadow-2xl animate-fade-in">
        <header className="flex items-center justify-between border-b border-brand-border px-5 py-4">
          <h2 className="text-base font-semibold text-brand-text">Warenkorb ({items.length})</h2>
          <button
            type="button"
            onClick={closeCart}
            className="rounded-lg p-2 text-brand-text-muted transition-colors hover:bg-brand-bg-muted hover:text-brand-text"
          >
            <X className="h-5 w-5" />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto px-5 py-4">
          {items.length === 0 ? (
            <div className="panel-soft flex h-full flex-col items-center justify-center px-6 text-center">
              <p className="text-base font-semibold text-brand-text">Dein Warenkorb ist leer.</p>
              <p className="mt-2 text-sm text-brand-text-muted">Füge Produkte hinzu und starte den Checkout in wenigen Klicks.</p>
              <Link href="/products" onClick={closeCart} className="mt-5 rounded-xl border border-brand-border px-4 py-2 text-sm font-semibold text-brand-text hover:border-brand-accent hover:text-brand-accent">
                Produkte ansehen
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {items.map((item) => (
                <article key={item.id} className="panel-soft p-3">
                  <div className="flex gap-3">
                    <div className="relative h-20 w-20 overflow-hidden rounded-lg bg-brand-bg-muted">
                      <Image src={item.image} alt={item.name} fill className="object-cover" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="line-clamp-2 text-sm font-semibold text-brand-text">{item.name}</p>
                      <p className="mt-1 text-sm text-brand-accent">{formatPrice(item.price)}</p>
                      <div className="mt-2 flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.product.id, Math.max(1, item.quantity - 1))}
                          className="rounded-md border border-brand-border p-1 text-brand-text-muted hover:bg-brand-bg-muted hover:text-brand-text"
                          aria-label="Menge reduzieren"
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <span className="w-7 text-center text-sm font-medium text-brand-text">{item.quantity}</span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          className="rounded-md border border-brand-border p-1 text-brand-text-muted hover:bg-brand-bg-muted hover:text-brand-text"
                          aria-label="Menge erhöhen"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => removeItem(item.product.id)}
                          className="ml-auto rounded-md p-1 text-brand-text-muted hover:bg-red-50 hover:text-red-600"
                          aria-label="Artikel entfernen"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>

        {items.length > 0 ? (
          <footer className="border-t border-brand-border px-5 py-4">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-sm text-brand-text-muted">Zwischensumme</span>
              <span className="text-lg font-semibold text-brand-text">{formatPrice(total)}</span>
            </div>
            <Link href="/checkout" onClick={closeCart} className="cta-primary block w-full px-4 py-3 text-center text-sm font-semibold">
              Zur Kasse
            </Link>
            <Link href="/cart" onClick={closeCart} className="mt-2 block text-center text-sm font-medium text-brand-text-muted hover:text-brand-text">
              Details im Warenkorb
            </Link>
          </footer>
        ) : null}
      </aside>
    </>
  )
}
