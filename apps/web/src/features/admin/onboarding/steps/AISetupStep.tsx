import { useState, type ReactNode } from 'react'
import { motion } from 'framer-motion'
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  ChatBubbleBottomCenterTextIcon,
  CheckCircleIcon,
  CpuChipIcon,
  SparklesIcon,
  UserGroupIcon,
} from '@heroicons/react/24/outline'
import type { StepProps } from '@/features/admin/onboarding/types'

function ToggleFeature({
  title,
  description,
  icon,
  active,
  onToggle,
}: {
  title: string
  description: string
  icon: ReactNode
  active: boolean
  onToggle: () => void
}) {
  return (
    <div
      className={[
        'panel-soft flex cursor-pointer items-center justify-between rounded-xl border-2 p-4 transition-all',
        active ? 'border-brand-accent' : 'border-brand-border',
      ].join(' ')}
      onClick={onToggle}
    >
      <div className="flex items-center gap-4">
        {icon}
        <div>
          <h3 className="font-semibold text-brand-text">{title}</h3>
          <p className="text-sm text-brand-text-muted">{description}</p>
        </div>
      </div>
      <div className={['h-6 w-12 rounded-full p-1 transition-colors', active ? 'bg-brand-accent' : 'bg-brand-border'].join(' ')}>
        <div className={['h-4 w-4 rounded-full bg-white transition-transform', active ? 'translate-x-6' : 'translate-x-0'].join(' ')} />
      </div>
    </div>
  )
}

export function AISetupStep({ onNext, onBack }: StepProps) {
  const [chatAI, setChatAI] = useState(true)
  const [productAI, setProductAI] = useState(true)
  const [socialAI, setSocialAI] = useState(true)
  const [isConfiguring, setIsConfiguring] = useState(false)

  const handleConfigure = async () => {
    setIsConfiguring(true)
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setIsConfiguring(false)
    onNext()
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      className="mx-auto max-w-2xl space-y-6"
    >
      <div className="mb-8 text-center">
        <CpuChipIcon className="mx-auto mb-4 h-12 w-12 text-brand-accent" />
        <h2 className="text-3xl font-bold text-brand-text">KI-Einrichtung</h2>
        <p className="text-brand-text-muted">Deine KI ist vorkonfiguriert. Aktiviere die gewünschten Features.</p>
      </div>

      <div className="rounded-xl border border-green-200 bg-green-50 p-4 text-center">
        <CheckCircleIcon className="mx-auto mb-2 h-6 w-6 text-green-700" />
        <p className="font-semibold text-green-800">KI bereits konfiguriert</p>
        <p className="text-sm text-green-700">Kostenlose Provider: OpenCode Zen, Mistral, Groq</p>
      </div>

      <div className="space-y-4">
        <ToggleFeature
          title="Kundenservice-KI"
          description="Beantwortet einen Großteil der Anfragen automatisch"
          icon={<ChatBubbleBottomCenterTextIcon className="h-8 w-8 text-brand-accent" />}
          active={chatAI}
          onToggle={() => setChatAI((prev) => !prev)}
        />
        <ToggleFeature
          title="Produkt-Beschreibungs-KI"
          description="Generiert SEO-optimierte Produkttexte"
          icon={<SparklesIcon className="h-8 w-8 text-brand-accent" />}
          active={productAI}
          onToggle={() => setProductAI((prev) => !prev)}
        />
        <ToggleFeature
          title="Social-Media-KI"
          description="Erstellt automatische Posts für zentrale Kanäle"
          icon={<UserGroupIcon className="h-8 w-8 text-brand-accent" />}
          active={socialAI}
          onToggle={() => setSocialAI((prev) => !prev)}
        />
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
          onClick={handleConfigure}
          disabled={isConfiguring}
          className="flex items-center gap-2 rounded-xl bg-brand-accent px-6 py-3 font-semibold text-white transition-colors hover:bg-[color:var(--brand-accent-strong)] disabled:opacity-60"
        >
          {isConfiguring ? (
            <>
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              Konfiguriere...
            </>
          ) : (
            <>
              One-Click Setup <ArrowRightIcon className="h-4 w-4" />
            </>
          )}
        </button>
      </div>
    </motion.div>
  )
}
