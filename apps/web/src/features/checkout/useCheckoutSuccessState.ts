import { useEffect, useState } from 'react'
import { trackEvent } from '@/lib/analytics'
import { useCartStore } from '@/lib/store'

export type PaymentState = 'loading' | 'paid' | 'pending' | 'failed' | 'error'

export type CheckoutSessionStatus = {
  order_id: string
  stripe_session_id: string
  payment_state: 'pending' | 'paid' | 'failed'
  payment_status: string
  order_status: string
}

type CheckoutSuccessState = {
  orderId: string | null
  sessionId: string | null
  paymentState: PaymentState
  sessionStatus: CheckoutSessionStatus | null
}

export function useCheckoutSuccessState(): CheckoutSuccessState {
  const [orderId, setOrderId] = useState<string | null>(null)
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [paymentState, setPaymentState] = useState<PaymentState>('loading')
  const [sessionStatus, setSessionStatus] = useState<CheckoutSessionStatus | null>(null)
  const { clearCart } = useCartStore()

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    setOrderId(params.get('order_id'))
    setSessionId(params.get('session_id'))
  }, [])

  useEffect(() => {
    if (!orderId && !sessionId) {
      setPaymentState('error')
      return
    }

    let active = true
    const run = async () => {
      setPaymentState('loading')
      try {
        const query = new URLSearchParams()
        if (sessionId) {
          query.set('session_id', sessionId)
        }
        if (orderId) {
          query.set('order_id', orderId)
        }

        const response = await fetch(`/api/checkout/session-status?${query.toString()}`, {
          method: 'GET',
          cache: 'no-store',
        })
        if (!active) {
          return
        }
        if (!response.ok) {
          setPaymentState('error')
          return
        }

        const status = (await response.json()) as CheckoutSessionStatus
        setSessionStatus(status)
        setPaymentState(status.payment_state)
      } catch {
        if (active) {
          setPaymentState('error')
        }
      }
    }

    void run()
    return () => {
      active = false
    }
  }, [orderId, sessionId])

  useEffect(() => {
    if (paymentState !== 'paid') {
      return
    }
    clearCart()
  }, [clearCart, paymentState])

  useEffect(() => {
    if (!orderId || paymentState !== 'paid') return
    const dedupeKey = `purchase:${sessionId || orderId}`
    if (typeof window !== 'undefined' && window.sessionStorage.getItem(dedupeKey)) {
      return
    }
    void trackEvent('purchase', {
      payload: {
        order_id: orderId,
        session_id: sessionId || undefined,
      },
    })
    if (typeof window !== 'undefined') {
      window.sessionStorage.setItem(dedupeKey, '1')
    }
  }, [orderId, paymentState, sessionId])

  return { orderId, sessionId, paymentState, sessionStatus }
}
