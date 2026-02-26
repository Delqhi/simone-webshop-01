export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { proxyRequest } from '@/lib/api/proxy'

type RouteCtx = { params: { channel: string } }

export async function POST(request: NextRequest, context: RouteCtx) {
  try {
    return await proxyRequest(request, `/api/v1/admin/channels/${context.params.channel}/events/ingest`, { method: 'POST' })
  } catch (error) {
    console.error('Admin channel events ingest proxy failed:', error)
    return NextResponse.json({ error: 'channel_events_ingest_proxy_failed' }, { status: 502 })
  }
}
