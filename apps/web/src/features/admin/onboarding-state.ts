import { getAuthHeaders } from '@/lib/api/auth'

const COMPLETED_KEY = 'onboarding_completed'
const COMPLETED_AT_KEY = 'onboarding_completed_at'
const ADMIN_COMPLETED_KEY = 'admin_onboarding_completed'
const ADMIN_COMPLETED_AT_KEY = 'admin_onboarding_completed_at'

export type OnboardingState = {
  completed: boolean
  completedAt: string | null
}

export function readLocalOnboardingState(): OnboardingState {
  const completed = localStorage.getItem(COMPLETED_KEY) === 'true'
  const completedAt = localStorage.getItem(COMPLETED_AT_KEY)
  return { completed, completedAt }
}

export function writeLocalOnboardingState(completedAt: string) {
  localStorage.setItem(COMPLETED_KEY, 'true')
  localStorage.setItem(COMPLETED_AT_KEY, completedAt)
}

function parseServerOnboardingState(payload: unknown): OnboardingState | null {
  if (!payload || typeof payload !== 'object') {
    return null
  }

  const envelope = payload as { data?: Record<string, unknown> }
  const data = envelope.data
  if (!data || typeof data !== 'object') {
    return null
  }

  const completedValue = data[ADMIN_COMPLETED_KEY]
  const completedAtValue = data[ADMIN_COMPLETED_AT_KEY]
  const completedAt = typeof completedAtValue === 'string' && completedAtValue.length > 0 ? completedAtValue : null

  if (completedValue === true || completedValue === false) {
    return {
      completed: completedValue,
      completedAt: completedValue ? completedAt : null,
    }
  }

  if (completedAt) {
    return { completed: true, completedAt }
  }

  return null
}

export async function fetchServerOnboardingState(): Promise<OnboardingState | null> {
  const response = await fetch('/api/admin/settings', {
    method: 'GET',
    cache: 'no-store',
    headers: await getAuthHeaders(),
  })

  if (response.status === 401 || response.status === 403) {
    return null
  }
  if (!response.ok) {
    throw new Error(`onboarding_settings_fetch_failed:${response.status}`)
  }

  const payload = await response.json()
  return parseServerOnboardingState(payload)
}

export async function persistServerOnboardingState(completedAt: string) {
  const response = await fetch('/api/admin/settings', {
    method: 'PATCH',
    headers: await getAuthHeaders({ 'Content-Type': 'application/json' }),
    body: JSON.stringify({
      [ADMIN_COMPLETED_KEY]: true,
      [ADMIN_COMPLETED_AT_KEY]: completedAt,
    }),
  })

  if (!response.ok) {
    throw new Error(`onboarding_settings_update_failed:${response.status}`)
  }
}
