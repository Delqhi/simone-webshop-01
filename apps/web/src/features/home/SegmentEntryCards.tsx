'use client'

import Link from 'next/link'
import { ArrowRight, Building2, UserRound } from 'lucide-react'
import { useCustomerSegmentStore } from '@/features/segment'
import type { CustomerSegment } from '@simone/contracts'

const ENTRIES: Array<{
  segment: CustomerSegment
  title: string
  tag: string
  description: string
  impact: string
  href: string
  icon: typeof UserRound
}> = [
  {
    segment: 'b2c',
    title: 'Für Privatkunden',
    tag: 'Direktkauf',
    description: 'Klare Preisangaben, schnelle Lieferung und unkomplizierte Retoure.',
    impact: 'Schnelle Entscheidung ohne Checkout-Reibung.',
    href: '/products?segment=b2c',
    icon: UserRound,
  },
  {
    segment: 'b2b',
    title: 'Für Unternehmen',
    tag: 'Team-Mode',
    description: 'Verfügbarkeit, VAT-Felder und strukturierter Bestellprozess für Teams.',
    impact: 'Planbare Reorder-Prozesse inklusive Angebotslogik.',
    href: '/products?segment=b2b',
    icon: Building2,
  },
]

export function SegmentEntryCards() {
  const { segment, setSegment } = useCustomerSegmentStore()

  return (
    <section className="shell-container mt-9">
      <div className="grid gap-4 md:grid-cols-2">
        {ENTRIES.map((entry) => {
          const selected = segment === entry.segment
          return (
            <article
              key={entry.segment}
              className={[
                'panel p-6 transition-all duration-200',
                selected ? 'border-brand-border-strong bg-brand-surface-strong shadow-[0_16px_30px_rgba(11,106,89,0.18)]' : 'hover:-translate-y-0.5',
              ].join(' ')}
            >
              <div className="mb-4 flex items-start justify-between gap-3">
                <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-brand-border bg-white/90">
                  <entry.icon className="h-5 w-5 text-brand-accent" />
                </div>
                <span className="trust-chip px-3 py-1 text-[0.68rem]">{entry.tag}</span>
              </div>
              <h2 className="text-2xl">{entry.title}</h2>
              <p className="mt-2 text-sm leading-6 text-brand-text-muted">{entry.description}</p>
              <p className="mt-4 rounded-xl border border-brand-border bg-white/80 px-3 py-2 text-sm font-semibold text-brand-text">
                {entry.impact}
              </p>
              <Link
                href={entry.href}
                onClick={() => setSegment(entry.segment)}
                className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-brand-accent hover:underline"
              >
                Einstieg öffnen
                <ArrowRight className="h-4 w-4" />
              </Link>
            </article>
          )
        })}
      </div>
    </section>
  )
}
