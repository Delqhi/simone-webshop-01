import { createBrowserClient } from '@/lib/supabase'

export async function getAccessToken(): Promise<string | null> {
  if (typeof window === 'undefined') {
    return null
  }

  try {
    const supabase = createBrowserClient()
    const {
      data: { session },
    } = await supabase.auth.getSession()
    return session?.access_token || null
  } catch {
    return null
  }
}

export async function getAuthHeaders(base: HeadersInit = {}): Promise<HeadersInit> {
  const token = await getAccessToken()
  if (!token) {
    return base
  }

  const headers = new Headers(base)
  headers.set('authorization', `Bearer ${token}`)
  return headers
}
