import { InfoPage } from '@/components/content/InfoPage'

export default function VersandPage() {
  return (
    <InfoPage
      title="Versand & Lieferung"
      intro="Lieferung transparent geplant: klare Kosten, klare Zeitfenster, kein Überraschungszuschlag im Checkout."
      sections={[
        {
          title: 'Liefergebiet',
          body: 'Wir liefern aktuell primär innerhalb Deutschlands sowie in ausgewählte DACH-Zielregionen.',
        },
        {
          title: 'Versandkosten',
          body: 'Standardversand 4,99 EUR. Ab 50 EUR Warenwert erfolgt die Lieferung kostenfrei.',
        },
        {
          title: 'Lieferdauer',
          body: 'Standard: 2-4 Werktage. Bei hoher Nachfrage kann sich die Lieferzeit verlängern.',
        },
      ]}
    />
  )
}
