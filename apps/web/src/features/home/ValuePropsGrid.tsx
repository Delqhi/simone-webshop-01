import { BadgeCheck, Clock3, ShieldCheck, Sparkles } from 'lucide-react'

const VALUE_PROPS = [
  {
    title: 'Sofort verständlicher Nutzen',
    description: 'Jede Produktkarte zeigt klaren Anwendungswert statt Marketingfloskeln.',
    icon: Sparkles,
  },
  {
    title: 'Lieferung planbar',
    description: 'Verfügbarkeiten und Versandzeiten sind im Funnel sichtbar, nicht versteckt.',
    icon: Clock3,
  },
  {
    title: 'Vertrauen messbar',
    description: 'Rückgabe, Zahlungssicherheit und Support werden in Kaufmomenten eingeblendet.',
    icon: ShieldCheck,
  },
  {
    title: 'Echte Social Proof Signale',
    description: 'Bewertungen und Qualitätsindikatoren werden konsistent und datenbasiert dargestellt.',
    icon: BadgeCheck,
  },
]

export function ValuePropsGrid() {
  return (
    <section className="shell-container mt-8">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {VALUE_PROPS.map((item, index) => (
          <article key={item.title} className="panel-soft p-5 transition-transform duration-200 hover:-translate-y-1">
            <div className="flex items-start justify-between gap-3">
              <item.icon className="h-5 w-5 text-brand-accent" />
              <span className="text-xs font-semibold text-brand-text-muted">0{index + 1}</span>
            </div>
            <h3 className="mt-3 text-lg font-semibold text-brand-text">{item.title}</h3>
            <p className="mt-2 text-sm leading-6 text-brand-text-muted">{item.description}</p>
          </article>
        ))}
      </div>
    </section>
  )
}
