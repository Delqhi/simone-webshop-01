import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'

interface RouteParams {
  params: Promise<{ id: string }>
}

// GET /api/admin/suppliers/[id] - Get single supplier with products
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params
    const supabase = createServerClient()

    const { data, error } = await supabase
      .from('suppliers')
      .select(`
        *,
        products(id, name, price, stock, is_active)
      `)
      .eq('id', id)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { success: false, error: 'Lieferant nicht gefunden' },
          { status: 404 }
        )
      }
      console.error('Supabase error:', error)
      return NextResponse.json(
        { success: false, error: 'Lieferant konnte nicht geladen werden' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error('Get supplier error:', error)
    return NextResponse.json(
      { success: false, error: 'Ein unerwarteter Fehler ist aufgetreten' },
      { status: 500 }
    )
  }
}

// PUT /api/admin/suppliers/[id] - Update supplier
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params
    const supabase = createServerClient()
    const body = await request.json()

    const updateData: Record<string, unknown> = {
      updated_at: new Date().toISOString(),
    }

    if (body.name !== undefined) updateData.name = body.name
    if (body.email !== undefined) updateData.email = body.email
    if (body.phone !== undefined) updateData.phone = body.phone
    if (body.website !== undefined) updateData.website = body.website
    if (body.api_endpoint !== undefined) updateData.api_endpoint = body.api_endpoint
    if (body.api_key !== undefined) updateData.api_key = body.api_key
    if (body.status !== undefined) updateData.status = body.status
    if (body.rating !== undefined) updateData.rating = body.rating
    if (body.notes !== undefined) updateData.notes = body.notes
    if (body.contact_person !== undefined) updateData.contact_person = body.contact_person
    if (body.country !== undefined) updateData.country = body.country
    if (body.shipping_time_days !== undefined) updateData.shipping_time_days = body.shipping_time_days
    if (body.minimum_order !== undefined) updateData.minimum_order = body.minimum_order

    const { data, error } = await supabase
      .from('suppliers')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { success: false, error: 'Lieferant nicht gefunden' },
          { status: 404 }
        )
      }
      console.error('Supabase update error:', error)
      return NextResponse.json(
        { success: false, error: 'Lieferant konnte nicht aktualisiert werden' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error('Update supplier error:', error)
    return NextResponse.json(
      { success: false, error: 'Ein unerwarteter Fehler ist aufgetreten' },
      { status: 500 }
    )
  }
}

// DELETE /api/admin/suppliers/[id] - Delete supplier
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params
    const supabase = createServerClient()

    // Check if supplier has products
    const { count } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true })
      .eq('supplier_id', id)

    if (count && count > 0) {
      return NextResponse.json(
        { success: false, error: `Lieferant hat ${count} Produkte. Bitte erst Produkte entfernen oder anderem Lieferanten zuweisen.` },
        { status: 400 }
      )
    }

    const { error } = await supabase
      .from('suppliers')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Supabase delete error:', error)
      return NextResponse.json(
        { success: false, error: 'Lieferant konnte nicht gelöscht werden' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true, message: 'Lieferant erfolgreich gelöscht' })
  } catch (error) {
    console.error('Delete supplier error:', error)
    return NextResponse.json(
      { success: false, error: 'Ein unerwarteter Fehler ist aufgetreten' },
      { status: 500 }
    )
  }
}
