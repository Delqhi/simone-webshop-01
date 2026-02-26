export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { proxyRequest } from '@/lib/api/proxy'

export async function GET(request: NextRequest) {
  try {
    return await proxyRequest(request, '/api/v1/analytics/alerts')
  } catch (error) {
    console.error('Analytics alerts proxy failed:', error)
    return NextResponse.json({ error: 'analytics_alerts_proxy_failed' }, { status: 502 })
  }
}
