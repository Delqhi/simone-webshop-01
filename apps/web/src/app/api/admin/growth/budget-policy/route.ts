export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { proxyRequest } from '@/lib/api/proxy'

export async function GET(request: NextRequest) {
  try {
    return await proxyRequest(request, '/api/v1/admin/growth/budget-policy')
  } catch (error) {
    console.error('Admin growth budget GET proxy failed:', error)
    return NextResponse.json({ error: 'growth_budget_proxy_failed' }, { status: 502 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    return await proxyRequest(request, '/api/v1/admin/growth/budget-policy', { method: 'PUT' })
  } catch (error) {
    console.error('Admin growth budget PUT proxy failed:', error)
    return NextResponse.json({ error: 'growth_budget_proxy_failed' }, { status: 502 })
  }
}
