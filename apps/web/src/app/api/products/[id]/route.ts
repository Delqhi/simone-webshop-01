export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { proxyRequest } from '@/lib/api/proxy'

type Params = {
  params: {
    id: string
  }
}

export async function GET(request: NextRequest, { params }: Params) {
  try {
    return await proxyRequest(request, `/api/v1/catalog/products/${params.id}`)
  } catch (error) {
    console.error('Product detail proxy failed:', error)
    return NextResponse.json({ error: 'product_detail_proxy_failed' }, { status: 502 })
  }
}
