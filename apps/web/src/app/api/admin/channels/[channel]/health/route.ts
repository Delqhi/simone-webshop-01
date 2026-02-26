export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { proxyRequest } from '@/lib/api/proxy'

type RouteCtx = { params: { channel: string } }

export async function GET(request: NextRequest, context: RouteCtx) {
  try {
    return await proxyRequest(request, `/api/v1/admin/channels/${context.params.channel}/health`)
  } catch (error) {
    console.error('Admin channel health proxy failed:', error)
    return NextResponse.json({ error: 'channel_health_proxy_failed' }, { status: 502 })
  }
}
