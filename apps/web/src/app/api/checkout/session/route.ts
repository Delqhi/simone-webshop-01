export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { proxyRequest } from '@/lib/api/proxy'

export async function POST(request: NextRequest) {
  try {
    return await proxyRequest(request, '/api/v1/checkout/session')
  } catch (error) {
    console.error('Checkout session proxy failed:', error)
    return NextResponse.json({ error: 'checkout_session_proxy_failed' }, { status: 502 })
  }
}
