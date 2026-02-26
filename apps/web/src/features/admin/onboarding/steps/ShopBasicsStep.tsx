import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeftIcon, ArrowRightIcon, CloudIcon, ShoppingBagIcon } from '@heroicons/react/24/outline'
import type { StepProps } from '@/features/admin/onboarding/types'

export function ShopBasicsStep({ onNext, onBack }: StepProps) {
  const [shopName, setShopName] = useState('')
  const [shopDescription, setShopDescription] = useState('')
  const [primaryColor, setPrimaryColor] = useState('#1f8c72')

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      className="mx-auto max-w-2xl space-y-6"
    >
      <div className="mb-8 text-center">
        <ShoppingBagIcon className="mx-auto mb-4 h-12 w-12 text-brand-accent" />
        <h2 className="text-3xl font-bold text-brand-text">Shop-Grundlagen</h2>
        <p className="text-brand-text-muted">Gib deinem Shop eine klare Identität</p>
      </div>

      <div className="panel space-y-6 rounded-xl p-6">
        <div>
          <label className="mb-2 block text-sm font-medium text-brand-text">Shop-Name *</label>
          <input
            type="text"
            value={shopName}
            onChange={(event) => setShopName(event.target.value)}
            placeholder="z. B. Mein Traumshop"
            className="w-full rounded-lg border border-brand-border bg-white px-4 py-3 text-brand-text placeholder-brand-text-muted focus:border-brand-accent focus:ring-1 focus:ring-brand-accent"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-brand-text">Shop-Beschreibung</label>
          <textarea
            value={shopDescription}
            onChange={(event) => setShopDescription(event.target.value)}
            placeholder="Was verkaufst du? Beschreibe dein Geschäft in 1-2 Sätzen..."
            rows={3}
            className="w-full rounded-lg border border-brand-border bg-white px-4 py-3 text-brand-text placeholder-brand-text-muted focus:border-brand-accent focus:ring-1 focus:ring-brand-accent"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-brand-text">Logo (optional)</label>
          <div className="cursor-pointer rounded-lg border-2 border-dashed border-brand-border bg-brand-surface-strong p-8 text-center transition-colors hover:border-brand-accent">
            <CloudIcon className="mx-auto mb-2 h-8 w-8 text-brand-text-muted" />
            <p className="text-sm text-brand-text-muted">Klicken oder Datei hierher ziehen</p>
            <p className="mt-1 text-xs text-brand-text-muted">PNG, JPG bis 5MB</p>
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-brand-text">Primärfarbe</label>
          <div className="flex items-center gap-4">
            <input type="color" value={primaryColor} onChange={(event) => setPrimaryColor(event.target.value)} className="h-12 w-12 cursor-pointer rounded-lg" />
            <span className="text-brand-text-muted">{primaryColor}</span>
            <div className="ml-auto flex gap-2">
              {['#1f8c72', '#176b57', '#3a6ea5', '#a76a1f'].map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setPrimaryColor(color)}
                  className="h-8 w-8 rounded-full border-2 border-transparent hover:border-brand-text"
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>
        </div>
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
