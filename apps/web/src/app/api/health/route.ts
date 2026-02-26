import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

const API_BASE_URL = process.env.INTERNAL_API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'

export async function GET() {
  const startedAt = Date.now()

  try {
    const response = await fetch(`${API_BASE_URL.replace(/\/$/, '')}/ready`, {
      method: 'GET',
      cache: 'no-store',
    })

    const durationMs = Date.now() - startedAt

    if (!response.ok) {
      return NextResponse.json(
        {
          status: 'degraded',
          web: 'ok',
          api: 'unhealthy',
          latency_ms: durationMs,
        },
        { status: 503 },
      )
    }

    return NextResponse.json({
      status: 'ok',
      web: 'ok',
      api: 'ok',
      latency_ms: durationMs,
    })
  } catch (error) {
    console.error('Health proxy failed:', error)
    return NextResponse.json(
      {
        status: 'degraded',
        web: 'ok',
        api: 'unreachable',
      },
      { status: 503 },
    )
  }
}
