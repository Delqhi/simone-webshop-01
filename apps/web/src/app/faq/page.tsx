import { InfoPage } from '@/components/content/InfoPage'

export default function FaqPage() {
  return (
    <InfoPage
      title="Häufige Fragen"
      intro="Die wichtigsten Antworten zu Bestellung, Lieferung, Rückgabe und B2B-Abwicklung."
      sections={[
        {
          title: 'Wann wird versendet?',
          body: 'Verfügbare Artikel werden in der Regel innerhalb von 24-48 Stunden versandt.',
        },
        {
          title: 'Kann ich als Unternehmen bestellen?',
          body: 'Ja. Im Checkout stehen optionale Felder für Firma, VAT-ID und Bestellreferenz bereit.',
        },
        {
          title: 'Wie funktioniert die Rückgabe?',
          body: 'Rückgaben sind innerhalb von 30 Tagen möglich. Details findest du auf der Rückgabeseite.',
        },
      ]}
    />
  )
}
