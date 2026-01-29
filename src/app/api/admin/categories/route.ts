import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'

// GET /api/admin/categories - List all categories
export async function GET(request: NextRequest) {
  try {
    const supabase = createServerClient()
    const { searchParams } = new URL(request.url)
    
    const includeProducts = searchParams.get('include_products') === 'true'

    let query = supabase.from('categories').select(
      includeProducts 
        ? '*, products(count)' 
        : '*'
    )

    query = query.order('name', { ascending: true })

    const { data, error } = await query

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json(
        { success: false, error: 'Kategorien konnten nicht geladen werden' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error('Categories API error:', error)
    return NextResponse.json(
      { success: false, error: 'Ein unerwarteter Fehler ist aufgetreten' },
      { status: 500 }
    )
  }
}

// POST /api/admin/categories - Create new category
export async function POST(request: NextRequest) {
  try {
    const supabase = createServerClient()
    const body = await request.json()

    if (!body.name || !body.slug) {
      return NextResponse.json(
        { success: false, error: 'Name und Slug sind erforderlich' },
        { status: 400 }
      )
    }

    // Check if slug already exists
    const { data: existing } = await supabase
      .from('categories')
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
      .from('categories')
      .insert({
        name: body.name,
        slug: body.slug,
        description: body.description || null,
        image: body.image || null,
        parent_id: body.parent_id || null,
      })
      .select()
      .single()

    if (error) {
      console.error('Supabase insert error:', error)
      return NextResponse.json(
        { success: false, error: 'Kategorie konnte nicht erstellt werden' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true, data }, { status: 201 })
  } catch (error) {
    console.error('Create category error:', error)
    return NextResponse.json(
      { success: false, error: 'Ein unerwarteter Fehler ist aufgetreten' },
      { status: 500 }
    )
  }
}
