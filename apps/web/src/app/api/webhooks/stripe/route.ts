export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { proxyRequest } from '@/lib/api/proxy'

export async function POST(request: NextRequest) {
  try {
    return await proxyRequest(request, '/api/v1/webhooks/stripe')
  } catch (error) {
    console.error('Stripe webhook proxy failed:', error)
    return NextResponse.json({ error: 'stripe_webhook_proxy_failed' }, { status: 502 })
  }
}

export async function GET() {
  return NextResponse.json({ status: 'ok', route: 'stripe-webhook-proxy' })
}
