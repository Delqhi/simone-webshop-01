'use client'

import { useEffect, useState } from 'react'
import { Sparkles } from 'lucide-react'
import OnboardingWizard from '@/components/admin/OnboardingWizard'
import { Button } from '@/components/ui/Button'
import {
  fetchServerOnboardingState,
  persistServerOnboardingState,
  readLocalOnboardingState,
  type OnboardingState,
  writeLocalOnboardingState,
} from '@/features/admin/onboarding-state'
import { trackEvent } from '@/lib/analytics'

export function OnboardingGate() {
  const [ready, setReady] = useState(false)
  const [completed, setCompleted] = useState(false)
  const [completedAt, setCompletedAt] = useState<string | null>(null)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    let active = true

    const hydrate = async () => {
      const local = readLocalOnboardingState()
      let effectiveState: OnboardingState = local
      setCompleted(local.completed)
      setCompletedAt(local.completedAt)
      setOpen(!local.completed)

      try {
        const server = await fetchServerOnboardingState()
        if (active && server) {
          effectiveState = server
          setCompleted(server.completed)
          setCompletedAt(server.completedAt)
          setOpen(!server.completed)
          if (server.completed && server.completedAt) {
            writeLocalOnboardingState(server.completedAt)
          }
        }
      } catch (error) {
        console.error('Onboarding state sync failed:', error)
      } finally {
        if (active) {
          setReady(true)
        }
      }

      if (effectiveState.completed === false) {
        void trackEvent('onboarding_opened', { payload: { source: 'auto_gate' } })
      }
    }

    void hydrate()

    return () => {
      active = false
    }
  }, [])

  const openWizard = () => {
    setOpen(true)
    void trackEvent('onboarding_opened', { payload: { source: 'manual' } })
  }

  const closeWizard = () => {
    setOpen(false)
  }

  const handleSkip = () => {
    const now = new Date().toISOString()
    writeLocalOnboardingState(now)
    setCompleted(true)
    setCompletedAt(now)
    void trackEvent('onboarding_skipped', { payload: { source: 'manual_skip' } })
    void persistServerOnboardingState(now).catch((error) => {
      console.error('Failed to persist onboarding skip state:', error)
    })
    closeWizard()
  }

  const handleComplete = () => {
    const now = new Date().toISOString()
    writeLocalOnboardingState(now)
    setCompleted(true)
    setCompletedAt(now)
    void trackEvent('onboarding_completed', { payload: { source: 'wizard' } })
    void persistServerOnboardingState(now).catch((error) => {
      console.error('Failed to persist onboarding completion state:', error)
    })
    closeWizard()
  }

  if (!ready) {
    return null
  }

  return (
    <>
      <article className="panel mb-6 p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-brand-text-muted">Setup-Assistent</p>
            <h2 className="mt-1 text-xl">Onboarding Status</h2>
            <p className="mt-2 text-sm text-brand-text-muted">
              {completed
                ? `Abgeschlossen${completedAt ? ` am ${new Date(completedAt).toLocaleString('de-DE')}` : ''}`
                : 'Noch nicht abgeschlossen. Starte den Assistenten für die vollständige Systemeinrichtung.'}
            </p>
          </div>
          <Button onClick={openWizard} leftIcon={<Sparkles className="h-4 w-4" />}>
            {completed ? 'Onboarding erneut starten' : 'Onboarding starten'}
          </Button>
        </div>
      </article>

      {open ? <OnboardingWizard onComplete={handleComplete} onSkip={handleSkip} /> : null}
    </>
  )
}
