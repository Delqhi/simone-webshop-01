import { PackageCheck, Repeat2, Truck } from 'lucide-react'
import type { PaymentState } from './useCheckoutSuccessState'

export const CHECKOUT_SUCCESS_CONTENT: Record<PaymentState, { heading: string; description: string }> = {
  loading: {
    heading: 'Zahlung wird geprüft',
    description: 'Wir validieren den Zahlungsstatus mit Stripe und unserem Backend.',
  },
  paid: {
    heading: 'Danke, Bestellung erfolgreich',
    description: 'Dein Auftrag wurde eingereicht. Wir halten dich bei jedem Schritt transparent auf dem Laufenden.',
  },
  pending: {
    heading: 'Zahlung noch in Prüfung',
    description: 'Wir haben deine Bestellung erhalten, die Zahlungsbestätigung steht noch aus.',
  },
  failed: {
    heading: 'Zahlung fehlgeschlagen',
    description: 'Die Zahlung konnte nicht bestätigt werden. Bitte starte den Checkout erneut.',
  },
  error: {
    heading: 'Status aktuell nicht verfügbar',
    description: 'Bitte aktualisiere diese Seite oder kontaktiere den Support mit deiner Bestellnummer.',
  },
}

export const CHECKOUT_SUCCESS_STEPS = [
  {
    icon: PackageCheck,
    title: 'Bestellung bestätigt',
    description: 'Deine Bestellung wurde verarbeitet und in die Fulfillment-Pipeline übergeben.',
  },
  {
    icon: Truck,
    title: 'Versandstatus folgt',
    description: 'Sobald der Versand startet, erhältst du ein Tracking-Update per E-Mail.',
  },
  {
    icon: Repeat2,
    title: 'Schnell nachbestellen',
    description: 'Im Konto findest du alle Positionen für eine schnelle Wiederbestellung.',
  },
] as const
