export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { proxyRequest } from '@/lib/api/proxy'

export async function GET(request: NextRequest) {
  try {
    return await proxyRequest(request, '/api/v1/admin/affiliate/offers')
  } catch (error) {
    console.error('Admin affiliate offers GET proxy failed:', error)
    return NextResponse.json({ error: 'affiliate_offers_proxy_failed' }, { status: 502 })
  }
}

export async function POST(request: NextRequest) {
  try {
    return await proxyRequest(request, '/api/v1/admin/affiliate/offers', { method: 'POST' })
  } catch (error) {
    console.error('Admin affiliate offers POST proxy failed:', error)
    return NextResponse.json({ error: 'affiliate_offers_proxy_failed' }, { status: 502 })
  }
}
