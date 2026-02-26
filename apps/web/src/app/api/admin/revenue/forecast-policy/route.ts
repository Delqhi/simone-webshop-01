export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { proxyRequest } from '@/lib/api/proxy'

export async function GET(request: NextRequest) {
  try {
    return await proxyRequest(request, '/api/v1/admin/revenue/forecast-policy')
  } catch (error) {
    console.error('Admin revenue forecast policy GET proxy failed:', error)
    return NextResponse.json({ error: 'revenue_forecast_policy_proxy_failed' }, { status: 502 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    return await proxyRequest(request, '/api/v1/admin/revenue/forecast-policy', { method: 'PUT' })
  } catch (error) {
    console.error('Admin revenue forecast policy PUT proxy failed:', error)
    return NextResponse.json({ error: 'revenue_forecast_policy_proxy_failed' }, { status: 502 })
  }
}
