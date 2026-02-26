import { NextRequest, NextResponse } from 'next/server'

const HOP_BY_HOP_HEADERS = new Set([
  'connection',
  'keep-alive',
  'proxy-authenticate',
  'proxy-authorization',
  'te',
  'trailers',
  'transfer-encoding',
  'upgrade',
  'host',
  'content-length',
])

const FORWARDED_RESPONSE_HEADERS = new Set([
  'cache-control',
  'content-type',
  'deprecation',
  'etag',
  'last-modified',
  'location',
  'retry-after',
  'sunset',
  'vary',
  'x-request-id',
])

const REQUEST_TIMEOUT_MS = 15_000

type RateLimitRule = {
  id: string
  pathPrefix: string
  methods: string[]
  max: number
  windowMs: number
}

type RateLimitState = {
  count: number
  resetAt: number
}

type RateLimitResult = {
  limit: number
  remaining: number
  resetAt: number
  retryAfterSeconds: number
  exceeded: boolean
}

const RATE_LIMIT_RULES: RateLimitRule[] = [
  {
    id: 'catalog-read',
    pathPrefix: '/api/v1/catalog/',
    methods: ['GET'],
    max: 240,
    windowMs: 60_000,
  },
  {
    id: 'promotions-read',
    pathPrefix: '/api/v1/promotions/active',
    methods: ['GET'],
    max: 180,
    windowMs: 60_000,
  },
  {
    id: 'analytics-events',
    pathPrefix: '/api/v1/analytics/events',
    methods: ['POST'],
    max: 90,
    windowMs: 60_000,
  },
  {
    id: 'checkout-create',
    pathPrefix: '/api/v1/checkout/session',
    methods: ['POST'],
    max: 20,
    windowMs: 60_000,
  },
  {
    id: 'checkout-status',
    pathPrefix: '/api/v1/checkout/session-status',
    methods: ['GET'],
    max: 120,
    windowMs: 60_000,
  },
  {
    id: 'support-tickets',
    pathPrefix: '/api/v1/support/tickets',
    methods: ['POST'],
    max: 20,
    windowMs: 60_000,
  },
  {
    id: 'ai-chat',
    pathPrefix: '/api/v1/ai/chat',
    methods: ['POST'],
    max: 30,
    windowMs: 60_000,
  },
]

declare global {
  // eslint-disable-next-line no-var
  var __simoneRateLimitStore: Map<string, RateLimitState> | undefined
}

const rateLimitStore = globalThis.__simoneRateLimitStore ?? new Map<string, RateLimitState>()
globalThis.__simoneRateLimitStore = rateLimitStore

function apiBaseUrl(): string {
  const configured = process.env.INTERNAL_API_URL || process.env.NEXT_PUBLIC_API_URL
  if (configured) {
    return configured
  }

  if (process.env.NODE_ENV === 'production') {
    throw new Error('INTERNAL_API_URL or NEXT_PUBLIC_API_URL is required in production')
  }

  return 'http://localhost:8080'
}

function clientAddress(req: NextRequest): string {
  const raw =
    req.headers.get('cf-connecting-ip') ||
    req.headers.get('x-forwarded-for') ||
    req.headers.get('x-real-ip') ||
    'unknown'
  const ip = raw.split(',')[0]?.trim() || 'unknown'
  return ip
}

function resolveRateLimitRule(targetPath: string, method: string): RateLimitRule | null {
  if (process.env.NEXT_PUBLIC_DISABLE_WEB_RATE_LIMITS === 'true') {
    return null
  }

  const normalizedMethod = method.toUpperCase()
  for (const rule of RATE_LIMIT_RULES) {
    if (targetPath.startsWith(rule.pathPrefix) && rule.methods.includes(normalizedMethod)) {
      return rule
    }
  }
  return null
}

function applyRateLimit(req: NextRequest, rule: RateLimitRule): RateLimitResult {
  const now = Date.now()
  const key = `${rule.id}:${clientAddress(req)}`

  const current = rateLimitStore.get(key)
  if (!current || current.resetAt <= now) {
    const resetAt = now + rule.windowMs
    rateLimitStore.set(key, {
      count: 1,
      resetAt,
    })
    return {
      limit: rule.max,
      remaining: Math.max(rule.max - 1, 0),
      resetAt,
      retryAfterSeconds: Math.ceil(rule.windowMs / 1000),
      exceeded: false,
    }
  }

  if (current.count >= rule.max) {
    return {
      limit: rule.max,
      remaining: 0,
      resetAt: current.resetAt,
      retryAfterSeconds: Math.max(Math.ceil((current.resetAt - now) / 1000), 1),
      exceeded: true,
    }
  }

  current.count += 1
  rateLimitStore.set(key, current)
  return {
    limit: rule.max,
    remaining: Math.max(rule.max - current.count, 0),
    resetAt: current.resetAt,
    retryAfterSeconds: Math.max(Math.ceil((current.resetAt - now) / 1000), 1),
    exceeded: false,
  }
}

