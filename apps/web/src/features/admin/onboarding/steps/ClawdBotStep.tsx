import { useState, type ReactNode } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeftIcon, ArrowRightIcon, UserGroupIcon } from '@heroicons/react/24/outline'
import type { StepProps } from '@/features/admin/onboarding/types'

function SocialCard({
  title,
  description,
  badge,
  active,
  onToggle,
  activeClass,
}: {
  title: string
  description: string
  badge: ReactNode
  active: boolean
  onToggle: () => void
  activeClass: string
}) {
  return (
    <div
      className={[
        'panel-soft flex cursor-pointer items-center justify-between rounded-xl border-2 p-4 transition-all',
        active ? activeClass : 'border-brand-border',
      ].join(' ')}
      onClick={onToggle}
    >
      <div className="flex items-center gap-4">
        {badge}
        <div>
          <h3 className="font-semibold text-brand-text">{title}</h3>
          <p className="text-sm text-brand-text-muted">{description}</p>
        </div>
      </div>
      <button
        type="button"
        className={[
          'rounded-lg px-4 py-2 text-sm font-medium transition-all',
          active ? 'bg-brand-accent text-white' : 'border border-brand-border bg-white text-brand-text-muted hover:border-brand-accent hover:text-brand-accent',
        ].join(' ')}
      >
        {active ? 'Verbunden' : 'Verbinden'}
      </button>
    </div>
  )
}

export function ClawdBotStep({ onNext, onBack }: StepProps) {
  const [instagram, setInstagram] = useState(false)
  const [tiktok, setTiktok] = useState(false)
  const [facebook, setFacebook] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      className="mx-auto max-w-2xl space-y-6"
    >
      <div className="mb-8 text-center">
        <UserGroupIcon className="mx-auto mb-4 h-12 w-12 text-brand-accent" />
        <h2 className="text-3xl font-bold text-brand-text">Social-Media Automatisierung</h2>
        <p className="text-brand-text-muted">Verbinde Accounts für automatische Posts.</p>
      </div>

      <div className="space-y-4">
        <SocialCard
          title="Instagram"
          description="Posts, Stories, Reels"
          active={instagram}
          onToggle={() => setInstagram((prev) => !prev)}
          activeClass="border-brand-accent"
          badge={<div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 text-xl">📷</div>}
        />
        <SocialCard
          title="TikTok"
          description="Videos, Trends"
          active={tiktok}
          onToggle={() => setTiktok((prev) => !prev)}
          activeClass="border-brand-accent"
          badge={<div className="flex h-12 w-12 items-center justify-center rounded-lg bg-black text-xl">🎵</div>}
        />
        <SocialCard
          title="Facebook"
          description="Posts, Page"
          active={facebook}
          onToggle={() => setFacebook((prev) => !prev)}
          activeClass="border-brand-accent"
          badge={<div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-600 text-xl font-bold">f</div>}
        />
      </div>

      <p className="text-center text-sm text-brand-text-muted">💡 Optional: später jederzeit in Einstellungen anpassbar.</p>

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
