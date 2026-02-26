export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { proxyRequest } from '@/lib/api/proxy'

export async function GET(request: NextRequest) {
  try {
    return await proxyRequest(request, '/api/v1/account/me')
  } catch (error) {
    console.error('Account me GET proxy failed:', error)
    return NextResponse.json({ error: 'account_me_proxy_failed' }, { status: 502 })
  }
}

export async function PATCH(request: NextRequest) {
  try {
    return await proxyRequest(request, '/api/v1/account/me')
  } catch (error) {
    console.error('Account me PATCH proxy failed:', error)
    return NextResponse.json({ error: 'account_me_proxy_failed' }, { status: 502 })
  }
}
