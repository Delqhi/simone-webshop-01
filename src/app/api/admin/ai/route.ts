import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co',
  process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder-key'
)

export interface AIConfig {
  id: string
  provider: 'opencode-zen' | 'mistral' | 'groq' | 'gemini'
  model: string
  personality: 'friendly' | 'professional' | 'casual'
  language: 'de' | 'en' | 'auto'
  systemPrompt: string
  temperature: number
  maxTokens: number
  welcomeMessage: string
  fallbackMessage: string
  enabledFeatures: {
    productRecommendations: boolean
    orderTracking: boolean
    faq: boolean
    humanHandoff: boolean
  }
  workingHours: {
    enabled: boolean
    start: string
    end: string
    timezone: string
    offlineMessage: string
  }
  updatedAt: string
}

const DEFAULT_CONFIG: Omit<AIConfig, 'id' | 'updatedAt'> = {
  provider: 'opencode-zen',
  model: 'grok-code',
  personality: 'friendly',
  language: 'de',
  systemPrompt: `Du bist der freundliche KI-Assistent für unseren Online-Shop. Du hilfst Kunden auf Deutsch bei:

1. **Produktberatung**: Empfiehlst passende Produkte basierend auf den Kundenwünschen
2. **Bestellstatus**: Gibst Auskunft über Bestellungen (wenn Bestellnummer genannt wird)
3. **Versandfragen**: Informierst über Lieferzeiten und Versandkosten
4. **Rückgaben**: Erklärst das 30-Tage-Rückgaberecht
5. **Allgemeine Fragen**: Beantwortest Fragen zum Shop

**Wichtige Infos:**
- Kostenloser Versand ab 50€ Bestellwert
- Lieferzeit: 2-4 Werktage
- 30 Tage Rückgaberecht
- Sichere Zahlung mit Stripe, PayPal, Klarna
- 2 Jahre Garantie auf alle Produkte

**Stil:**
- Freundlich und hilfsbereit
- Kurze, prägnante Antworten
- Verwende Emojis sparsam aber passend`,
  temperature: 0.7,
  maxTokens: 500,
  welcomeMessage: 'Hallo! 👋 Wie kann ich dir heute helfen?',
  fallbackMessage: 'Entschuldigung, ich bin gerade nicht erreichbar. Bitte versuche es später erneut oder kontaktiere unseren Support.',
  enabledFeatures: {
    productRecommendations: true,
    orderTracking: true,
    faq: true,
    humanHandoff: false,
  },
  workingHours: {
    enabled: false,
    start: '09:00',
    end: '18:00',
    timezone: 'Europe/Berlin',
    offlineMessage: 'Unser Chat ist derzeit offline. Wir sind Mo-Fr von 9-18 Uhr erreichbar.',
  },
}

const PROVIDER_MODELS: Record<string, { name: string; models: { id: string; name: string }[] }> = {
  'opencode-zen': {
    name: 'OpenCode Zen (Kostenlos)',
    models: [
      { id: 'grok-code', name: 'Grok Code' },
      { id: 'zen/big-pickle', name: 'Big Pickle (Uncensored)' },
    ],
  },
  'mistral': {
    name: 'Mistral (Kostenlos)',
    models: [
      { id: 'mistral-small-latest', name: 'Mistral Small' },
      { id: 'mistral-medium-latest', name: 'Mistral Medium' },
    ],
  },
  'groq': {
    name: 'Groq (Kostenlos)',
    models: [
      { id: 'llama-3.3-70b-versatile', name: 'Llama 3.3 70B' },
      { id: 'mixtral-8x7b-32768', name: 'Mixtral 8x7B' },
    ],
  },
  'gemini': {
    name: 'Gemini (Kostenlos)',
    models: [
      { id: 'gemini-2.0-flash-exp', name: 'Gemini 2.0 Flash' },
      { id: 'gemini-1.5-pro', name: 'Gemini 1.5 Pro' },
    ],
  },
}

