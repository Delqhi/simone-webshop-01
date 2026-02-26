export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { proxyRequest } from '@/lib/api/proxy'

interface RouteParams {
  params: Promise<{ id: string }>
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params
    return await proxyRequest(request, `/api/v1/admin/orders/${id}/supplier-orders`)
  } catch (error) {
    console.error('Admin supplier orders proxy failed:', error)
    return NextResponse.json({ error: 'supplier_orders_proxy_failed' }, { status: 502 })
  }
}
