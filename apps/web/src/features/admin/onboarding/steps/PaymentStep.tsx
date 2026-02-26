import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeftIcon, ArrowRightIcon, CheckCircleIcon, CreditCardIcon } from '@heroicons/react/24/outline'
import type { StepProps } from '@/features/admin/onboarding/types'

function ProviderCard({
  title,
  description,
  badge,
  active,
  onToggle,
}: {
  title: string
  description: string
  badge: { label: string; className: string }
  active: boolean
  onToggle: () => void
}) {
  return (
    <div
      className={[
        'panel-soft flex cursor-pointer items-center justify-between rounded-xl border-2 p-4 transition-all',
        active ? 'border-brand-accent' : 'border-brand-border',
      ].join(' ')}
      onClick={onToggle}
    >
      <div className="flex items-center gap-4">
        <div className={['flex h-12 w-12 items-center justify-center rounded-lg font-bold', badge.className].join(' ')}>{badge.label}</div>
        <div>
          <h3 className="font-semibold text-brand-text">{title}</h3>
          <p className="text-sm text-brand-text-muted">{description}</p>
        </div>
      </div>
      <div
        className={[
          'flex h-6 w-6 items-center justify-center rounded-full border-2',
          active ? 'border-brand-accent bg-brand-accent' : 'border-brand-border',
        ].join(' ')}
      >
        {active ? <CheckCircleIcon className="h-4 w-4 text-white" /> : null}
      </div>
    </div>
  )
}

export function PaymentStep({ onNext, onBack }: StepProps) {
  const [stripe, setStripe] = useState(false)
  const [paypal, setPaypal] = useState(false)
  const [klarna, setKlarna] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      className="mx-auto max-w-2xl space-y-6"
    >
      <div className="mb-8 text-center">
        <CreditCardIcon className="mx-auto mb-4 h-12 w-12 text-brand-accent" />
        <h2 className="text-3xl font-bold text-brand-text">Zahlungsanbieter</h2>
        <p className="text-brand-text-muted">Verbinde Zahlungsoptionen. Änderungen sind später jederzeit möglich.</p>
      </div>

      <div className="space-y-4">
        <ProviderCard
          title="Stripe"
          description="Kreditkarten, Apple Pay, Google Pay"
          badge={{ label: 'S', className: 'bg-[#635bff] text-white' }}
          active={stripe}
          onToggle={() => setStripe((prev) => !prev)}
        />
        <ProviderCard
          title="PayPal"
          description="PayPal-Konto und Gastzahlung"
          badge={{ label: 'P', className: 'bg-[#003087] text-white' }}
          active={paypal}
          onToggle={() => setPaypal((prev) => !prev)}
        />
        <ProviderCard
          title="Klarna"
          description="Rechnung, Ratenzahlung, Sofortüberweisung"
          badge={{ label: 'K', className: 'bg-[#ffb3c7] text-black' }}
          active={klarna}
          onToggle={() => setKlarna((prev) => !prev)}
        />
      </div>

      <p className="text-center text-sm text-brand-text-muted">💡 Du kannst Zahlungsanbieter später unter Einstellungen ergänzen.</p>

      <div className="flex justify-between">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-2 rounded-xl border border-brand-border bg-white px-6 py-3 text-brand-text-muted transition-colors hover:border-brand-accent hover:text-brand-accent"
        >
          <ArrowLeftIcon className="h-4 w-4" /> Zurück
        </button>
        <button
          type="button"
          onClick={onNext}
          className="flex items-center gap-2 rounded-xl bg-brand-accent px-6 py-3 font-semibold text-white transition-colors hover:bg-[color:var(--brand-accent-strong)]"
        >
          Weiter <ArrowRightIcon className="h-4 w-4" />
        </button>
      </div>
    </motion.div>
  )
}
