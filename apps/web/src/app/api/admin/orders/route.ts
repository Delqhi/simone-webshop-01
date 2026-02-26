export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { proxyRequest } from '@/lib/api/proxy'

export async function GET(request: NextRequest) {
  try {
    return await proxyRequest(request, '/api/v1/admin/orders')
  } catch (error) {
    console.error('Admin orders proxy failed:', error)
    return NextResponse.json({ success: false, error: 'admin_orders_proxy_failed' }, { status: 502 })
  }
}
