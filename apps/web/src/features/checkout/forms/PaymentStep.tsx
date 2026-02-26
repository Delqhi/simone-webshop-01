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
    <div className="space-y-4">
      <h2 className="text-2xl">Zahlungsmethode</h2>

      {PAYMENT_METHODS.map((entry) => (
        <label key={entry.id} className="panel-soft flex cursor-pointer items-center justify-between gap-3 p-4">
          <span>
            <span className="block text-sm font-semibold text-brand-text">{entry.label}</span>
            <span className="text-sm text-brand-text-muted">{entry.info}</span>
          </span>
          <input
            type="radio"
            checked={method === entry.id}
            onChange={() => onMethodChange(entry.id)}
          />
        </label>
      ))}
      <p className="text-xs text-brand-text-muted">Weitere Zahlungsarten folgen nach dem ersten Live-Rollout.</p>

      <div className="flex gap-3">
        <Button variant="outline" onClick={onBack} fullWidth>
          Zurück
        </Button>
        <Button onClick={onContinue} fullWidth>
          Weiter zur Prüfung
        </Button>
      </div>
    </div>
  )
}
