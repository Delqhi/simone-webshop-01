import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'

interface RouteParams {
  params: Promise<{ id: string }>
}

// GET /api/admin/customers/[id] - Get single customer with orders
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params
    const supabase = createServerClient()

    const { data, error } = await supabase
      .from('customers')
      .select(`
        *,
        orders(
          id, 
          status, 
          total, 
          payment_status, 
          created_at
        )
      `)
      .eq('id', id)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { success: false, error: 'Kunde nicht gefunden' },
          { status: 404 }
        )
      }
      console.error('Supabase error:', error)
      return NextResponse.json(
        { success: false, error: 'Kunde konnte nicht geladen werden' },
        { status: 500 }
      )
    }

    // Calculate customer stats
    const orders = data.orders || []
    const stats = {
      totalOrders: orders.length,
      totalSpent: orders.reduce((sum: number, o: { total: number }) => sum + (o.total || 0), 0),
      lastOrderDate: orders.length > 0 
        ? orders.sort((a: { created_at: string }, b: { created_at: string }) => 
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
          )[0].created_at 
        : null,
    }

    return NextResponse.json({ success: true, data: { ...data, stats } })
  } catch (error) {
    console.error('Get customer error:', error)
    return NextResponse.json(
      { success: false, error: 'Ein unerwarteter Fehler ist aufgetreten' },
      { status: 500 }
    )
  }
}

// PUT /api/admin/customers/[id] - Update customer
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
    if (body.address !== undefined) updateData.address = body.address

    // Check if new email already exists (if email is being changed)
    if (body.email) {
      const { data: existing } = await supabase
        .from('customers')
        .select('id')
        .eq('email', body.email)
        .neq('id', id)
        .single()

      if (existing) {
        return NextResponse.json(
          { success: false, error: 'Diese E-Mail-Adresse ist bereits registriert' },
          { status: 400 }
        )
      }
    }

    const { data, error } = await supabase
      .from('customers')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { success: false, error: 'Kunde nicht gefunden' },
          { status: 404 }
        )
      }
      console.error('Supabase update error:', error)
      return NextResponse.json(
        { success: false, error: 'Kunde konnte nicht aktualisiert werden' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error('Update customer error:', error)
    return NextResponse.json(
      { success: false, error: 'Ein unerwarteter Fehler ist aufgetreten' },
      { status: 500 }
    )
  }
}

// DELETE /api/admin/customers/[id] - Delete customer
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params
    const supabase = createServerClient()

    // Check if customer has orders
    const { count } = await supabase
      .from('orders')
      .select('*', { count: 'exact', head: true })
      .eq('customer_id', id)

    if (count && count > 0) {
      return NextResponse.json(
        { success: false, error: `Kunde hat ${count} Bestellungen. Kunde kann nicht gelöscht werden.` },
        { status: 400 }
      )
    }

    const { error } = await supabase
      .from('customers')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Supabase delete error:', error)
      return NextResponse.json(
        { success: false, error: 'Kunde konnte nicht gelöscht werden' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true, message: 'Kunde erfolgreich gelöscht' })
  } catch (error) {
    console.error('Delete customer error:', error)
    return NextResponse.json(
      { success: false, error: 'Ein unerwarteter Fehler ist aufgetreten' },
      { status: 500 }
    )
  }
}
