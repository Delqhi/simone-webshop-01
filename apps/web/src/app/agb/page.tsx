import { InfoPage } from '@/components/content/InfoPage'

export default function AgbPage() {
  return (
    <InfoPage
      title="AGB"
      intro="Allgemeine Geschäftsbedingungen für Bestellungen bei Simone Shop."
      sections={[
        {
          title: 'Geltungsbereich',
          body: 'Diese Bedingungen gelten für alle Bestellungen über unseren Online-Shop.',
        },
        {
          title: 'Vertragsschluss',
          body: 'Der Vertrag kommt durch Annahme deiner Bestellung durch uns zustande.',
        },
        {
          title: 'Preise und Zahlung',
          body: 'Alle Preise werden transparent im Checkout dargestellt. Versteckte Gebühren gibt es nicht.',
        },
      ]}
    />
  )
}
