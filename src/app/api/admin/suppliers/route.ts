import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'

// GET /api/admin/suppliers - List all suppliers
export async function GET(request: NextRequest) {
  try {
    const supabase = createServerClient()
    const { searchParams } = new URL(request.url)
    
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const status = searchParams.get('status')
    const search = searchParams.get('search')
    const sortBy = searchParams.get('sort_by') || 'created_at'
    const sortOrder = searchParams.get('sort_order') || 'desc'

    let query = supabase
      .from('suppliers')
      .select('*, products(count)', { count: 'exact' })

    // Filters
    if (status) {
      query = query.eq('status', status)
    }
    if (search) {
      query = query.or(`name.ilike.%${search}%,email.ilike.%${search}%,website.ilike.%${search}%`)
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
        { success: false, error: 'Lieferanten konnten nicht geladen werden' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data: {
        suppliers: data,
        pagination: {
          page,
          limit,
          total: count || 0,
          totalPages: Math.ceil((count || 0) / limit),
        },
      },
    })
  } catch (error) {
    console.error('Suppliers API error:', error)
    return NextResponse.json(
      { success: false, error: 'Ein unerwarteter Fehler ist aufgetreten' },
      { status: 500 }
    )
  }
}

// POST /api/admin/suppliers - Create new supplier
export async function POST(request: NextRequest) {
  try {
    const supabase = createServerClient()
    const body = await request.json()

    if (!body.name || !body.email) {
      return NextResponse.json(
        { success: false, error: 'Name und E-Mail sind erforderlich' },
        { status: 400 }
      )
    }

    const { data, error } = await supabase
      .from('suppliers')
      .insert({
        name: body.name,
        email: body.email,
        phone: body.phone || null,
        website: body.website || null,
        api_endpoint: body.api_endpoint || null,
        api_key: body.api_key || null,
        status: body.status || 'pending',
        rating: body.rating || 0,
        notes: body.notes || null,
        contact_person: body.contact_person || null,
        country: body.country || 'DE',
        shipping_time_days: body.shipping_time_days || 7,
        minimum_order: body.minimum_order || 0,
      })
      .select()
      .single()

    if (error) {
      console.error('Supabase insert error:', error)
      return NextResponse.json(
        { success: false, error: 'Lieferant konnte nicht erstellt werden' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true, data }, { status: 201 })
  } catch (error) {
    console.error('Create supplier error:', error)
    return NextResponse.json(
      { success: false, error: 'Ein unerwarteter Fehler ist aufgetreten' },
      { status: 500 }
    )
  }
}