export async function GET() {
  try {
    const { data: config, error } = await supabase
      .from('ai_config')
      .select('*')
      .single()

    if (error && error.code !== 'PGRST116') {
      console.error('Error fetching AI config:', error)
    }

    const currentConfig = config || { ...DEFAULT_CONFIG, id: 'default', updatedAt: new Date().toISOString() }

    return NextResponse.json({
      config: currentConfig,
      providers: PROVIDER_MODELS,
      personalities: [
        { id: 'friendly', name: 'Freundlich & Hilfsbereit', description: 'Warmherziger Ton mit Emojis' },
        { id: 'professional', name: 'Professionell', description: 'Sachlicher, geschäftsmäßiger Ton' },
        { id: 'casual', name: 'Locker & Ungezwungen', description: 'Entspannter, jugendlicher Ton' },
      ],
      languages: [
        { id: 'de', name: 'Deutsch' },
        { id: 'en', name: 'Englisch' },
        { id: 'auto', name: 'Auto-Erkennung' },
      ],
    })
  } catch (error) {
    console.error('AI config GET error:', error)
    return NextResponse.json(
      { error: 'Fehler beim Laden der KI-Konfiguration' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()

    const validProviders = ['opencode-zen', 'mistral', 'groq', 'gemini']
    if (body.provider && !validProviders.includes(body.provider)) {
      return NextResponse.json(
        { error: 'Ungültiger KI-Provider' },
        { status: 400 }
      )
    }

    if (body.temperature !== undefined && (body.temperature < 0 || body.temperature > 2)) {
      return NextResponse.json(
        { error: 'Temperatur muss zwischen 0 und 2 liegen' },
        { status: 400 }
      )
    }

    if (body.maxTokens !== undefined && (body.maxTokens < 100 || body.maxTokens > 4000)) {
      return NextResponse.json(
        { error: 'Max Tokens muss zwischen 100 und 4000 liegen' },
        { status: 400 }
      )
    }

    const { data: existingConfig } = await supabase
      .from('ai_config')
      .select('id')
      .single()

    const configData = {
      ...body,
      updatedAt: new Date().toISOString(),
    }

    let result
    if (existingConfig) {
      result = await supabase
        .from('ai_config')
        .update(configData)
        .eq('id', existingConfig.id)
        .select()
        .single()
    } else {
      result = await supabase
        .from('ai_config')
        .insert({ ...configData, id: 'default' })
        .select()
        .single()
    }

    if (result.error) {
      console.error('Error saving AI config:', result.error)
      return NextResponse.json(
        { error: 'Fehler beim Speichern der Konfiguration' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      config: result.data,
      message: 'KI-Konfiguration erfolgreich gespeichert',
    })
  } catch (error) {
    console.error('AI config PUT error:', error)
    return NextResponse.json(
      { error: 'Fehler beim Aktualisieren der KI-Konfiguration' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const { action } = await request.json()

    if (action === 'test') {
      const { data: config } = await supabase
        .from('ai_config')
        .select('*')
        .single()

      const currentConfig = config || DEFAULT_CONFIG
      
      const testMessage = 'Hallo, ich möchte wissen welche Produkte ihr habt.'
      
      let apiUrl: string
      let headers: Record<string, string>
      let body: Record<string, unknown>

      switch (currentConfig.provider) {
        case 'opencode-zen':
          apiUrl = 'https://api.opencode.ai/v1/chat/completions'
          headers = {
            'Authorization': `Bearer ${process.env.OPENCODE_ZEN_API_KEY}`,
            'Content-Type': 'application/json',
          }
          body = {
            model: currentConfig.model,
            messages: [
              { role: 'system', content: currentConfig.systemPrompt },
              { role: 'user', content: testMessage },
            ],
            temperature: currentConfig.temperature,
            max_tokens: currentConfig.maxTokens,
          }
          break
        case 'groq':
          apiUrl = 'https://api.groq.com/openai/v1/chat/completions'
          headers = {
            'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
            'Content-Type': 'application/json',
          }
          body = {
            model: currentConfig.model,
            messages: [
              { role: 'system', content: currentConfig.systemPrompt },
              { role: 'user', content: testMessage },
            ],
            temperature: currentConfig.temperature,
            max_tokens: currentConfig.maxTokens,
          }
          break
        case 'mistral':
          apiUrl = 'https://api.mistral.ai/v1/chat/completions'
          headers = {
            'Authorization': `Bearer ${process.env.MISTRAL_API_KEY}`,
            'Content-Type': 'application/json',
          }
          body = {
            model: currentConfig.model,
            messages: [
              { role: 'system', content: currentConfig.systemPrompt },
              { role: 'user', content: testMessage },
            ],
            temperature: currentConfig.temperature,
            max_tokens: currentConfig.maxTokens,
          }
          break
        case 'gemini':
          apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${currentConfig.model}:generateContent?key=${process.env.GEMINI_API_KEY}`
          headers = { 'Content-Type': 'application/json' }
          body = {
            contents: [{ parts: [{ text: `${currentConfig.systemPrompt}\n\nUser: ${testMessage}` }] }],
            generationConfig: {
              temperature: currentConfig.temperature,
              maxOutputTokens: currentConfig.maxTokens,
            },
          }
          break
        default:
          return NextResponse.json({ error: 'Unbekannter Provider' }, { status: 400 })
      }

      const startTime = Date.now()
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers,
        body: JSON.stringify(body),
      })
      const latency = Date.now() - startTime

      if (!response.ok) {
        const errorText = await response.text()
        return NextResponse.json({
          success: false,
          error: `API-Fehler: ${response.status}`,
          details: errorText,
          latency,
        })
      }

      const data = await response.json()
      let assistantMessage: string

      if (currentConfig.provider === 'gemini') {
        assistantMessage = data.candidates?.[0]?.content?.parts?.[0]?.text || 'Keine Antwort'
      } else {
        assistantMessage = data.choices?.[0]?.message?.content || 'Keine Antwort'
      }

      return NextResponse.json({
        success: true,
        testMessage,
        response: assistantMessage,
        latency,
        provider: currentConfig.provider,
        model: currentConfig.model,
      })
    }

    if (action === 'reset') {
      const { error } = await supabase
        .from('ai_config')
        .upsert({ ...DEFAULT_CONFIG, id: 'default', updatedAt: new Date().toISOString() })

      if (error) {
        return NextResponse.json({ error: 'Fehler beim Zurücksetzen' }, { status: 500 })
      }

      return NextResponse.json({
        success: true,
        config: { ...DEFAULT_CONFIG, id: 'default', updatedAt: new Date().toISOString() },
        message: 'KI-Konfiguration auf Standard zurückgesetzt',
      })
    }

    return NextResponse.json({ error: 'Unbekannte Aktion' }, { status: 400 })
  } catch (error) {
    console.error('AI config POST error:', error)
    return NextResponse.json(
      { error: 'Fehler bei der Aktion' },
      { status: 500 }
    )
  }
}
