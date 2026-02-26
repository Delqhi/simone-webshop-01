export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { proxyRequest } from '@/lib/api/proxy'

interface RouteParams {
  params: Promise<{ id: string }>
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params
    return await proxyRequest(request, `/api/v1/admin/orders/${id}`)
  } catch (error) {
    console.error('Admin order detail proxy failed:', error)
    return NextResponse.json({ success: false, error: 'admin_order_proxy_failed' }, { status: 502 })
  }
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params
    return await proxyRequest(request, `/api/v1/admin/orders/${id}`, { method: 'PATCH' })
  } catch (error) {
    console.error('Admin order update proxy failed:', error)
    return NextResponse.json({ success: false, error: 'admin_order_update_proxy_failed' }, { status: 502 })
  }
}