function toRetryAfterSeconds(resetAt: number): string {
  return String(Math.max(Math.ceil((resetAt - Date.now()) / 1000), 1))
}

function cacheControlFor(targetPath: string, method: string, status: number): string {
  if (method.toUpperCase() !== 'GET') {
    return 'private, no-store'
  }
  if (status >= 400) {
    return 'private, no-store'
  }

  if (targetPath === '/api/v1/catalog/products' || targetPath.startsWith('/api/v1/catalog/products/')) {
    return 'public, max-age=30, s-maxage=120, stale-while-revalidate=300'
  }
  if (targetPath === '/api/v1/catalog/categories' || targetPath === '/api/v1/promotions/active') {
    return 'public, max-age=60, s-maxage=180, stale-while-revalidate=300'
  }

  return 'private, no-store'
}

function applyResponseSecurityHeaders(headers: Headers) {
  headers.set('x-content-type-options', 'nosniff')
  headers.set('x-frame-options', 'DENY')
  headers.set('referrer-policy', 'strict-origin-when-cross-origin')
}

function forwardHeaders(req: NextRequest): Headers {
  const headers = new Headers()

  req.headers.forEach((value, key) => {
    const lower = key.toLowerCase()
    if (HOP_BY_HOP_HEADERS.has(lower)) {
      return
    }
    headers.set(key, value)
  })

  return headers
}

type ProxyOptions = {
  method?: string
  body?: BodyInit
}

export async function proxyRequest(
  req: NextRequest,
  targetPath: string,
  options?: ProxyOptions,
): Promise<NextResponse> {
  const base = apiBaseUrl().replace(/\/$/, '')
  const target = new URL(`${base}${targetPath}`)
  const incoming = new URL(req.url)
  target.search = incoming.search

  const method = options?.method || req.method
  const rateLimitRule = resolveRateLimitRule(targetPath, method)
  const rateLimitResult = rateLimitRule ? applyRateLimit(req, rateLimitRule) : null
  if (rateLimitResult?.exceeded) {
    const headers = new Headers({
      'content-type': 'application/json',
      'retry-after': toRetryAfterSeconds(rateLimitResult.resetAt),
      'x-ratelimit-limit': String(rateLimitResult.limit),
      'x-ratelimit-remaining': '0',
      'x-ratelimit-reset': String(rateLimitResult.resetAt),
    })
    applyResponseSecurityHeaders(headers)

    return NextResponse.json(
      {
        error: 'rate_limited',
        retry_after_seconds: rateLimitResult.retryAfterSeconds,
      },
      {
        status: 429,
        headers,
      },
    )
  }

  const headers = forwardHeaders(req)
  headers.set('x-forwarded-host', req.headers.get('host') || '')

  const init: RequestInit = {
    method,
    headers,
    redirect: 'manual',
  }

  if (options?.body !== undefined) {
    init.body = options.body
  } else if (!['GET', 'HEAD'].includes(method)) {
    init.body = await req.arrayBuffer()
  }

  const responseHeaders = new Headers()
  let timeoutHandle: ReturnType<typeof setTimeout> | null = null
  const controller = new AbortController()
  timeoutHandle = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS)
  init.signal = controller.signal

  let upstream: Response
  try {
    upstream = await fetch(target, init)
  } finally {
    if (timeoutHandle) {
      clearTimeout(timeoutHandle)
    }
  }

  upstream.headers.forEach((value, key) => {
    if (FORWARDED_RESPONSE_HEADERS.has(key.toLowerCase())) {
      responseHeaders.append(key, value)
    }
  })

  if (!responseHeaders.has('cache-control')) {
    responseHeaders.set('cache-control', cacheControlFor(targetPath, method, upstream.status))
  }

  if (rateLimitResult) {
    responseHeaders.set('x-ratelimit-limit', String(rateLimitResult.limit))
    responseHeaders.set('x-ratelimit-remaining', String(rateLimitResult.remaining))
    responseHeaders.set('x-ratelimit-reset', String(rateLimitResult.resetAt))
  }

  applyResponseSecurityHeaders(responseHeaders)

  const body = await upstream.text()
  return new NextResponse(body, {
    status: upstream.status,
    headers: responseHeaders,
  })
}
