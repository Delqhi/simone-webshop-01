export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { proxyRequest } from '@/lib/api/proxy'

export async function GET(request: NextRequest) {
  try {
    return await proxyRequest(request, '/api/v1/analytics/funnel')
  } catch (error) {
    console.error('Analytics funnel proxy failed:', error)
    return NextResponse.json({ error: 'analytics_funnel_proxy_failed' }, { status: 502 })
  }
}
