export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { proxyRequest } from '@/lib/api/proxy'

interface RouteParams {
  params: Promise<{ id: string }>
}

async function targetPath(params: Promise<{ id: string }>): Promise<string> {
  const { id } = await params
  return '/api/v1/admin/promotions/' + encodeURIComponent(id)
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    return await proxyRequest(request, await targetPath(params))
  } catch (error) {
    console.error('Admin promotions item GET proxy failed:', error)
    return NextResponse.json({ error: 'promotions_item_proxy_failed' }, { status: 502 })
  }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    return await proxyRequest(request, await targetPath(params))
  } catch (error) {
    console.error('Admin promotions item PUT proxy failed:', error)
    return NextResponse.json({ error: 'promotions_item_proxy_failed' }, { status: 502 })
  }
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    return await proxyRequest(request, await targetPath(params))
  } catch (error) {
    console.error('Admin promotions item PATCH proxy failed:', error)
    return NextResponse.json({ error: 'promotions_item_proxy_failed' }, { status: 502 })
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    return await proxyRequest(request, await targetPath(params))
  } catch (error) {
    console.error('Admin promotions item DELETE proxy failed:', error)
    return NextResponse.json({ error: 'promotions_item_proxy_failed' }, { status: 502 })
  }
}
