export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { AnalyticsEventSchema } from '@simone/contracts'
import { proxyRequest } from '@/lib/api/proxy'

export async function POST(request: NextRequest) {
  try {
    const event = AnalyticsEventSchema.parse(await request.json())

    return await proxyRequest(request, '/api/v1/analytics/events', {
      method: 'POST',
      body: JSON.stringify(event),
    })
  } catch (error) {
    console.error('analytics_ingest_failed', error)
    return NextResponse.json({ error: 'invalid_analytics_payload' }, { status: 400 })
  }
}

export async function GET() {
  return NextResponse.json({
    status: 'ok',
    route: 'analytics',
    endpoints: ['/api/analytics/funnel', '/api/analytics/alerts', '/api/analytics/experiments'],
  })
}
