import Link from 'next/link'
import { Button } from '@/components/ui/Button'

type CheckoutCancelledNoticeProps = {
  retryCheckoutURL: string | null
  onRetryReview: () => void
  onSupportClick: () => void
}

export function CheckoutCancelledNotice({
  retryCheckoutURL,
  onRetryReview,
  onSupportClick,
}: CheckoutCancelledNoticeProps) {
  return (
    <section className="mb-6 rounded-2xl border border-amber-300 bg-amber-50 p-4">
      <p className="text-sm font-semibold text-amber-900">Zahlung abgebrochen, deine Bestellung wurde noch nicht abgeschlossen.</p>
      <p className="mt-1 text-sm text-amber-800">Du kannst jetzt direkt erneut zahlen oder zuerst deinen Warenkorb prüfen.</p>
      <div className="mt-3 flex flex-wrap gap-2">
        {retryCheckoutURL ? (
          <a href={retryCheckoutURL}>
            <Button size="sm">Erneut zahlen</Button>
          </a>
        ) : (
          <Button size="sm" onClick={onRetryReview}>
            Erneut zur Zahlungsprüfung
          </Button>
        )}
        <Link href="/cart">
          <Button size="sm" variant="outline">
            Warenkorb prüfen
          </Button>
        </Link>
        <Link href="/kontakt" onClick={onSupportClick}>
          <Button size="sm" variant="ghost">
            Support
          </Button>
        </Link>
      </div>
    </section>
  )
}
