'use client'

import { SEGMENT_LABELS } from '@/features/segment/content'
import { useCustomerSegmentStore } from '@/features/segment/store'
import { trackEvent } from '@/lib/analytics'
import type { CustomerSegment } from '@simone/contracts'
import { cn } from '@/lib/utils'

type SegmentSwitchProps = {
  className?: string
}

const SEGMENTS: CustomerSegment[] = ['b2c', 'b2b']

export function SegmentSwitch({ className }: SegmentSwitchProps) {
  const { segment, setSegment } = useCustomerSegmentStore()

  const onSelect = (value: CustomerSegment) => {
    if (value === segment) {
      return
    }
    setSegment(value)
    void trackEvent('trust_panel_opened', {
      payload: {
        module: 'segment_switch',
        selected_segment: value,
      },
      segment: value,
    })
  }

  return (
    <div
      className={cn(
        'inline-flex items-center rounded-full border border-brand-border bg-brand-surface p-1 shadow-sm',
        className,
      )}
      role="tablist"
      aria-label="Kundensegment auswählen"
    >
      {SEGMENTS.map((value) => {
        const selected = value === segment
        return (
          <button
            key={value}
            type="button"
            role="tab"
            aria-selected={selected}
            onClick={() => onSelect(value)}
            className={cn(
              'rounded-full px-3 py-1.5 text-sm font-semibold transition-colors',
              selected
                ? 'bg-brand-accent text-white shadow-sm'
                : 'text-brand-text-muted hover:text-brand-text',
            )}
          >
            {SEGMENT_LABELS[value]}
          </button>
        )
      })}
    </div>
  )
}
