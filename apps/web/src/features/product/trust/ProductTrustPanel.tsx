import { CHECKOUT_TRUST_SIGNALS, TrustPanel } from '@/features/trust'

export function ProductTrustPanel() {
  return <TrustPanel title="Warum hier bestellen" signals={CHECKOUT_TRUST_SIGNALS} compact />
}
