export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { proxyRequest } from '@/lib/api/proxy'

export async function GET(request: NextRequest) {
  try {
    return await proxyRequest(request, '/api/v1/admin/promotions')
  } catch (error) {
    console.error('Admin promotions GET proxy failed:', error)
    return NextResponse.json({ error: 'promotions_proxy_failed' }, { status: 502 })
  }
}

export async function POST(request: NextRequest) {
  try {
    return await proxyRequest(request, '/api/v1/admin/promotions')
  } catch (error) {
    console.error('Admin promotions POST proxy failed:', error)
    return NextResponse.json({ error: 'promotions_proxy_failed' }, { status: 502 })
  }
}
