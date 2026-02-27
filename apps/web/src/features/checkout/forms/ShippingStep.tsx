import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import type { ShippingData } from '@/features/checkout/types'

type ShippingStepProps = {
  shippingData: ShippingData
  segment: 'b2c' | 'b2b'
  onChange: (next: ShippingData) => void
  onContinue: () => void
}

export function ShippingStep({ shippingData, segment, onChange, onContinue }: ShippingStepProps) {
  return (
    <div className="space-y-5">
      <h2 className="text-2xl">Lieferadresse</h2>

      <div className="grid gap-4 sm:grid-cols-2">
        <Input label="Vorname" value={shippingData.firstName} onChange={(event) => onChange({ ...shippingData, firstName: event.target.value })} required />
        <Input label="Nachname" value={shippingData.lastName} onChange={(event) => onChange({ ...shippingData, lastName: event.target.value })} required />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Input label="E-Mail" type="email" value={shippingData.email} onChange={(event) => onChange({ ...shippingData, email: event.target.value })} required />
        <Input label="Telefon" value={shippingData.phone} onChange={(event) => onChange({ ...shippingData, phone: event.target.value })} />
      </div>

      <Input
        label="StraÃe und Hausnummer"
        value={shippingData.street}
        onChange={(event) => onChange({ ...shippingData, street: event.target.value })}
        required
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <Input label="PLZ" value={shippingData.zip} onChange={(event) => onChange({ ...shippingData, zip: event.target.value })} required />
        <div className="sm:col-span-2">
          <Input label="Stadt" value={shippingData.city} onChange={(event) => onChange({ ...shippingData, city: event.target.value })} required />
        </div>
      </div>

      {segment === 'b2b' ? (
        <div className="rounded-[1.3rem] border border-brand-border bg-brand-bg-muted/70 p-4">
          <h3 className="text-lg">B2B-Felder (optional)</h3>
          <div className="mt-3 grid gap-4 sm:grid-cols-2">
            <Input label="Firma" value={shippingData.companyName} onChange={(event) => onChange({ ...shippingData, companyName: event.target.value })} />
            <Input label="VAT-ID" value={shippingData.vatId} onChange={(event) => onChange({ ...shippingData, vatId: event.target.value })} />
          </div>
          <div className="mt-3">
            <Input
              label="Bestellreferenz"
              hint="z. B. interne PO-Nummer"
              value={shippingData.purchaseOrderRef}
              onChange={(event) => onChange({ ...shippingData, purchaseOrderRef: event.target.value })}
            />
          </div>
        </div>
      ) : null}

      <Button onClick={onContinue} size="lg" fullWidth>
        Weiter zur Zahlung
      </Button>
    </div>
  )
}
