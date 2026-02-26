import { InfoPage } from '@/components/content/InfoPage'

export default function RueckgabePage() {
  return (
    <InfoPage
      title="Rückgabe"
      intro="Risikofreies Einkaufen mit transparentem Rückgabeprozess."
      sections={[
        {
          title: 'Frist',
          body: 'Artikel können innerhalb von 30 Tagen nach Erhalt zurückgegeben werden.',
        },
        {
          title: 'Ablauf',
          body: 'Kontakt aufnehmen, Rückgabe anmelden, Ware senden. Nach Prüfung erfolgt die Erstattung.',
        },
        {
          title: 'Erstattung',
          body: 'Die Rückzahlung erfolgt in der Regel über dieselbe Zahlungsart wie bei der Bestellung.',
        },
      ]}
    />
  )
}
