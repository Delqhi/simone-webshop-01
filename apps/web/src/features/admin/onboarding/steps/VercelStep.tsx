import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeftIcon, ArrowRightIcon, CheckCircleIcon, CloudIcon, RocketLaunchIcon } from '@heroicons/react/24/outline'
import type { StepProps } from '@/features/admin/onboarding/types'

export function VercelStep({ onNext, onBack }: StepProps) {
  const [status, setStatus] = useState<'idle' | 'deploying' | 'live'>('idle')
  const [deployUrl, setDeployUrl] = useState('')

  const handleDeploy = async () => {
    setStatus('deploying')
    await new Promise((resolve) => setTimeout(resolve, 3000))
    setDeployUrl('https://mein-shop.vercel.app')
    setStatus('live')
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      className="mx-auto max-w-2xl space-y-6"
    >
      <div className="mb-8 text-center">
        <CloudIcon className="mx-auto mb-4 h-12 w-12 text-brand-accent" />
        <h2 className="text-3xl font-bold text-brand-text">Deployment</h2>
        <p className="text-brand-text-muted">Dein Shop geht mit einem Klick live.</p>
      </div>

      <div className="panel space-y-6 rounded-xl p-8 text-center">
        {status === 'idle' ? (
          <>
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-xl bg-brand-text">
              <svg viewBox="0 0 76 65" fill="white" className="h-10 w-10">
                <path d="M37.5274 0L75.0548 65H0L37.5274 0Z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-brand-text">Deploy to Vercel</h3>
            <p className="text-brand-text-muted">Serverless, schnell, kostenlos für Hobby-Projekte</p>
            <button
              type="button"
              onClick={handleDeploy}
              className="inline-flex items-center gap-2 rounded-xl bg-brand-text px-8 py-4 text-lg font-semibold text-white transition-colors hover:bg-[#162028]"
            >
              <RocketLaunchIcon className="h-5 w-5" /> Deploy Now
            </button>
          </>
        ) : null}

        {status === 'deploying' ? (
          <>
            <div className="relative mx-auto h-20 w-20">
              <div className="absolute inset-0 rounded-full border-4 border-brand-border" />
              <div className="absolute inset-0 animate-spin rounded-full border-4 border-brand-accent border-t-transparent" />
            </div>
            <h3 className="text-xl font-semibold text-brand-text">Deploying...</h3>
            <p className="text-brand-text-muted">Dein Shop wird bereitgestellt. Das dauert etwa 30 Sekunden.</p>
          </>
        ) : null}

        {status === 'live' ? (
          <>
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-500/20">
              <CheckCircleIcon className="h-12 w-12 text-green-700" />
            </div>
            <h3 className="text-xl font-semibold text-green-700">Shop ist live</h3>
            <a href={deployUrl} target="_blank" rel="noopener noreferrer" className="underline text-brand-accent hover:text-[color:var(--brand-accent-strong)]">
              {deployUrl}
            </a>
          </>
        ) : null}
      </div>

      <p className="text-center text-sm text-brand-text-muted">💡 Deployment kann später jederzeit in den Einstellungen erfolgen.</p>

      <div className="flex justify-between">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-2 rounded-xl border border-brand-border bg-white px-6 py-3 text-brand-text-muted transition-colors hover:border-brand-accent hover:text-brand-accent"
        >
          <ArrowLeftIcon className="h-4 w-4" /> Zurück
        </button>
        <button
          type="button"
          onClick={onNext}
          className="flex items-center gap-2 rounded-xl bg-brand-accent px-6 py-3 font-semibold text-white transition-colors hover:bg-[color:var(--brand-accent-strong)]"
        >
          {status === 'live' ? 'Weiter' : 'Überspringen'} <ArrowRightIcon className="h-4 w-4" />
        </button>
      </div>
    </motion.div>
  )
}
