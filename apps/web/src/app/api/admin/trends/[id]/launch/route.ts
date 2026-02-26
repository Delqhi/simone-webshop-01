export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { proxyRequest } from '@/lib/api/proxy'

interface RouteParams {
  params: Promise<{ id: string }>
}

export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params
    return await proxyRequest(request, `/api/v1/admin/trends/${id}/launch`, { method: 'POST' })
  } catch (error) {
    console.error('Admin trend launch proxy failed:', error)
    return NextResponse.json({ error: 'trend_launch_proxy_failed' }, { status: 502 })
  }
}
