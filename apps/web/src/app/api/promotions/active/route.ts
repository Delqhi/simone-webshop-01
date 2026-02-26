export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { proxyRequest } from '@/lib/api/proxy'

export async function GET(request: NextRequest) {
  try {
    return await proxyRequest(request, '/api/v1/promotions/active')
  } catch (error) {
    console.error('Promotions active proxy failed:', error)
    return NextResponse.json({ error: 'promotions_active_proxy_failed' }, { status: 502 })
  }
}
