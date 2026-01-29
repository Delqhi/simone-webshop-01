import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'

interface RouteParams {
  params: Promise<{ id: string }>
}

// GET /api/admin/orders/[id] - Get single order with items
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params
    const supabase = createServerClient()

    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        customers(id, name, email, phone),
        order_items(
          id, 
          quantity, 
          price, 
          variant,
          products(id, name, images)
        )
      `)
      .eq('id', id)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { success: false, error: 'Bestellung nicht gefunden' },
          { status: 404 }
        )
      }
      console.error('Supabase error:', error)
      return NextResponse.json(
        { success: false, error: 'Bestellung konnte nicht geladen werden' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error('Get order error:', error)
    return NextResponse.json(
      { success: false, error: 'Ein unerwarteter Fehler ist aufgetreten' },
      { status: 500 }
    )
  }
}

// PUT /api/admin/orders/[id] - Update order (status, tracking, etc.)
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params
    const supabase = createServerClient()
    const body = await request.json()

    const updateData: Record<string, unknown> = {
      updated_at: new Date().toISOString(),
    }

    // Only update provided fields
    if (body.status !== undefined) updateData.status = body.status
    if (body.payment_status !== undefined) updateData.payment_status = body.payment_status
    if (body.tracking_number !== undefined) updateData.tracking_number = body.tracking_number
    if (body.notes !== undefined) updateData.notes = body.notes
    if (body.shipping_address !== undefined) updateData.shipping_address = body.shipping_address
    if (body.billing_address !== undefined) updateData.billing_address = body.billing_address

    const { data, error } = await supabase
      .from('orders')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { success: false, error: 'Bestellung nicht gefunden' },
          { status: 404 }
        )
      }
      console.error('Supabase update error:', error)
      return NextResponse.json(
        { success: false, error: 'Bestellung konnte nicht aktualisiert werden' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error('Update order error:', error)
    return NextResponse.json(
      { success: false, error: 'Ein unerwarteter Fehler ist aufgetreten' },
      { status: 500 }
    )
  }
}

// DELETE /api/admin/orders/[id] - Cancel/delete order
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params
    const supabase = createServerClient()
    const { searchParams } = new URL(request.url)
    const hardDelete = searchParams.get('hard') === 'true'

    if (hardDelete) {
      // Hard delete - remove from database
      // First delete order items
      await supabase.from('order_items').delete().eq('order_id', id)
      
      const { error } = await supabase
        .from('orders')
        .delete()
        .eq('id', id)

      if (error) {
        console.error('Supabase delete error:', error)
        return NextResponse.json(
          { success: false, error: 'Bestellung konnte nicht gelöscht werden' },
          { status: 500 }
        )
      }

      return NextResponse.json({ success: true, message: 'Bestellung erfolgreich gelöscht' })
    } else {
      // Soft delete - just mark as cancelled
      const { data, error } = await supabase
        .from('orders')
        .update({ status: 'cancelled', updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single()

      if (error) {
        console.error('Supabase cancel error:', error)
        return NextResponse.json(
          { success: false, error: 'Bestellung konnte nicht storniert werden' },
          { status: 500 }
        )
      }

      return NextResponse.json({ success: true, data, message: 'Bestellung erfolgreich storniert' })
    }
  } catch (error) {
    console.error('Delete order error:', error)
    return NextResponse.json(
      { success: false, error: 'Ein unerwarteter Fehler ist aufgetreten' },
      { status: 500 }
    )
  }
}
