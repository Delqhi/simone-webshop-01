export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { proxyRequest } from '@/lib/api/proxy'

interface RouteParams {
  params: Promise<{ id: string }>
}

async function targetPath(params: Promise<{ id: string }>): Promise<string> {
  const { id } = await params
  return '/api/v1/admin/customers/' + encodeURIComponent(id)
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    return await proxyRequest(request, await targetPath(params))
  } catch (error) {
    console.error('Admin customers item GET proxy failed:', error)
    return NextResponse.json({ error: 'customers_item_proxy_failed' }, { status: 502 })
  }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    return await proxyRequest(request, await targetPath(params))
  } catch (error) {
    console.error('Admin customers item PUT proxy failed:', error)
    return NextResponse.json({ error: 'customers_item_proxy_failed' }, { status: 502 })
  }
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    return await proxyRequest(request, await targetPath(params))
  } catch (error) {
    console.error('Admin customers item PATCH proxy failed:', error)
    return NextResponse.json({ error: 'customers_item_proxy_failed' }, { status: 502 })
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    return await proxyRequest(request, await targetPath(params))
  } catch (error) {
    console.error('Admin customers item DELETE proxy failed:', error)
    return NextResponse.json({ error: 'customers_item_proxy_failed' }, { status: 502 })
  }
}
