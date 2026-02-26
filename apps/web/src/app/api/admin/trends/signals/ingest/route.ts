export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { proxyRequest } from '@/lib/api/proxy'

export async function POST(request: NextRequest) {
  try {
    return await proxyRequest(request, '/api/v1/admin/trends/signals/ingest', { method: 'POST' })
  } catch (error) {
    console.error('Admin trend signals ingest proxy failed:', error)
    return NextResponse.json({ error: 'trend_signals_ingest_proxy_failed' }, { status: 502 })
  }
}
