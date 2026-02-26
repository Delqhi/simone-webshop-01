export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { proxyRequest } from '@/lib/api/proxy'

interface RouteParams {
  params: Promise<{ id: string }>
}

export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params
    return await proxyRequest(request, `/api/v1/admin/orders/${id}/supplier-dispatch`, { method: 'POST' })
  } catch (error) {
    console.error('Admin supplier dispatch proxy failed:', error)
    return NextResponse.json({ error: 'supplier_dispatch_proxy_failed' }, { status: 502 })
  }
}
