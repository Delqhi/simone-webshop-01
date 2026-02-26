'use client'

import { ReactNode, useEffect, useState } from 'react'
import Link from 'next/link'
import { ShieldAlert } from 'lucide-react'
import { getAuthHeaders } from '@/lib/api/auth'

type GuardState = 'loading' | 'authorized' | 'unauthorized' | 'error'

function isPrivilegedRole(role: unknown) {
  return role === 'admin' || role === 'ops'
}

export function AdminAccessGate({ children }: { children: ReactNode }) {
  const [state, setState] = useState<GuardState>('loading')
  const [detail, setDetail] = useState<string>('Berechtigung wird geprüft…')

  useEffect(() => {
    let active = true

    const run = async () => {
      setState('loading')
      try {
        const response = await fetch('/api/account/me', {
          method: 'GET',
          cache: 'no-store',
          headers: await getAuthHeaders(),
        })
        if (!active) {
          return
        }
        if (response.status === 401 || response.status === 403) {
          setState('unauthorized')
          setDetail('Bitte mit einem Admin- oder Ops-Konto anmelden.')
          return
        }
        if (!response.ok) {
          setState('error')
          setDetail(`Account-Prüfung fehlgeschlagen (${response.status}).`)
          return
        }

        const payload = (await response.json()) as { role?: string }
        if (!isPrivilegedRole(payload?.role)) {
          setState('unauthorized')
          setDetail('Dein Konto hat keinen Zugriff auf den Admin-Bereich.')
          return
        }
        setState('authorized')
      } catch {
        if (active) {
          setState('error')
          setDetail('Admin-Zugriff konnte nicht geprüft werden.')
        }
      }
    }

    void run()
    return () => {
      active = false
    }
  }, [])

  if (state === 'authorized') {
    return <>{children}</>
  }

  return (
    <main className="shell-container py-14">
      <section className="panel mx-auto max-w-2xl px-6 py-8 text-center">
        <ShieldAlert className="mx-auto h-7 w-7 text-brand-accent" />
        <h1 className="mt-4 text-3xl">
          {state === 'loading' ? 'Zugriff wird geprüft' : 'Kein Admin-Zugriff'}
        </h1>
        <p className="mt-3 text-brand-text-muted">{detail}</p>
        <div className="mt-6 flex justify-center gap-3">
          <Link href="/account" className="rounded-xl border border-brand-border px-4 py-2 text-sm font-semibold hover:border-brand-accent hover:text-brand-accent">
            Zum Konto
          </Link>
          <Link href="/" className="rounded-xl bg-brand-accent px-4 py-2 text-sm font-semibold text-white hover:bg-[color:var(--brand-accent-strong)]">
            Zur Startseite
          </Link>
        </div>
      </section>
    </main>
  )
}
