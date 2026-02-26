'use client'

import Link from 'next/link'
import { ArrowRight, Building2, Clock3, ShieldCheck, ShoppingBag } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { SEGMENT_COPY, SEGMENT_LABELS } from '@/features/segment'
import type { CustomerSegment } from '@simone/contracts'

type HeroSectionProps = {
  segment: CustomerSegment
  variant?: 'control' | 'trust'
}

export function HeroSection({ segment, variant = 'control' }: HeroSectionProps) {
  const copy = SEGMENT_COPY[segment]
  const title = variant === 'trust' ? `${copy.heroTitle} Ohne versteckte Risiken.` : copy.heroTitle
  const subtitle =
    variant === 'trust'
      ? `${copy.heroSubtitle} Klare Liefer- und Rückgaberegeln sind von Anfang an sichtbar.`
      : copy.heroSubtitle
  const primaryCta = variant === 'trust' ? 'Sicher starten' : copy.primaryCta
  const stats = [
    { label: 'Checkout-Schritte', value: '3', icon: ShoppingBag },
    { label: 'Support-Zielzeit', value: '< 24h', icon: Clock3 },
    { label: 'Risikofreie Retoure', value: '30 Tage', icon: ShieldCheck },
  ]

  return (
    <section className="shell-container pt-8 md:pt-12">
      <div className="panel-elevated hero-grid-overlay overflow-hidden px-6 py-9 md:px-10 md:py-11">
        <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
          <div className="stagger-enter">
            <p className="kicker-badge">{copy.heroKicker}</p>
            <h1 className="mt-4 max-w-3xl text-4xl leading-tight md:text-6xl">{title}</h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-brand-text-muted md:text-lg">{subtitle}</p>
            <div className="mt-5 flex flex-wrap gap-2">
              {copy.trustFocus.slice(0, 2).map((entry) => (
                <span key={entry} className="trust-chip px-3 py-1.5 text-xs">
                  {entry}
                </span>
              ))}
            </div>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Link href="/products">
                <Button size="lg" rightIcon={<ArrowRight className="h-4 w-4" />}>
                  {primaryCta}
                </Button>
              </Link>
              <Link href={segment === 'b2b' ? '/versand' : '/rueckgabe'}>
                <Button size="lg" variant="outline">
                  {copy.secondaryCta}
                </Button>
              </Link>
            </div>
            <div className="mt-7 grid gap-3 sm:grid-cols-3">
              {stats.map((item, index) => (
                <div
                  key={item.label}
                  data-delay={String(index + 1)}
                  className="stagger-enter rounded-2xl border border-brand-border bg-white/70 px-3 py-3"
                >
                  <item.icon className="h-4 w-4 text-brand-accent" />
                  <p className="mt-2 text-xl font-semibold text-brand-text">{item.value}</p>
                  <p className="text-xs text-brand-text-muted">{item.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="panel-soft stagger-enter px-5 py-6" data-delay="2">
            <p className="section-eyebrow">Aktiver Modus</p>
            <p className="mt-1 text-2xl font-semibold text-brand-text">{SEGMENT_LABELS[segment]}</p>
            <p className="mt-3 text-sm text-brand-text-muted">{copy.productHint}</p>
            <ul className="mt-5 space-y-3 text-sm text-brand-text">
              {copy.trustFocus.map((entry) => (
                <li key={entry} className="flex items-start gap-2">
                  <span className="mt-1 h-1.5 w-1.5 rounded-full bg-brand-accent" />
                  <span>{entry}</span>
                </li>
              ))}
            </ul>
            <div className="mt-6 grid grid-cols-2 gap-3">
              <div className="rounded-xl border border-brand-border-strong bg-white/95 px-3 py-2 text-sm text-brand-text">
                <ShoppingBag className="mb-2 h-4 w-4 text-brand-accent" />
                Checkout in wenigen Schritten
              </div>
              <div className="rounded-xl border border-brand-border-strong bg-white/95 px-3 py-2 text-sm text-brand-text">
                <Building2 className="mb-2 h-4 w-4 text-brand-accent" />
                B2B-Felder nur bei Bedarf
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
