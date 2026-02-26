export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { proxyRequest } from '@/lib/api/proxy'

export async function GET(request: NextRequest) {
  try {
    return await proxyRequest(request, '/api/v1/admin/channels')
  } catch (error) {
    console.error('Admin channels proxy failed:', error)
    return NextResponse.json({ error: 'channels_proxy_failed' }, { status: 502 })
  }
}
