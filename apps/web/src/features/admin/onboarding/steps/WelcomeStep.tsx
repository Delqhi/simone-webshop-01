import { motion } from 'framer-motion'
import {
  ArrowRightIcon,
  ChartBarIcon,
  ChatBubbleBottomCenterTextIcon,
  CpuChipIcon,
  RocketLaunchIcon,
} from '@heroicons/react/24/outline'
import type { StepProps } from '@/features/admin/onboarding/types'

export function WelcomeStep({ onNext }: StepProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-8 text-center"
    >
      <div className="flex justify-center">
        <div className="flex h-24 w-24 items-center justify-center rounded-full bg-brand-accent">
          <RocketLaunchIcon className="h-12 w-12 text-white" />
        </div>
      </div>

      <h1 className="text-4xl font-bold text-brand-text">Willkommen bei deinem neuen KI-Shop</h1>

      <p className="mx-auto max-w-2xl text-lg text-brand-text-muted">
        Dein vollautomatisierter KI-Webshop ist bereit. Lass uns alles einrichten und in wenigen Minuten starten.
      </p>

      <div className="mx-auto grid max-w-3xl gap-4 md:grid-cols-3">
        <div className="panel-soft rounded-xl p-4">
          <ChatBubbleBottomCenterTextIcon className="mx-auto mb-2 h-8 w-8 text-brand-accent" />
          <h3 className="font-semibold text-brand-text">KI-Chat 24/7</h3>
          <p className="text-sm text-brand-text-muted">Automatischer Kundenservice</p>
        </div>
        <div className="panel-soft rounded-xl p-4">
          <CpuChipIcon className="mx-auto mb-2 h-8 w-8 text-brand-accent" />
          <h3 className="font-semibold text-brand-text">Vollautomatisierung</h3>
          <p className="text-sm text-brand-text-muted">Bestellungen & Lieferanten</p>
        </div>
        <div className="panel-soft rounded-xl p-4">
          <ChartBarIcon className="mx-auto mb-2 h-8 w-8 text-brand-accent" />
          <h3 className="font-semibold text-brand-text">Analytics</h3>
          <p className="text-sm text-brand-text-muted">Echtzeit-Statistiken</p>
        </div>
      </div>

      <div className="mx-auto max-w-md rounded-xl border border-brand-border bg-brand-surface p-4">
        <p className="text-sm text-brand-text">
          🎁 <strong>30 Tage kostenlos testen</strong> - alle Features inklusive.
        </p>
      </div>

      <button
        type="button"
        onClick={onNext}
        className="mx-auto flex items-center gap-2 rounded-xl bg-brand-accent px-8 py-4 text-lg font-semibold text-white transition-colors hover:bg-[color:var(--brand-accent-strong)]"
      >
        Los geht&apos;s <ArrowRightIcon className="h-5 w-5" />
      </button>
    </motion.div>
  )
}
