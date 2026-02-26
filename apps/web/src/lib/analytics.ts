import { AnalyticsEventSchema, type AnalyticsEvent, type AnalyticsEventType } from '@simone/contracts'
import { useCustomerSegmentStore } from '@/features/segment/store'

type TrackOptions = {
  payload?: Record<string, unknown>
  segment?: AnalyticsEvent['segment']
  route?: string
}

function currentRoute(): string | undefined {
  if (typeof window === 'undefined') {
    return undefined
  }
  return `${window.location.pathname}${window.location.search}`
}

function currentExperimentAssignments(): Record<string, string> {
  if (typeof window === 'undefined') {
    return {}
  }

  const assignments: Record<string, string> = {}
  const prefix = 'simone-exp:'
  for (let index = 0; index < window.localStorage.length; index += 1) {
    const key = window.localStorage.key(index)
    if (!key || !key.startsWith(prefix)) {
      continue
    }
    const experimentId = key.slice(prefix.length)
    const variant = window.localStorage.getItem(key)
    if (experimentId && variant) {
      assignments[experimentId] = variant
    }
  }
  return assignments
}

export async function trackEvent(type: AnalyticsEventType, options: TrackOptions = {}) {
  const segment = options.segment || useCustomerSegmentStore.getState().segment
  const payload = {
    ...(options.payload || {}),
    _experiments: currentExperimentAssignments(),
  }
  const event = AnalyticsEventSchema.parse({
    type,
    segment,
    occurredAt: new Date().toISOString(),
    route: options.route || currentRoute(),
    payload,
  })

  try {
    await fetch('/api/analytics', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify(event),
      keepalive: true,
    })
  } catch {
    // Tracking is best-effort and must never block checkout or navigation.
  }
}
