import Link from 'next/link'
import { Building2, Clock3, Mail, ShieldCheck, Truck, Undo2 } from 'lucide-react'

const FOOTER_GROUPS = [
  {
    title: 'Shop',
    links: [
      { label: 'Alle Produkte', href: '/products' },
      { label: 'Für Privatkunden', href: '/products?segment=b2c' },
      { label: 'Für Unternehmen', href: '/products?segment=b2b' },
      { label: 'Warenkorb', href: '/cart' },
    ],
  },
  {
    title: 'Service',
    links: [
      { label: 'Kontakt', href: '/kontakt' },
      { label: 'FAQ', href: '/faq' },
      { label: 'Versand', href: '/versand' },
      { label: 'Rückgabe', href: '/rueckgabe' },
    ],
  },
  {
    title: 'Rechtliches',
    links: [
      { label: 'Impressum', href: '/impressum' },
      { label: 'Datenschutz', href: '/datenschutz' },
      { label: 'AGB', href: '/agb' },
      { label: 'Widerruf', href: '/widerrufsrecht' },
    ],
  },
]

const TRUST_FACTS = [
  { icon: ShieldCheck, text: 'SSL-gesicherte Zahlung' },
  { icon: Truck, text: 'Schneller Versand in DACH' },
  { icon: Undo2, text: '30 Tage Rückgabe ohne Hürden' },
]

const SERVICE_SIGNALS = [
  { icon: Mail, title: 'Support', text: 'info@um-24.de' },
  { icon: Clock3, title: 'Antwortzeit', text: 'innerhalb von 24h' },
  { icon: Building2, title: 'B2B-Service', text: 'Angebot, VAT und PO möglich' },
]

export function Footer() {
  return (
    <footer className="mt-20 border-t border-brand-border bg-brand-surface/90">
      <div className="shell-container py-12">
        <div className="grid gap-9 md:grid-cols-5">
          <section className="md:col-span-2">
            <Link href="/" className="inline-flex items-center gap-2">
              <span className="leading-none">
                <span className="block text-xl font-bold tracking-tight text-brand-text">Simone Shop</span>
                <span className="block text-[0.66rem] uppercase tracking-[0.22em] text-brand-text-muted">Premium Commerce</span>
              </span>
            </Link>
            <p className="mt-4 max-w-md text-sm leading-6 text-brand-text-muted">
              Premium Commerce für Privat- und Geschäftskunden mit klaren Preisen, verlässlicher Lieferung und schneller Hilfe im Problemfall.
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              {TRUST_FACTS.map((fact) => (
                <p key={fact.text} className="inline-flex items-center gap-2 rounded-full border border-brand-border bg-white/90 px-3 py-1.5 text-xs font-semibold text-brand-text">
                  <fact.icon className="h-4 w-4 text-brand-text" />
                  <span>{fact.text}</span>
                </p>
              ))}
            </div>
            <div className="mt-5 grid gap-2">
              {SERVICE_SIGNALS.map((signal) => (
                <div key={signal.title} className="rounded-xl border border-brand-border bg-white/90 px-3 py-2 text-sm">
                  <p className="flex items-center gap-2 font-semibold text-brand-text">
                    <signal.icon className="h-4 w-4 text-brand-text" />
                    {signal.title}
                  </p>
                  <p className="mt-1 text-brand-text-muted">{signal.text}</p>
                </div>
              ))}
            </div>
          </section>

          {FOOTER_GROUPS.map((group) => (
            <section key={group.title}>
              <h3 className="section-eyebrow text-brand-text">{group.title}</h3>
              <ul className="mt-3 space-y-2">
                {group.links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-sm text-brand-text-muted transition-colors hover:text-brand-text">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>

        <div className="mt-9 flex flex-col gap-2 border-t border-brand-border pt-6 text-sm text-brand-text-muted md:flex-row md:items-center md:justify-between">
          <p>© 2026 Simone Shop. Alle Rechte vorbehalten.</p>
          <p>DACH Commerce in EUR, transparent und kundenfreundlich.</p>
        </div>
      </div>
    </footer>
  )
}
