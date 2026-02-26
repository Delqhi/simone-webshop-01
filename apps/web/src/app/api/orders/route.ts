export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { proxyRequest } from '@/lib/api/proxy'

const ORDER_ID_PATTERN = /^[a-zA-Z0-9_-]{1,120}$/

export async function GET(request: NextRequest) {
  try {
    const orderId = request.nextUrl.searchParams.get('id')
    if (orderId) {
      if (!ORDER_ID_PATTERN.test(orderId)) {
        return NextResponse.json({ error: 'invalid_order_id' }, { status: 400 })
      }
      return await proxyRequest(request, `/api/v1/orders/${encodeURIComponent(orderId)}`)
    }
    return await proxyRequest(request, '/api/v1/orders')
  } catch (error) {
    console.error('Orders proxy failed:', error)
    return NextResponse.json({ error: 'orders_proxy_failed' }, { status: 502 })
  }
}
