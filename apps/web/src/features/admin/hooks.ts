'use client'

import { useEffect, useState } from 'react'
import { getAuthHeaders } from '@/lib/api/auth'
import type { AnalyticsAlertResponse, HealthStatus } from './types'

async function fetchJSON<T>(url: string): Promise<T> {
  const response = await fetch(url, {
    cache: 'no-store',
    headers: await getAuthHeaders(),
  })
  if (!response.ok) {
    throw new Error(`request_failed:${response.status}`)
  }
  return response.json() as Promise<T>
}

export function useWarRoomAlerts() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [data, setData] = useState<AnalyticsAlertResponse | null>(null)

  useEffect(() => {
    let active = true

    const run = async () => {
      setLoading(true)
      setError(null)
      try {
        const payload = await fetchJSON<AnalyticsAlertResponse>('/api/analytics/alerts?hours=2')
        if (!active) {
          return
        }
        setData(payload)
      } catch (loadError) {
        if (!active) {
          return
        }
        setError(loadError instanceof Error ? loadError.message : 'alerts_load_failed')
      } finally {
        if (active) {
          setLoading(false)
        }
      }
    }

    void run()
    const timer = window.setInterval(() => {
      void run()
    }, 60_000)

    return () => {
      active = false
      window.clearInterval(timer)
    }
  }, [])

  return { loading, error, data }
}

export function useSystemHealth() {
  const [webHealth, setWebHealth] = useState<HealthStatus>({
    ok: false,
    label: 'Web API',
    detail: 'wird geprüft…',
  })
  const [analyticsHealth, setAnalyticsHealth] = useState<HealthStatus>({
    ok: false,
    label: 'Analytics API',
    detail: 'wird geprüft…',
  })

  useEffect(() => {
    let active = true

    const run = async () => {
      try {
        const res = await fetch('/api/health', { cache: 'no-store' })
        if (!active) {
          return
        }
        setWebHealth({
          ok: res.ok,
          label: 'Web API',
          detail: res.ok ? 'healthy' : `status ${res.status}`,
        })
      } catch {
        if (!active) {
          return
        }
        setWebHealth({ ok: false, label: 'Web API', detail: 'nicht erreichbar' })
      }

      try {
        const res = await fetch('/api/analytics', { cache: 'no-store' })
        if (!active) {
          return
        }
        setAnalyticsHealth({
          ok: res.ok,
          label: 'Analytics API',
          detail: res.ok ? 'healthy' : `status ${res.status}`,
        })
      } catch {
        if (!active) {
          return
        }
        setAnalyticsHealth({ ok: false, label: 'Analytics API', detail: 'nicht erreichbar' })
      }
    }

    void run()
  }, [])

  return [webHealth, analyticsHealth]
}
