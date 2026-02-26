import Image from 'next/image'
import { Button } from '@/components/ui/Button'
import type { CartItem } from '@/types'
import type { ShippingData } from '@/features/checkout/types'
import { formatPrice } from '@/lib/utils'

type ReviewStepProps = {
  shippingData: ShippingData
  items: CartItem[]
  isSubmitting: boolean
  onBack: () => void
  onSubmit: () => void
}

export function ReviewStep({ shippingData, items, isSubmitting, onBack, onSubmit }: ReviewStepProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl">Bestellung prüfen</h2>

      <div className="panel-soft p-4 text-sm text-brand-text-muted">
        <p className="font-semibold text-brand-text">Lieferung an</p>
        <p>
          {shippingData.firstName} {shippingData.lastName}
          <br />
          {shippingData.street}
          <br />
          {shippingData.zip} {shippingData.city}
        </p>
      </div>

      <div className="space-y-3">
        {items.map((item) => (
          <article key={item.id} className="flex items-center gap-3">
            <div className="relative h-12 w-12 overflow-hidden rounded-lg bg-brand-bg-muted">
              <Image src={item.image} alt={item.name} fill className="object-cover" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="line-clamp-1 text-sm font-semibold text-brand-text">{item.name}</p>
              <p className="text-xs text-brand-text-muted">Menge: {item.quantity}</p>
            </div>
            <p className="text-sm font-semibold text-brand-text">{formatPrice(item.price * item.quantity)}</p>
          </article>
        ))}
      </div>

      <div className="flex gap-3">
        <Button variant="outline" onClick={onBack} fullWidth>
          Zurück
        </Button>
        <Button onClick={onSubmit} isLoading={isSubmitting} fullWidth>
          Zahlungspflichtig bestellen
        </Button>
      </div>
    </div>
  )
}
