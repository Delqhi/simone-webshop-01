export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { proxyRequest } from '@/lib/api/proxy'

export async function GET(request: NextRequest) {
  try {
    return await proxyRequest(request, '/api/v1/admin/attribution/summary')
  } catch (error) {
    console.error('Admin attribution summary proxy failed:', error)
    return NextResponse.json({ error: 'attribution_summary_proxy_failed' }, { status: 502 })
  }
}
