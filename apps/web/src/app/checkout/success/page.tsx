'use client'

import Link from 'next/link'
import { CheckCircle2, LifeBuoy } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import {
  CHECKOUT_SUCCESS_CONTENT,
  CHECKOUT_SUCCESS_STEPS,
  useCheckoutSuccessState,
} from '@/features/checkout'
import { trackEvent } from '@/lib/analytics'

export default function CheckoutSuccessPage() {
  const { orderId, sessionId, paymentState, sessionStatus } = useCheckoutSuccessState()
  const content = CHECKOUT_SUCCESS_CONTENT[paymentState]

  return (
    <main className="shell-container py-14">
      <section className="panel mx-auto max-w-3xl px-6 py-10 text-center md:px-10">
        <div className="mx-auto inline-flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-700">
          <CheckCircle2 className="h-9 w-9" />
        </div>
        <h1 className="mt-5 text-4xl">{content.heading}</h1>
        <p className="mt-3 text-brand-text-muted">{content.description}</p>
        {orderId ? (
          <p className="mt-4 inline-flex rounded-full bg-brand-bg-muted px-3 py-1 text-xs font-semibold text-brand-text-muted">
            Bestellnummer: {orderId}
          </p>
        ) : null}
        {sessionId ? (
          <p className="mt-2 text-xs text-brand-text-muted">Stripe Session: {sessionId}</p>
        ) : null}
        {sessionStatus ? (
          <p className="mt-1 text-xs text-brand-text-muted">
            Payment: {sessionStatus.payment_status} · Order: {sessionStatus.order_status}
          </p>
        ) : null}

        {paymentState === 'paid' ? (
          <div className="mt-8 space-y-3 text-left">
            {CHECKOUT_SUCCESS_STEPS.map((step) => (
              <article key={step.title} className="panel-soft flex items-start gap-3 p-4">
                <step.icon className="mt-0.5 h-5 w-5 text-brand-accent" />
                <div>
                  <h2 className="text-base font-semibold text-brand-text">{step.title}</h2>
                  <p className="text-sm text-brand-text-muted">{step.description}</p>
                </div>
              </article>
            ))}
          </div>
        ) : null}

        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link href={paymentState === 'paid' ? '/products' : '/checkout'}>
            <Button variant="outline">Weiter einkaufen</Button>
          </Link>
          {paymentState === 'pending' ? (
            <Button onClick={() => window.location.reload()}>Status aktualisieren</Button>
          ) : null}
          {paymentState === 'failed' ? (
            <Link href={`/checkout?cancelled=true${orderId ? `&order_id=${encodeURIComponent(orderId)}` : ''}`}>
              <Button>Erneut zahlen</Button>
            </Link>
          ) : null}
          {paymentState === 'paid' ? (
            <Link href="/account">
              <Button>Zum Konto</Button>
            </Link>
          ) : null}
          <Link
            href="/kontakt"
            onClick={() => {
              void trackEvent('contact_support_clicked', {
                payload: {
                  source: 'checkout_success',
                },
              })
            }}
          >
            <Button variant="ghost" leftIcon={<LifeBuoy className="h-4 w-4" />}>
              Support kontaktieren
            </Button>
          </Link>
        </div>
      </section>
    </main>
  )
}
