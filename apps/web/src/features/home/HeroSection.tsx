'use client'

import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Building2, Check, Clock3, Play, ShieldCheck, ShoppingBag } from 'lucide-react'
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

  return (
    <section className="shell-container pt-8 md:pt-12">
      <div className="overflow-hidden rounded-[1.8rem] border border-brand-border bg-gradient-to-br from-stone-50 via-white to-stone-100 shadow-[var(--shadow-card)]">
        <div className="grid gap-8 px-6 py-9 lg:grid-cols-[1.15fr_0.85fr] lg:items-center lg:px-10 lg:py-12">
          <div className="animate-reveal">
            <p className="kicker-badge">
              <span className="inline-flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse-soft" />
              New Release 2026
            </p>

            <h1 className="mt-5 max-w-3xl text-balance text-4xl leading-tight md:text-6xl">{title}</h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-brand-text-muted md:text-lg">{subtitle}</p>

            <div className="mt-5 flex flex-wrap gap-2">
              {copy.trustFocus.slice(0, 2).map((entry) => (
                <span key={entry} className="trust-chip px-3 py-1.5 text-xs">
                  {entry}
                </span>
              ))}
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/products">
                <Button size="lg" rightIcon={<ArrowRight className="h-4 w-4" />}>
                  {copy.primaryCta}
                </Button>
              </Link>
              <Link href={segment === 'b2b' ? '/versand' : '/rueckgabe'}>
                <Button size="lg" variant="outline">
                  {copy.secondaryCta}
                </Button>
              </Link>
            </div>

            <div className="mt-7 flex flex-wrap items-center gap-5 text-sm text-brand-text-muted">
              <span className="inline-flex items-center gap-2">
                <Check className="h-4 w-4 text-emerald-600" />
                Free Express Shipping
              </span>
              <span className="inline-flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-emerald-600" />
                2-Year Warranty
              </span>
              <span className="inline-flex items-center gap-2">
                <Clock3 className="h-4 w-4 text-emerald-600" />
                30-Day Returns
              </span>
            </div>

            <div className="mt-7 grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border border-brand-border bg-white/80 px-3 py-3">
                <ShoppingBag className="h-4 w-4 text-brand-accent" />
                <p className="mt-2 text-xl font-semibold text-brand-text">3</p>
                <p className="text-xs text-brand-text-muted">Checkout-Schritte</p>
              </div>
              <div className="rounded-2xl border border-brand-border bg-white/80 px-3 py-3">
                <Clock3 className="h-4 w-4 text-brand-accent" />
                <p className="mt-2 text-xl font-semibold text-brand-text">&lt; 24h</p>
                <p className="text-xs text-brand-text-muted">Support-Zielzeit</p>
              </div>
              <div className="rounded-2xl border border-brand-border bg-white/80 px-3 py-3">
                <Building2 className="h-4 w-4 text-brand-accent" />
                <p className="mt-2 text-xl font-semibold text-brand-text">{SEGMENT_LABELS[segment]}</p>
                <p className="text-xs text-brand-text-muted">Aktiver Modus</p>
              </div>
            </div>
          </div>

          <div className="animate-float">
            <div className="group relative aspect-square overflow-hidden rounded-3xl bg-gradient-to-br from-zinc-100 to-zinc-200 shadow-2xl">
              <Image
                src={
                  segment === 'b2b'
                    ? 'https://picsum.photos/seed/simone-b2b-hero/1200/1200'
                    : 'https://picsum.photos/seed/simone-b2c-hero/1200/1200'
                }
                alt="Simone Shop Hero"
                fill
                sizes="(max-width: 1024px) 100vw, 45vw"
                className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
              />
              <div className="glass-card absolute bottom-6 left-6 right-6 rounded-xl p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-brand-text-muted">Commerce Intelligence</p>
                    <p className="text-sm font-semibold text-brand-text">Trust-first funnel system</p>
                  </div>
                  <button
                    type="button"
                    aria-label="Play product story"
                    className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-black text-white transition-transform hover:scale-105"
                  >
                    <Play className="ml-0.5 h-4 w-4 fill-current" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
