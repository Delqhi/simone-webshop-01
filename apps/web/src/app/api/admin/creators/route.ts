export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { proxyRequest } from '@/lib/api/proxy'

export async function GET(request: NextRequest) {
  try {
    return await proxyRequest(request, '/api/v1/admin/creators')
  } catch (error) {
    console.error('Admin creators GET proxy failed:', error)
    return NextResponse.json({ error: 'creators_proxy_failed' }, { status: 502 })
  }
}

export async function POST(request: NextRequest) {
  try {
    return await proxyRequest(request, '/api/v1/admin/creators', { method: 'POST' })
  } catch (error) {
    console.error('Admin creators POST proxy failed:', error)
    return NextResponse.json({ error: 'creators_proxy_failed' }, { status: 502 })
  }
}
