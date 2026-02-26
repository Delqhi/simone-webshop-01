import { useEffect, useState } from 'react'

export function useCheckoutRetrySession(orderID: string | null) {
  const [retryCheckoutURL, setRetryCheckoutURL] = useState<string | null>(null)

  useEffect(() => {
    if (!orderID) {
      setRetryCheckoutURL(null)
      return
    }

    let active = true
    const run = async () => {
      try {
        const response = await fetch(`/api/checkout/session-status?order_id=${encodeURIComponent(orderID)}`, {
          method: 'GET',
          cache: 'no-store',
        })
        if (!response.ok) {
          return
        }
        const payload = (await response.json()) as { checkout_url?: string; payment_state?: string }
        if (!active || payload.payment_state === 'paid') {
          return
        }
        if (payload.checkout_url) {
          setRetryCheckoutURL(payload.checkout_url)
        }
      } catch {
        setRetryCheckoutURL(null)
      }
    }

    void run()
    return () => {
      active = false
    }
  }, [orderID])

  return retryCheckoutURL
}
