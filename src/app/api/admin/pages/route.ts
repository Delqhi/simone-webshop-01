import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'

// GET /api/admin/pages - List all pages (legal, info pages)
export async function GET() {
  try {
    const supabase = createServerClient()

    const { data, error } = await supabase
      .from('pages')
      .select('*')
      .order('title', { ascending: true })

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json(
        { success: false, error: 'Seiten konnten nicht geladen werden' },
        { status: 500 }
      )
    }

    // Return pages or default structure if empty
    const pages = data?.length ? data : [
      { id: 'impressum', slug: 'impressum', title: 'Impressum', content: '', is_published: false },
      { id: 'datenschutz', slug: 'datenschutz', title: 'Datenschutzerklärung', content: '', is_published: false },
      { id: 'agb', slug: 'agb', title: 'Allgemeine Geschäftsbedingungen', content: '', is_published: false },
      { id: 'widerruf', slug: 'widerrufsbelehrung', title: 'Widerrufsbelehrung', content: '', is_published: false },
      { id: 'versand', slug: 'versand', title: 'Versand & Lieferung', content: '', is_published: false },
      { id: 'kontakt', slug: 'kontakt', title: 'Kontakt', content: '', is_published: false },
      { id: 'ueber-uns', slug: 'ueber-uns', title: 'Über uns', content: '', is_published: false },
      { id: 'faq', slug: 'faq', title: 'Häufige Fragen (FAQ)', content: '', is_published: false },
    ]

    return NextResponse.json({ success: true, data: pages })
  } catch (error) {
    console.error('Pages API error:', error)
    return NextResponse.json(
      { success: false, error: 'Ein unerwarteter Fehler ist aufgetreten' },
      { status: 500 }
    )
  }
}

// POST /api/admin/pages - Create new page
export async function POST(request: NextRequest) {
  try {
    const supabase = createServerClient()
    const body = await request.json()

    if (!body.title || !body.slug) {
      return NextResponse.json(
        { success: false, error: 'Titel und Slug sind erforderlich' },
        { status: 400 }
      )
    }

    // Check if slug exists
    const { data: existing } = await supabase
      .from('pages')
      .select('id')
      .eq('slug', body.slug)
      .single()

    if (existing) {
      return NextResponse.json(
        { success: false, error: 'Dieser Slug existiert bereits' },
        { status: 400 }
      )
    }

    const { data, error } = await supabase
      .from('pages')
      .insert({
        title: body.title,
        slug: body.slug,
        content: body.content || '',
        meta_title: body.meta_title || body.title,
        meta_description: body.meta_description || '',
        is_published: body.is_published ?? false,
        page_type: body.page_type || 'custom',
      })
      .select()
      .single()

    if (error) {
      console.error('Supabase insert error:', error)
      return NextResponse.json(
        { success: false, error: 'Seite konnte nicht erstellt werden' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true, data }, { status: 201 })
  } catch (error) {
    console.error('Create page error:', error)
    return NextResponse.json(
      { success: false, error: 'Ein unerwarteter Fehler ist aufgetreten' },
      { status: 500 }
    )
  }
}
