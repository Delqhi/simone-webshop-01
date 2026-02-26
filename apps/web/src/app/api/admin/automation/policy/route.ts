export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { proxyRequest } from '@/lib/api/proxy'

export async function GET(request: NextRequest) {
  try {
    return await proxyRequest(request, '/api/v1/admin/automation/policy')
  } catch (error) {
    console.error('Admin automation policy proxy failed:', error)
    return NextResponse.json({ error: 'automation_policy_proxy_failed' }, { status: 502 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    return await proxyRequest(request, '/api/v1/admin/automation/policy', { method: 'PUT' })
  } catch (error) {
    console.error('Admin automation policy update proxy failed:', error)
    return NextResponse.json({ error: 'automation_policy_update_proxy_failed' }, { status: 502 })
  }
}
