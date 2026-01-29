import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'

// GET /api/admin/promotions - List all promotions
export async function GET(request: NextRequest) {
  try {
    const supabase = createServerClient()
    const { searchParams } = new URL(request.url)
    
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const isActive = searchParams.get('is_active')
    const type = searchParams.get('type')
    const sortBy = searchParams.get('sort_by') || 'created_at'
    const sortOrder = searchParams.get('sort_order') || 'desc'

    let query = supabase
      .from('promotions')
      .select('*', { count: 'exact' })

    // Filters
    if (isActive === 'true') {
      const now = new Date().toISOString()
      query = query
        .eq('is_active', true)
        .lte('start_date', now)
        .or(`end_date.is.null,end_date.gte.${now}`)
    } else if (isActive === 'false') {
      query = query.eq('is_active', false)
    }

    if (type) {
      query = query.eq('type', type)
    }

    // Sorting
    query = query.order(sortBy, { ascending: sortOrder === 'asc' })

    // Pagination
    const from = (page - 1) * limit
    const to = from + limit - 1
    query = query.range(from, to)

    const { data, error, count } = await query

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json(
        { success: false, error: 'Aktionen konnten nicht geladen werden' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data: {
        promotions: data,
        pagination: {
          page,
          limit,
          total: count || 0,
          totalPages: Math.ceil((count || 0) / limit),
        },
      },
    })
  } catch (error) {
    console.error('Promotions API error:', error)
    return NextResponse.json(
      { success: false, error: 'Ein unerwarteter Fehler ist aufgetreten' },
      { status: 500 }
    )
  }
}

// POST /api/admin/promotions - Create new promotion
export async function POST(request: NextRequest) {
  try {
    const supabase = createServerClient()
    const body = await request.json()

    if (!body.name || !body.type) {
      return NextResponse.json(
        { success: false, error: 'Name und Typ sind erforderlich' },
        { status: 400 }
      )
    }

    // Validate discount code uniqueness if provided
    if (body.code) {
      const { data: existing } = await supabase
        .from('promotions')
        .select('id')
        .eq('code', body.code.toUpperCase())
        .single()

      if (existing) {
        return NextResponse.json(
          { success: false, error: 'Dieser Gutscheincode existiert bereits' },
          { status: 400 }
        )
      }
    }

    const { data, error } = await supabase
      .from('promotions')
      .insert({
        name: body.name,
        description: body.description || null,
        type: body.type, // 'percentage', 'fixed', 'free_shipping', 'buy_x_get_y'
        code: body.code ? body.code.toUpperCase() : null,
        discount_value: body.discount_value || 0,
        discount_percentage: body.discount_percentage || 0,
        minimum_order: body.minimum_order || 0,
        maximum_discount: body.maximum_discount || null,
        usage_limit: body.usage_limit || null,
        usage_count: 0,
        per_customer_limit: body.per_customer_limit || null,
        start_date: body.start_date || new Date().toISOString(),
        end_date: body.end_date || null,
        is_active: body.is_active ?? true,
        applies_to: body.applies_to || 'all', // 'all', 'categories', 'products'
        category_ids: body.category_ids || [],
        product_ids: body.product_ids || [],
        banner_text: body.banner_text || null,
        banner_color: body.banner_color || '#d946ef',
      })
      .select()
      .single()

    if (error) {
      console.error('Supabase insert error:', error)
      return NextResponse.json(
        { success: false, error: 'Aktion konnte nicht erstellt werden' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true, data }, { status: 201 })
  } catch (error) {
    console.error('Create promotion error:', error)
    return NextResponse.json(
      { success: false, error: 'Ein unerwarteter Fehler ist aufgetreten' },
      { status: 500 }
    )
  }
}
