import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'

// GET /api/admin/orders - List all orders with filtering
export async function GET(request: NextRequest) {
  try {
    const supabase = createServerClient()
    const { searchParams } = new URL(request.url)
    
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const status = searchParams.get('status')
    const paymentStatus = searchParams.get('payment_status')
    const customerId = searchParams.get('customer_id')
    const dateFrom = searchParams.get('date_from')
    const dateTo = searchParams.get('date_to')
    const sortBy = searchParams.get('sort_by') || 'created_at'
    const sortOrder = searchParams.get('sort_order') || 'desc'

    let query = supabase
      .from('orders')
      .select('*, customers(id, name, email)', { count: 'exact' })

    // Filters
    if (status) {
      query = query.eq('status', status)
    }
    if (paymentStatus) {
      query = query.eq('payment_status', paymentStatus)
    }
    if (customerId) {
      query = query.eq('customer_id', customerId)
    }
    if (dateFrom) {
      query = query.gte('created_at', dateFrom)
    }
    if (dateTo) {
      query = query.lte('created_at', dateTo)
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
        { success: false, error: 'Bestellungen konnten nicht geladen werden' },
        { status: 500 }
      )
    }

    // Calculate stats
    const { data: stats } = await supabase
      .from('orders')
      .select('status, total')

    const orderStats = {
      total: stats?.length || 0,
      pending: stats?.filter(o => o.status === 'pending').length || 0,
      processing: stats?.filter(o => o.status === 'processing').length || 0,
      shipped: stats?.filter(o => o.status === 'shipped').length || 0,
      delivered: stats?.filter(o => o.status === 'delivered').length || 0,
      revenue: stats?.reduce((sum, o) => sum + (o.total || 0), 0) || 0,
    }

    return NextResponse.json({
      success: true,
      data: {
        orders: data,
        pagination: {
          page,
          limit,
          total: count || 0,
          totalPages: Math.ceil((count || 0) / limit),
        },
        stats: orderStats,
      },
    })
  } catch (error) {
    console.error('Orders API error:', error)
    return NextResponse.json(
      { success: false, error: 'Ein unerwarteter Fehler ist aufgetreten' },
      { status: 500 }
    )
  }
}

// POST /api/admin/orders - Create new order (manual order)
export async function POST(request: NextRequest) {
  try {
    const supabase = createServerClient()
    const body = await request.json()

    if (!body.customer_id || !body.items || body.items.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Kunde und Artikel sind erforderlich' },
        { status: 400 }
      )
    }

    // Calculate totals
    const subtotal = body.items.reduce(
      (sum: number, item: { price: number; quantity: number }) => 
        sum + (item.price * item.quantity), 
      0
    )
    const shippingCost = body.shipping_cost || (subtotal >= 50 ? 0 : 4.99)
    const tax = subtotal * 0.19 // 19% German VAT
    const total = subtotal + shippingCost + tax

    const { data, error } = await supabase
      .from('orders')
      .insert({
        customer_id: body.customer_id,
        status: body.status || 'pending',
        subtotal,
        shipping_cost: shippingCost,
        tax,
        total,
        shipping_address: body.shipping_address,
        billing_address: body.billing_address || body.shipping_address,
        payment_method: body.payment_method || null,
        payment_status: body.payment_status || 'pending',
        notes: body.notes || null,
      })
      .select()
      .single()

    if (error) {
      console.error('Supabase insert error:', error)
      return NextResponse.json(
        { success: false, error: 'Bestellung konnte nicht erstellt werden' },
        { status: 500 }
      )
    }

    // Insert order items
    if (data) {
      const orderItems = body.items.map((item: { product_id: string; quantity: number; price: number; variant?: string }) => ({
        order_id: data.id,
        product_id: item.product_id,
        quantity: item.quantity,
        price: item.price,
        variant: item.variant || null,
      }))

      await supabase.from('order_items').insert(orderItems)
    }

    return NextResponse.json({ success: true, data }, { status: 201 })
  } catch (error) {
    console.error('Create order error:', error)
    return NextResponse.json(
      { success: false, error: 'Ein unerwarteter Fehler ist aufgetreten' },
      { status: 500 }
    )
  }
}
