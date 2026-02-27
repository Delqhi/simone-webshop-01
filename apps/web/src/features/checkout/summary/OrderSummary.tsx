import { ShieldCheck } from 'lucide-react'
import { TrustPanel } from '@/features/trust'
import { CHECKOUT_TRUST_SIGNALS } from '@/features/trust/signals'
import { formatPrice } from '@/lib/utils'

type OrderSummaryProps = {
  subtotal: number
  shipping: number
  total: number
}

export function OrderSummary({ subtotal, shipping, total }: OrderSummaryProps) {
  return (
    <aside className="space-y-4">
      <section className="rounded-[1.7rem] border border-brand-border bg-white/90 p-5 shadow-[0_10px_26px_rgba(10,10,10,0.07)]">
        <h2 className="text-xl">Bestellubersicht</h2>
        <div className="mt-4 space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-brand-text-muted">Zwischensumme</span>
            <span className="text-brand-text">{formatPrice(subtotal)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-brand-text-muted">Versand</span>
            <span className="text-brand-text">{shipping === 0 ? 'Kostenlos' : formatPrice(shipping)}</span>
          </div>
          <div className="mt-2 border-t border-brand-border pt-2 text-base font-semibold">
            <div className="flex justify-between">
              <span className="text-brand-text">Gesamt</span>
              <span className="text-brand-text">{formatPrice(total)}</span>
            </div>
          </div>
        </div>
        <p className="mt-3 inline-flex items-center gap-1 text-xs text-brand-text-muted">
          <ShieldCheck className="h-3.5 w-3.5 text-brand-text" />
          Keine versteckten Zusatzkosten
        </p>
      </section>

      <TrustPanel title="Checkout-Sicherheit" signals={CHECKOUT_TRUST_SIGNALS} compact />
    </aside>
  )
}
