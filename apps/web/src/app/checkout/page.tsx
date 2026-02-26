'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import {
  CheckoutCancelledNotice,
  CheckoutStepper,
  OrderSummary,
  PaymentStep,
  ReviewStep,
  ShippingStep,
  createDefaultShippingData,
  getShippingCost,
  hasMissingShippingFields,
  buildCheckoutPayload,
  useCheckoutRetrySession,
  type CheckoutStep,
  type CheckoutSessionResponse,
  type PaymentMethod,
} from '@/features/checkout'
import { SEGMENT_LABELS, useCustomerSegmentStore } from '@/features/segment'
import { getAuthHeaders } from '@/lib/api/auth'
import { trackEvent } from '@/lib/analytics'
import { useCartStore } from '@/lib/store'

export default function CheckoutPage() {
  const { items, total } = useCartStore()
  const { segment } = useCustomerSegmentStore()
  const [step, setStep] = useState<CheckoutStep>('shipping')
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('card')
  const [shippingData, setShippingData] = useState(createDefaultShippingData)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [checkoutCancelled, setCheckoutCancelled] = useState(false)
  const [cancelledOrderID, setCancelledOrderID] = useState<string | null>(null)
  const idempotencyKeyRef = useRef<string>('')

  const shippingCost = useMemo(() => getShippingCost(total), [total])
  const grandTotal = total + shippingCost
  const retryCheckoutURL = useCheckoutRetrySession(cancelledOrderID)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    setCheckoutCancelled(params.get('cancelled') === 'true')
    setCancelledOrderID(params.get('order_id'))
  }, [])

  useEffect(() => {
    void trackEvent('begin_checkout', {
      payload: {
        item_count: items.length,
        total: grandTotal,
      },
    })
  }, [grandTotal, items.length])

  if (items.length === 0) {
    return (
      <main className="shell-container py-14 text-center">
        <h1 className="text-3xl">Dein Warenkorb ist leer</h1>
        <p className="mt-3 text-brand-text-muted">Füge zuerst Produkte hinzu und starte danach den Checkout.</p>
        <Link href="/products" className="mt-5 inline-flex">
          <Button>Produkte ansehen</Button>
        </Link>
      </main>
    )
  }

  const goBack = () => {
    if (step === 'payment') setStep('shipping')
    if (step === 'review') setStep('payment')
  }

  const goNext = async () => {
    if (step === 'shipping') {
      if (hasMissingShippingFields(shippingData)) {
        setError('Bitte fülle alle Pflichtfelder für die Lieferung aus.')
        return
      }
      setError(null)
      setStep('payment')
      await trackEvent('checkout_step_completed', { payload: { step: 'shipping' } })
      return
    }

    if (step === 'payment') {
      setStep('review')
      await trackEvent('checkout_step_completed', { payload: { step: 'payment', method: paymentMethod } })
    }
  }

  const submitCheckout = async () => {
    if (!idempotencyKeyRef.current) {
      idempotencyKeyRef.current = crypto.randomUUID()
    }
    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/checkout/session', {
        method: 'POST',
        headers: await getAuthHeaders({
          'content-type': 'application/json',
          'idempotency-key': idempotencyKeyRef.current,
        }),
        body: JSON.stringify(buildCheckoutPayload(shippingData, segment, shippingCost, items)),
      })

      if (!response.ok) {
        const parsed = await response.json().catch(() => ({ error: 'checkout_failed' }))
        throw new Error(parsed.error || 'checkout_failed')
      }

      const body = (await response.json()) as CheckoutSessionResponse
      if (!body.checkout_url) {
        throw new Error('checkout_url_missing')
      }

      await trackEvent('checkout_step_completed', {
        payload: {
          step: 'review',
          method: paymentMethod,
          order_id: body.order_id,
        },
      })

      window.location.href = body.checkout_url
    } catch (checkoutError) {
      await trackEvent('checkout_error', {
        payload: {
          step,
          message: checkoutError instanceof Error ? checkoutError.message : 'checkout_failed',
        },
      })
      setError(checkoutError instanceof Error ? checkoutError.message : 'Bestellung konnte nicht abgeschlossen werden.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="shell-container py-10">
      <header className="mb-6">
        <Link href="/cart" className="inline-flex items-center gap-1 text-sm text-brand-text-muted hover:text-brand-text">
          <ArrowLeft className="h-4 w-4" />
          Zurück zum Warenkorb
        </Link>
        <h1 className="mt-2 text-4xl">Checkout</h1>
        <p className="mt-2 text-brand-text-muted">{SEGMENT_LABELS[segment]} mit transparenten Kosten und klaren Pflichtfeldern.</p>
      </header>
      {checkoutCancelled ? (
        <CheckoutCancelledNotice
          retryCheckoutURL={retryCheckoutURL}
          onRetryReview={() => setStep('review')}
          onSupportClick={() => {
            void trackEvent('contact_support_clicked', {
              payload: { source: 'checkout_cancelled' },
            })
          }}
        />
      ) : null}

      <CheckoutStepper currentStep={step} />

      <div className="grid gap-6 lg:grid-cols-[1.45fr_0.9fr]">
        <section className="panel p-6">
          {step === 'shipping' ? <ShippingStep shippingData={shippingData} segment={segment} onChange={setShippingData} onContinue={goNext} /> : null}
          {step === 'payment' ? <PaymentStep method={paymentMethod} onMethodChange={setPaymentMethod} onBack={goBack} onContinue={goNext} /> : null}
          {step === 'review' ? <ReviewStep shippingData={shippingData} items={items} isSubmitting={loading} onBack={goBack} onSubmit={submitCheckout} /> : null}
          {error ? <p className="mt-4 rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p> : null}
        </section>

        <OrderSummary subtotal={total} shipping={shippingCost} total={grandTotal} />
      </div>
    </main>
  )
}
