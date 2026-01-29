import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'

interface RouteParams {
  params: Promise<{ id: string }>
}

// GET /api/admin/promotions/[id] - Get single promotion
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params
    const supabase = createServerClient()

    const { data, error } = await supabase
      .from('promotions')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { success: false, error: 'Aktion nicht gefunden' },
          { status: 404 }
        )
      }
      console.error('Supabase error:', error)
      return NextResponse.json(
        { success: false, error: 'Aktion konnte nicht geladen werden' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error('Get promotion error:', error)
    return NextResponse.json(
      { success: false, error: 'Ein unerwarteter Fehler ist aufgetreten' },
      { status: 500 }
    )
  }
}

// PUT /api/admin/promotions/[id] - Update promotion
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params
    const supabase = createServerClient()
    const body = await request.json()

    const updateData: Record<string, unknown> = {
      updated_at: new Date().toISOString(),
    }

    if (body.name !== undefined) updateData.name = body.name
    if (body.description !== undefined) updateData.description = body.description
    if (body.type !== undefined) updateData.type = body.type
    if (body.code !== undefined) updateData.code = body.code?.toUpperCase() || null
    if (body.discount_value !== undefined) updateData.discount_value = body.discount_value
    if (body.discount_percentage !== undefined) updateData.discount_percentage = body.discount_percentage
    if (body.minimum_order !== undefined) updateData.minimum_order = body.minimum_order
    if (body.maximum_discount !== undefined) updateData.maximum_discount = body.maximum_discount
    if (body.usage_limit !== undefined) updateData.usage_limit = body.usage_limit
    if (body.per_customer_limit !== undefined) updateData.per_customer_limit = body.per_customer_limit
    if (body.start_date !== undefined) updateData.start_date = body.start_date
    if (body.end_date !== undefined) updateData.end_date = body.end_date
    if (body.is_active !== undefined) updateData.is_active = body.is_active
    if (body.applies_to !== undefined) updateData.applies_to = body.applies_to
    if (body.category_ids !== undefined) updateData.category_ids = body.category_ids
    if (body.product_ids !== undefined) updateData.product_ids = body.product_ids
    if (body.banner_text !== undefined) updateData.banner_text = body.banner_text
    if (body.banner_color !== undefined) updateData.banner_color = body.banner_color

    // Check code uniqueness if changing
    if (body.code) {
      const { data: existing } = await supabase
        .from('promotions')
        .select('id')
        .eq('code', body.code.toUpperCase())
        .neq('id', id)
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
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { success: false, error: 'Aktion nicht gefunden' },
          { status: 404 }
        )
      }
      console.error('Supabase update error:', error)
      return NextResponse.json(
        { success: false, error: 'Aktion konnte nicht aktualisiert werden' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error('Update promotion error:', error)
    return NextResponse.json(
      { success: false, error: 'Ein unerwarteter Fehler ist aufgetreten' },
      { status: 500 }
    )
  }
}

// DELETE /api/admin/promotions/[id] - Delete promotion
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params
    const supabase = createServerClient()

    const { error } = await supabase
      .from('promotions')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Supabase delete error:', error)
      return NextResponse.json(
        { success: false, error: 'Aktion konnte nicht gelöscht werden' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true, message: 'Aktion erfolgreich gelöscht' })
  } catch (error) {
    console.error('Delete promotion error:', error)
    return NextResponse.json(
      { success: false, error: 'Ein unerwarteter Fehler ist aufgetreten' },
      { status: 500 }
    )
  }
}
