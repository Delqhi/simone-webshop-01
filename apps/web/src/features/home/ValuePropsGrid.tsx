import { BadgeCheck, Clock3, ShieldCheck, Sparkles } from 'lucide-react'

const VALUE_PROPS = [
  {
    title: 'Sofort verstandlicher Nutzen',
    description: 'Jede Produktkarte zeigt klaren Anwendungswert statt Marketingfloskeln.',
    icon: Sparkles,
  },
  {
    title: 'Lieferung planbar',
    description: 'Verfuegbarkeiten und Versandzeiten sind im Funnel sichtbar, nicht versteckt.',
    icon: Clock3,
  },
  {
    title: 'Vertrauen messbar',
    description: 'Rueckgabe, Zahlungssicherheit und Support werden in Kaufmomenten eingeblendet.',
    icon: ShieldCheck,
  },
  {
    title: 'Echte Social-Proof-Signale',
    description: 'Bewertungen und Qualitatsindikatoren werden konsistent und datenbasiert dargestellt.',
    icon: BadgeCheck,
  },
]

export function ValuePropsGrid() {
  return (
    <section className="shell-container mt-9">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {VALUE_PROPS.map((item, index) => (
          <article
            key={item.title}
            className="rounded-[1.65rem] border border-brand-border bg-white/85 p-5 shadow-[0_10px_26px_rgba(10,10,10,0.06)] transition-all duration-300 hover:-translate-y-1 hover:border-black/20 hover:shadow-[0_18px_36px_rgba(10,10,10,0.1)]"
          >
            <div className="flex items-center justify-between gap-3">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-brand-border bg-brand-bg-muted/80">
                <item.icon className="h-5 w-5 text-brand-text" />
              </span>
              <span className="inline-flex h-7 min-w-[1.75rem] items-center justify-center rounded-full border border-brand-border bg-white px-2 text-[0.68rem] font-bold tracking-[0.08em] text-brand-text-muted">
                {String(index + 1).padStart(2, '0')}
              </span>
            </div>
            <h3 className="mt-4 text-xl font-semibold text-brand-text">{item.title}</h3>
            <p className="mt-2 text-sm leading-7 text-brand-text-muted">{item.description}</p>
          </article>
        ))}
      </div>
    </section>
  )
}
