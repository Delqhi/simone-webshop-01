import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'

interface RouteParams {
  params: Promise<{ id: string }>
}

// GET /api/admin/blog/[id] - Get single blog post
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params
    const supabase = createServerClient()

    // Try by ID first, then by slug
    const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)
    
    let query = supabase.from('blog_posts').select('*')
    
    if (isUUID) {
      query = query.eq('id', id)
    } else {
      query = query.eq('slug', id)
    }

    const { data, error } = await query.single()

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { success: false, error: 'Blogbeitrag nicht gefunden' },
          { status: 404 }
        )
      }
      console.error('Supabase error:', error)
      return NextResponse.json(
        { success: false, error: 'Blogbeitrag konnte nicht geladen werden' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error('Get blog post error:', error)
    return NextResponse.json(
      { success: false, error: 'Ein unerwarteter Fehler ist aufgetreten' },
      { status: 500 }
    )
  }
}

// PUT /api/admin/blog/[id] - Update blog post
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params
    const supabase = createServerClient()
    const body = await request.json()

    const updateData: Record<string, unknown> = {
      updated_at: new Date().toISOString(),
    }

    if (body.title !== undefined) updateData.title = body.title
    if (body.slug !== undefined) updateData.slug = body.slug
    if (body.excerpt !== undefined) updateData.excerpt = body.excerpt
    if (body.content !== undefined) updateData.content = body.content
    if (body.featured_image !== undefined) updateData.featured_image = body.featured_image
    if (body.category !== undefined) updateData.category = body.category
    if (body.tags !== undefined) updateData.tags = body.tags
    if (body.author !== undefined) updateData.author = body.author
    if (body.status !== undefined) {
      updateData.status = body.status
      // Set published_at when publishing
      if (body.status === 'published' && !body.published_at) {
        updateData.published_at = new Date().toISOString()
      }
    }
    if (body.scheduled_at !== undefined) updateData.scheduled_at = body.scheduled_at
    if (body.meta_title !== undefined) updateData.meta_title = body.meta_title
    if (body.meta_description !== undefined) updateData.meta_description = body.meta_description

    // Check slug uniqueness if changing
    if (body.slug) {
      const { data: existing } = await supabase
        .from('blog_posts')
        .select('id')
        .eq('slug', body.slug)
        .neq('id', id)
        .single()

      if (existing) {
        return NextResponse.json(
          { success: false, error: 'Dieser Slug existiert bereits' },
          { status: 400 }
        )
      }
    }

    const { data, error } = await supabase
      .from('blog_posts')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { success: false, error: 'Blogbeitrag nicht gefunden' },
          { status: 404 }
        )
      }
      console.error('Supabase update error:', error)
      return NextResponse.json(
        { success: false, error: 'Blogbeitrag konnte nicht aktualisiert werden' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error('Update blog post error:', error)
    return NextResponse.json(
      { success: false, error: 'Ein unerwarteter Fehler ist aufgetreten' },
      { status: 500 }
    )
  }
}

// DELETE /api/admin/blog/[id] - Delete blog post
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params
    const supabase = createServerClient()

    const { error } = await supabase
      .from('blog_posts')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Supabase delete error:', error)
      return NextResponse.json(
        { success: false, error: 'Blogbeitrag konnte nicht gelöscht werden' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true, message: 'Blogbeitrag erfolgreich gelöscht' })
  } catch (error) {
    console.error('Delete blog post error:', error)
    return NextResponse.json(
      { success: false, error: 'Ein unerwarteter Fehler ist aufgetreten' },
      { status: 500 }
    )
  }
}
