import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'

// Default settings structure
const DEFAULT_SETTINGS = {
  shop_name: 'Simones Shop',
  shop_description: 'Ihr Online-Shop für hochwertige Produkte',
  shop_email: 'info@simones-shop.de',
  shop_phone: '',
  shop_address: '',
  currency: 'EUR',
  currency_symbol: '€',
  language: 'de',
  timezone: 'Europe/Berlin',
  
  // Shipping
  free_shipping_threshold: 50,
  default_shipping_cost: 4.99,
  shipping_countries: ['DE', 'AT', 'CH'],
  estimated_delivery_days: '2-4',
  
  // Tax
  tax_rate: 19,
  tax_included: true,
  
  // Checkout
  payment_methods: ['stripe', 'paypal', 'klarna'],
  guest_checkout: true,
  
  // Legal
  return_days: 30,
  warranty_years: 2,
  
  // Social
  social_facebook: '',
  social_instagram: '',
  social_tiktok: '',
  social_youtube: '',
  
  // SEO
  meta_title: 'Simones Shop - Hochwertige Produkte online kaufen',
  meta_description: 'Entdecken Sie hochwertige Produkte zu fairen Preisen. Kostenloser Versand ab 50€. 30 Tage Rückgaberecht.',
  meta_keywords: 'online shop, kaufen, produkte',
  
  // Features
  ai_chat_enabled: true,
  reviews_enabled: true,
  wishlist_enabled: true,
  newsletter_enabled: true,
}

// GET /api/admin/settings - Get all shop settings
export async function GET() {
  try {
    const supabase = createServerClient()

    const { data, error } = await supabase
      .from('settings')
      .select('*')
      .single()

    if (error && error.code !== 'PGRST116') {
      console.error('Supabase error:', error)
      return NextResponse.json(
        { success: false, error: 'Einstellungen konnten nicht geladen werden' },
        { status: 500 }
      )
    }

    // Return stored settings merged with defaults
    const settings = data?.value ? { ...DEFAULT_SETTINGS, ...data.value } : DEFAULT_SETTINGS

    return NextResponse.json({ success: true, data: settings })
  } catch (error) {
    console.error('Settings API error:', error)
    return NextResponse.json(
      { success: false, error: 'Ein unerwarteter Fehler ist aufgetreten' },
      { status: 500 }
    )
  }
}

// PUT /api/admin/settings - Update shop settings
export async function PUT(request: NextRequest) {
  try {
    const supabase = createServerClient()
    const body = await request.json()

    // Get existing settings
    const { data: existing } = await supabase
      .from('settings')
      .select('*')
      .single()

    const currentSettings = existing?.value || {}
    const updatedSettings = { ...currentSettings, ...body }

    let result
    if (existing) {
      // Update existing
      const { data, error } = await supabase
        .from('settings')
        .update({ 
          value: updatedSettings, 
          updated_at: new Date().toISOString() 
        })
        .eq('id', existing.id)
        .select()
        .single()
      
      if (error) throw error
      result = data
    } else {
      // Create new
      const { data, error } = await supabase
        .from('settings')
        .insert({ 
          key: 'shop_settings', 
          value: updatedSettings 
        })
        .select()
        .single()
      
      if (error) throw error
      result = data
    }

    return NextResponse.json({ 
      success: true, 
      data: { ...DEFAULT_SETTINGS, ...result.value },
      message: 'Einstellungen erfolgreich gespeichert'
    })
  } catch (error) {
    console.error('Update settings error:', error)
    return NextResponse.json(
      { success: false, error: 'Einstellungen konnten nicht gespeichert werden' },
      { status: 500 }
    )
  }
}
