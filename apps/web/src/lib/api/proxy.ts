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
  const headers = forwardHeaders(req)

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

  const upstream = await fetch(target, init)
  const contentType = upstream.headers.get('content-type') || ''
  const responseHeaders = new Headers()

  if (contentType) {
    responseHeaders.set('content-type', contentType)
  }

  const deprecation = upstream.headers.get('deprecation')
  if (deprecation) {
    responseHeaders.set('deprecation', deprecation)
  }

  const sunset = upstream.headers.get('sunset')
  if (sunset) {
    responseHeaders.set('sunset', sunset)
  }

  const body = await upstream.text()
  return new NextResponse(body, {
    status: upstream.status,
    headers: responseHeaders,
  })
}
