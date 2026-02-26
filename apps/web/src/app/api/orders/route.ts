export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { proxyRequest } from '@/lib/api/proxy'

export async function GET(request: NextRequest) {
  try {
    const orderId = request.nextUrl.searchParams.get('id')
    if (orderId) {
      return await proxyRequest(request, `/api/v1/orders/${orderId}`)
    }
    return await proxyRequest(request, '/api/v1/orders')
  } catch (error) {
    console.error('Orders proxy failed:', error)
    return NextResponse.json({ error: 'orders_proxy_failed' }, { status: 502 })
  }
}
