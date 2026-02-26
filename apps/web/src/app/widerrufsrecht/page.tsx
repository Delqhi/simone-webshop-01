import { InfoPage } from '@/components/content/InfoPage'

export default function WiderrufsrechtPage() {
  return (
    <InfoPage
      title="Widerrufsrecht"
      intro="Hinweise zum gesetzlichen Widerrufsrecht für Verbraucher."
      sections={[
        {
          title: 'Widerrufsfrist',
          body: 'Die Frist beträgt 14 Tage ab Erhalt der Ware, sofern keine gesetzlichen Ausnahmen greifen.',
        },
        {
          title: 'Ausübung',
          body: 'Der Widerruf kann per E-Mail erklärt werden. Anschließend erhältst du die Rücksendeanweisungen.',
        },
        {
          title: 'Folgen',
          body: 'Nach Eingang und Prüfung der Ware erfolgt die Rückerstattung über die ursprüngliche Zahlungsart.',
        },
      ]}
    />
  )
}
