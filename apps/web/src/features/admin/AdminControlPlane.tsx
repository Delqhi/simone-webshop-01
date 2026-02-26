'use client'

import Link from 'next/link'
import { AlertTriangle, ArrowRight, Activity } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { ADMIN_DOMAINS } from '@/features/admin/constants'
import { useSystemHealth, useWarRoomAlerts } from '@/features/admin/hooks'
import { OnboardingGate } from '@/features/admin/OnboardingGate'

export function AdminControlPlane() {
  const { loading, error, data } = useWarRoomAlerts()
  const health = useSystemHealth()

  return (
    <main className="shell-container py-10">
      <header className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-brand-text-muted">Control Plane</p>
          <h1 className="mt-1 text-4xl">Admin Operations Hub</h1>
          <p className="mt-2 max-w-3xl text-brand-text-muted">
            Domainweise Steuerung für Orders, Catalog, Support und War-Room-Monitoring ohne monolithische UI-Blöcke.
          </p>
        </div>
        <Link href="/admin/analytics">
          <Button rightIcon={<ArrowRight className="h-4 w-4" />}>Analytics öffnen</Button>
        </Link>
      </header>

      <OnboardingGate />

      <section className="mb-6 grid gap-4 md:grid-cols-2">
        {health.map((entry) => (
          <article key={entry.label} className="panel p-4">
            <p className="text-sm text-brand-text-muted">{entry.label}</p>
            <p className={entry.ok ? 'mt-2 text-xl font-semibold text-green-700' : 'mt-2 text-xl font-semibold text-red-700'}>
              {entry.ok ? 'OK' : 'Problem'}
            </p>
            <p className="text-sm text-brand-text-muted">{entry.detail}</p>
          </article>
        ))}
      </section>

      <section className="mb-6 panel p-5">
        <h2 className="flex items-center gap-2 text-xl">
          <Activity className="h-5 w-5 text-brand-accent" />
          War-Room Alerts
        </h2>
        {loading ? <p className="mt-3 text-sm text-brand-text-muted">Lade Alerts…</p> : null}
        {error ? <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p> : null}
        <div className="mt-3 space-y-2">
          {(data?.alerts || []).map((alert) => (
            <div
              key={alert.name}
              className={[
                'rounded-lg border px-3 py-2 text-sm',
                alert.triggered ? 'border-red-300 bg-red-50 text-red-800' : 'border-brand-border bg-brand-surface text-brand-text',
              ].join(' ')}
            >
              <p className="font-semibold">{alert.name}</p>
              <p className="text-xs opacity-80">{alert.reason}</p>
            </div>
          ))}
          {!loading && (data?.alerts || []).length === 0 ? (
            <p className="text-sm text-brand-text-muted">Keine Alerts vorhanden.</p>
          ) : null}
        </div>
      </section>

      <section>
        <h2 className="mb-3 flex items-center gap-2 text-xl">
          <AlertTriangle className="h-5 w-5 text-brand-accent" />
          Domains
        </h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {ADMIN_DOMAINS.map((domain) => (
            <article key={domain.title} className="panel p-4">
              <h3 className="text-lg font-semibold text-brand-text">{domain.title}</h3>
              <p className="mt-1 text-sm text-brand-text-muted">{domain.description}</p>
              <Link href={domain.href} className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-brand-accent hover:underline">
                Öffnen
                <ArrowRight className="h-4 w-4" />
              </Link>
            </article>
          ))}
        </div>
      </section>
    </main>
  )
}
