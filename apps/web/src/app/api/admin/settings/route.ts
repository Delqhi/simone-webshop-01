export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { proxyRequest } from '@/lib/api/proxy'

export async function GET(request: NextRequest) {
  try {
    return await proxyRequest(request, '/api/v1/admin/settings')
  } catch (error) {
    console.error('Admin settings GET proxy failed:', error)
    return NextResponse.json({ error: 'settings_proxy_failed' }, { status: 502 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    return await proxyRequest(request, '/api/v1/admin/settings')
  } catch (error) {
    console.error('Admin settings PUT proxy failed:', error)
    return NextResponse.json({ error: 'settings_proxy_failed' }, { status: 502 })
  }
}

export async function PATCH(request: NextRequest) {
  try {
    return await proxyRequest(request, '/api/v1/admin/settings')
  } catch (error) {
    console.error('Admin settings PATCH proxy failed:', error)
    return NextResponse.json({ error: 'settings_proxy_failed' }, { status: 502 })
  }
}
