export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { proxyRequest } from '@/lib/api/proxy'

interface RouteParams {
  params: Promise<{ domain: string }>
}

export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const { domain } = await params
    return await proxyRequest(request, `/api/v1/admin/kill-switch/${encodeURIComponent(domain)}`, {
      method: 'POST',
    })
  } catch (error) {
    console.error('Admin kill-switch proxy failed:', error)
    return NextResponse.json({ error: 'kill_switch_proxy_failed' }, { status: 502 })
  }
}
