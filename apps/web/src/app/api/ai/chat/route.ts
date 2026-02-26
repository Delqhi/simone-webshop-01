export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { proxyRequest } from '@/lib/api/proxy'

export async function POST(request: NextRequest) {
  try {
    return await proxyRequest(request, '/api/v1/ai/chat')
  } catch (error) {
    console.error('AI chat proxy failed:', error)
    return NextResponse.json({ error: 'ai_chat_proxy_failed' }, { status: 502 })
  }
}

export async function GET() {
  return NextResponse.json({ status: 'ok', route: 'ai-chat-proxy' })
}
