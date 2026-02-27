import { Button } from '@/components/ui/Button'
import { PAYMENT_METHODS } from '@/features/checkout/constants'
import type { PaymentMethod } from '@/features/checkout/types'

type PaymentStepProps = {
  method: PaymentMethod
  onMethodChange: (method: PaymentMethod) => void
  onBack: () => void
  onContinue: () => void
}

export function PaymentStep({ method, onMethodChange, onBack, onContinue }: PaymentStepProps) {
  return (
    <div className="space-y-5">
      <h2 className="text-2xl">Zahlungsmethode</h2>

      {PAYMENT_METHODS.map((entry) => {
        const selected = method === entry.id
        return (
          <label
            key={entry.id}
            className={[
              'flex cursor-pointer items-center justify-between gap-3 rounded-2xl border p-4 transition-colors',
              selected ? 'border-black bg-black text-white' : 'border-brand-border bg-white/85 text-brand-text',
            ].join(' ')}
          >
            <span>
              <span className="block text-sm font-semibold">{entry.label}</span>
              <span className={['text-sm', selected ? 'text-white/75' : 'text-brand-text-muted'].join(' ')}>{entry.info}</span>
            </span>
            <input type="radio" checked={selected} onChange={() => onMethodChange(entry.id)} />
          </label>
        )
      })}

      <p className="text-xs text-brand-text-muted">Weitere Zahlungsarten folgen nach dem ersten Live-Rollout.</p>

      <div className="flex gap-3">
        <Button variant="outline" onClick={onBack} fullWidth>
          Zurueck
        </Button>
        <Button onClick={onContinue} fullWidth>
          Weiter zur Pruefung
        </Button>
      </div>
    </div>
  )
}
