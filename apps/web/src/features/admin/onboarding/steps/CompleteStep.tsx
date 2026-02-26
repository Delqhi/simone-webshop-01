import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { ChartBarIcon, CheckCircleIcon, Cog6ToothIcon, ShoppingBagIcon } from '@heroicons/react/24/outline'
import { CONFETTI_COLORS } from '@/features/admin/onboarding/constants'
import type { StepProps } from '@/features/admin/onboarding/types'

export function CompleteStep({ onComplete }: StepProps) {
  const [showConfetti, setShowConfetti] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setShowConfetti(false), 5000)
    return () => clearTimeout(timer)
  }, [])

  const confetti = useMemo(
    () => {
      const width = typeof window === 'undefined' ? 1200 : window.innerWidth
      return [...Array(40)].map(() => ({
        x: Math.random() * width,
        duration: 3 + Math.random() * 2,
        delay: Math.random() * 0.5,
        color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
      }))
    },
    [],
  )

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="mx-auto max-w-2xl space-y-8 text-center"
    >
      {showConfetti ? (
        <div className="pointer-events-none fixed inset-0 overflow-hidden">
          {confetti.map((piece, index) => (
            <motion.div
              key={`${piece.x}-${index}`}
              initial={{ y: -20, x: piece.x, opacity: 1 }}
              animate={{ y: typeof window === 'undefined' ? 940 : window.innerHeight + 20, opacity: 0 }}
              transition={{ duration: piece.duration, delay: piece.delay }}
              className="absolute h-3 w-3 rounded-full"
              style={{ backgroundColor: piece.color }}
            />
          ))}
        </div>
      ) : null}

      <div className="mx-auto flex h-32 w-32 items-center justify-center rounded-full bg-brand-accent">
        <CheckCircleIcon className="h-20 w-20 text-white" />
      </div>

      <h1 className="text-4xl font-bold text-brand-text">Fertig</h1>
      <p className="text-xl text-brand-text-muted">Dein KI-Shop ist jetzt einsatzbereit.</p>

      <div className="panel space-y-3 rounded-xl p-6 text-left">
        <h3 className="mb-4 text-lg font-semibold text-brand-text">Was wurde eingerichtet:</h3>
        <p className="flex items-center gap-3 text-green-700"><CheckCircleIcon className="h-5 w-5" />Shop-Grundlagen konfiguriert</p>
        <p className="flex items-center gap-3 text-green-700"><CheckCircleIcon className="h-5 w-5" />KI-Assistenten aktiviert</p>
        <p className="flex items-center gap-3 text-green-700"><CheckCircleIcon className="h-5 w-5" />Alle Services laufen</p>
        <p className="flex items-center gap-3 text-green-700"><CheckCircleIcon className="h-5 w-5" />30-Tage-Testphase gestartet</p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <button type="button" className="panel-soft group rounded-xl p-4 transition-all hover:border-brand-accent">
          <ShoppingBagIcon className="mx-auto mb-2 h-8 w-8 text-brand-accent transition-transform group-hover:scale-110" />
          <span className="text-sm text-brand-text">Produkte</span>
        </button>
        <button type="button" className="panel-soft group rounded-xl p-4 transition-all hover:border-brand-accent">
          <ChartBarIcon className="mx-auto mb-2 h-8 w-8 text-brand-accent transition-transform group-hover:scale-110" />
          <span className="text-sm text-brand-text">Analytics</span>
        </button>
        <button type="button" className="panel-soft group rounded-xl p-4 transition-all hover:border-brand-accent">
          <Cog6ToothIcon className="mx-auto mb-2 h-8 w-8 text-brand-accent transition-transform group-hover:scale-110" />
          <span className="text-sm text-brand-text">Einstellungen</span>
        </button>
      </div>

      <button
        type="button"
        onClick={onComplete}
        className="rounded-xl bg-brand-accent px-10 py-4 text-lg font-semibold text-white transition-colors hover:bg-[color:var(--brand-accent-strong)]"
      >
        Zum Dashboard
      </button>
    </motion.div>
  )
}
