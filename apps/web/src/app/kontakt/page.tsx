import { InfoPage } from '@/components/content/InfoPage'

export default function KontaktPage() {
  return (
    <InfoPage
      title="Kontakt"
      intro="Wir antworten schnell und transparent zu Lieferzeiten, Produkten und Bestellungen."
      sections={[
        {
          title: 'Kundenservice',
          body: (
            <>
              E-Mail: support@simone-shop.de
              <br />
              Antwortzeit: meist innerhalb von 24 Stunden
            </>
          ),
        },
        {
          title: 'B2B-Anfragen',
          body: 'Für Mengenpreise, Lieferabsprachen und Beschaffung: b2b@simone-shop.de',
        },
      ]}
    />
  )
}
