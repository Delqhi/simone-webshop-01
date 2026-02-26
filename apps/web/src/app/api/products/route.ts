export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { proxyRequest } from '@/lib/api/proxy'

export async function GET(request: NextRequest) {
  try {
    return await proxyRequest(request, '/api/v1/catalog/products')
  } catch (error) {
    console.error('Catalog proxy failed:', error)
    return NextResponse.json({ error: 'catalog_proxy_failed' }, { status: 502 })
  }
}
