const DEFAULT_SITE_URL = 'http://localhost:3000'

export const SITE_NAME = "Simone's Shop"
export const SITE_DESCRIPTION =
  'Transparente Preise, schnelle Lieferung und verlässlicher Support für Privat- und Geschäftskunden.'
export const DEFAULT_LOCALE = 'de_DE'
export const DEFAULT_CURRENCY = 'EUR'

function normalizeSiteUrl(value?: string): string {
  if (!value) {
    return DEFAULT_SITE_URL
  }

  const trimmed = value.trim()
  if (!trimmed) {
    return DEFAULT_SITE_URL
  }

  try {
    const parsed = new URL(trimmed)
    parsed.pathname = ''
    parsed.search = ''
    parsed.hash = ''
    return parsed.toString().replace(/\/$/, '')
  } catch {
    return DEFAULT_SITE_URL
  }
}

export function getSiteUrl(): string {
  return normalizeSiteUrl(process.env.SITE_URL || process.env.NEXT_PUBLIC_APP_URL)
}

export function absoluteUrl(path = '/'): string {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`
  return `${getSiteUrl()}${normalizedPath}`
}

