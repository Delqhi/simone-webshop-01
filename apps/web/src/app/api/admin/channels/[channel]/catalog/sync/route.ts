export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { proxyRequest } from '@/lib/api/proxy'

interface RouteParams {
  params: Promise<{ channel: string }>
}

export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const { channel } = await params
    return await proxyRequest(request, `/api/v1/admin/channels/${encodeURIComponent(channel)}/catalog/sync`, {
      method: 'POST',
    })
  } catch (error) {
    console.error('Admin channel catalog sync proxy failed:', error)
    return NextResponse.json({ error: 'channel_catalog_sync_proxy_failed' }, { status: 502 })
  }
}
