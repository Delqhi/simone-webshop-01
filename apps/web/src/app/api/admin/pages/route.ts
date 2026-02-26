export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { proxyRequest } from '@/lib/api/proxy'

export async function GET(request: NextRequest) {
  try {
    return await proxyRequest(request, '/api/v1/admin/pages')
  } catch (error) {
    console.error('Admin pages GET proxy failed:', error)
    return NextResponse.json({ error: 'pages_proxy_failed' }, { status: 502 })
  }
}

export async function POST(request: NextRequest) {
  try {
    return await proxyRequest(request, '/api/v1/admin/pages')
  } catch (error) {
    console.error('Admin pages POST proxy failed:', error)
    return NextResponse.json({ error: 'pages_proxy_failed' }, { status: 502 })
  }
}
