'use client'

import { useEffect, useState } from 'react'
import { PromotionBannerListSchema, type CustomerSegment, type PromotionBanner } from '@simone/contracts'

type PromotionPlacement = 'header' | 'pdp' | 'cart'

type PromotionState = {
  items: PromotionBanner[]
  loading: boolean
  error: string | null
}

const INITIAL_STATE: PromotionState = {
  items: [],
  loading: true,
  error: null,
}

export function useActivePromotions(placement: PromotionPlacement, segment: CustomerSegment) {
  const [state, setState] = useState<PromotionState>(INITIAL_STATE)

  useEffect(() => {
    let active = true

    const run = async () => {
      setState((current) => ({ ...current, loading: true, error: null }))
      try {
        const query = new URLSearchParams({
          placement,
          segment,
          limit: '3',
        })
        const response = await fetch(`/api/promotions/active?${query.toString()}`, {
          method: 'GET',
          cache: 'no-store',
        })
        if (!response.ok) {
          throw new Error(`promotions_fetch_failed:${response.status}`)
        }
        const payload = PromotionBannerListSchema.parse(await response.json())
        if (!active) {
          return
        }
        setState({ items: payload.items, loading: false, error: null })
      } catch (error) {
        if (!active) {
          return
        }
        setState({
          items: [],
          loading: false,
          error: error instanceof Error ? error.message : 'promotions_fetch_failed',
        })
      }
    }

    void run()
    return () => {
      active = false
    }
  }, [placement, segment])

  return state
}
