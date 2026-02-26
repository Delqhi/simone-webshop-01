'use client'

import { useEffect, useState } from 'react'
import { trackEvent } from '@/lib/analytics'

type Variant = string

type ExperimentOptions = {
  experimentId: string
  variants: readonly [Variant, Variant]
  autoTrack?: boolean
}

function resolveVariant<T extends readonly [Variant, Variant]>(
  experimentId: string,
  variants: T,
): T[number] {
  const storageKey = `simone-exp:${experimentId}`
  const existing = window.localStorage.getItem(storageKey)
  if (existing && variants.includes(existing)) {
    return existing as T[number]
  }

  const bucket = Math.random() < 0.5 ? variants[0] : variants[1]
  window.localStorage.setItem(storageKey, bucket)
  return bucket
}

export function useExperimentVariant<T extends readonly [Variant, Variant]>({
  experimentId,
  variants,
  autoTrack = true,
}: ExperimentOptions & { variants: T }): T[number] {
  const [variant, setVariant] = useState<T[number]>(variants[0])

  useEffect(() => {
    const selected = resolveVariant(experimentId, variants)
    setVariant(selected)

    if (autoTrack) {
      void trackEvent('trust_panel_opened', {
        payload: {
          module: 'ab_experiment',
          experiment_id: experimentId,
          variant: selected,
        },
      })
    }
  }, [autoTrack, experimentId, variants])

  return variant
}
