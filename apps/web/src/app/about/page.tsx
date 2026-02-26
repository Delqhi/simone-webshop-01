import { InfoPage } from '@/components/content/InfoPage'

export default function AboutPage() {
  return (
    <InfoPage
      title="Über Simone Shop"
      intro="Wir bauen einen transparenten, vertrauensbasierten Commerce-Flow für Privat- und Geschäftskunden im DACH-Raum."
      sections={[
        {
          title: 'Mission',
          body: 'Kundennutzen zuerst: Produkte schnell verstehen, sicher entscheiden und ohne Überraschungen kaufen.',
        },
        {
          title: 'Ansatz',
          body: 'Trust-first UX, klare Kostenkommunikation und eine skalierbare Micro-Commerce-Architektur.',
        },
      ]}
    />
  )
}
