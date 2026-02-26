import { InfoPage } from '@/components/content/InfoPage'

export default function ImpressumPage() {
  return (
    <InfoPage
      title="Impressum"
      intro="Pflichtangaben gemäß § 5 TMG."
      sections={[
        {
          title: 'Anbieter',
          body: (
            <>
              Simone Shop GmbH
              <br />
              Musterstraße 1
              <br />
              10115 Berlin
            </>
          ),
        },
        {
          title: 'Kontakt',
          body: (
            <>
              E-Mail: legal@simone-shop.de
              <br />
              Telefon: +49 30 1234567
            </>
          ),
        },
      ]}
    />
  )
}
