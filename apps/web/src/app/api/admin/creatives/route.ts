export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { proxyRequest } from '@/lib/api/proxy'

export async function GET(request: NextRequest) {
  try {
    return await proxyRequest(request, '/api/v1/admin/creatives')
  } catch (error) {
    console.error('Admin creatives GET proxy failed:', error)
    return NextResponse.json({ error: 'creatives_proxy_failed' }, { status: 502 })
  }
}

export async function POST(request: NextRequest) {
  try {
    return await proxyRequest(request, '/api/v1/admin/creatives', { method: 'POST' })
  } catch (error) {
    console.error('Admin creatives POST proxy failed:', error)
    return NextResponse.json({ error: 'creatives_proxy_failed' }, { status: 502 })
  }
}
