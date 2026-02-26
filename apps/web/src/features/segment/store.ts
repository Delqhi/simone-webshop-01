'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { CustomerSegment } from '@simone/contracts'

const DEFAULT_SEGMENT: CustomerSegment = 'b2c'

interface CustomerSegmentState {
  segment: CustomerSegment
  setSegment: (segment: CustomerSegment) => void
}

export const useCustomerSegmentStore = create<CustomerSegmentState>()(
  persist(
    (set) => ({
      segment: DEFAULT_SEGMENT,
      setSegment: (segment) => set({ segment }),
    }),
    {
      name: 'simone-customer-segment',
      version: 1,
    },
  ),
)
