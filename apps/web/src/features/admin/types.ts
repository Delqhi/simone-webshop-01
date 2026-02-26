export type AdminDomainLink = {
  title: string
  href: string
  description: string
}

export type AlertRecord = {
  name: string
  triggered: boolean
  severity: string
  reason: string
}

export type AnalyticsAlertResponse = {
  windowHours: number
  alerts: AlertRecord[]
}

export type HealthStatus = {
  ok: boolean
  label: string
  detail: string
}
