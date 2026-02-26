export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { proxyRequest } from '@/lib/api/proxy'

export async function GET(request: NextRequest) {
  try {
    return await proxyRequest(request, '/api/v1/admin/trends/performance')
  } catch (error) {
    console.error('Admin trend performance proxy failed:', error)
    return NextResponse.json({ error: 'trend_performance_proxy_failed' }, { status: 502 })
  }
}
