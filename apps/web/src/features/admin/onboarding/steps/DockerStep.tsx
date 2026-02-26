import { motion } from 'framer-motion'
import { ArrowLeftIcon, ArrowRightIcon, ServerStackIcon } from '@heroicons/react/24/outline'
import { DOCKER_SERVICES } from '@/features/admin/onboarding/constants'
import type { StepProps } from '@/features/admin/onboarding/types'

export function DockerStep({ onNext, onBack }: StepProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      className="mx-auto max-w-2xl space-y-6"
    >
      <div className="mb-8 text-center">
        <ServerStackIcon className="mx-auto mb-4 h-12 w-12 text-brand-accent" />
        <h2 className="text-3xl font-bold text-brand-text">Systemdienste</h2>
        <p className="text-brand-text-muted">Status deiner Backend-Services</p>
      </div>

      <div className="panel space-y-4 rounded-xl p-6">
        {DOCKER_SERVICES.map((service) => (
          <div key={service.name} className="flex items-center justify-between border-b border-brand-border py-2 last:border-0">
            <div className="flex items-center gap-3">
              <div className="h-3 w-3 animate-pulse rounded-full bg-green-500" />
              <span className="font-medium text-brand-text">{service.name}</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-brand-text-muted">Port {service.port}</span>
              <span className="text-sm font-medium uppercase text-green-700">{service.status}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-green-200 bg-green-50 p-4 text-center">
        <p className="font-semibold text-green-800">Alle Services laufen</p>
      </div>

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
          Weiter <ArrowRightIcon className="h-4 w-4" />
        </button>
      </div>
    </motion.div>
  )
}
