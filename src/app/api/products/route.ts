import { NextRequest, NextResponse } from 'next/server'
import { sampleProducts, sampleCategories } from '@/data/sample-products'
import type { Product } from '@/types'

// GET /api/products - List all products with optional filters
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    const category = searchParams.get('category')
    const search = searchParams.get('search')
    const minPrice = parseFloat(searchParams.get('minPrice') || '0')
    const maxPrice = parseFloat(searchParams.get('maxPrice') || '999999')
    const inStock = searchParams.get('inStock')
    const sortBy = searchParams.get('sortBy') || 'newest'
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '12')
    const featured = searchParams.get('featured')

    let products = [...sampleProducts]

    // Filter by category
    if (category) {
      const categoryObj = sampleCategories.find(c => c.slug === category || c.id === category)
      if (categoryObj) {
        products = products.filter((p) => p.categoryId === categoryObj.id)
      }
    }

    // Filter by search
    if (search) {
      const searchLower = search.toLowerCase()
      products = products.filter((p) =>
        p.name.toLowerCase().includes(searchLower) ||
        p.description?.toLowerCase().includes(searchLower) ||
        p.category?.toLowerCase().includes(searchLower)
      )
    }

    // Filter by price range
    products = products.filter((p) => p.price >= minPrice && p.price <= maxPrice)

    // Filter by stock
    if (inStock === 'true') {
      products = products.filter((p) => p.stock > 0)
    } else if (inStock === 'false') {
      products = products.filter((p) => p.stock === 0)
    }

    // Filter by featured (bestsellers based on reviewCount)
    if (featured === 'true') {
      products = products.filter((p) => p.reviewCount > 200)
    }

    // Sort
    switch (sortBy) {
      case 'price-asc':
        products.sort((a, b) => a.price - b.price)
        break
      case 'price-desc':
        products.sort((a, b) => b.price - a.price)
        break
      case 'name-asc':
        products.sort((a, b) => a.name.localeCompare(b.name))
        break
      case 'name-desc':
        products.sort((a, b) => b.name.localeCompare(a.name))
        break
      case 'popular':
        products.sort((a, b) => b.reviewCount - a.reviewCount)
        break
      case 'newest':
      default:
        products.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    }

    // Pagination
    const total = products.length
    const totalPages = Math.ceil(total / limit)
    const startIndex = (page - 1) * limit
    const paginatedProducts = products.slice(startIndex, startIndex + limit)

    return NextResponse.json({
      products: paginatedProducts,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
      filters: {
        categories: sampleCategories,
        priceRange: {
          min: Math.min(...sampleProducts.map((p) => p.price)),
          max: Math.max(...sampleProducts.map((p) => p.price)),
        },
      },
    })
  } catch (error) {
    console.error('Products API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    )
  }
}

// POST /api/products - Create new product (admin only)
export async function POST(request: NextRequest) {
  try {
    // TODO: Add authentication check
    const body = await request.json()

    // Validate required fields
    const requiredFields = ['name', 'price', 'categoryId']
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { error: `${field} is required` },
          { status: 400 }
        )
      }
    }

    // Create product (in real app, save to database)
    const newProduct: Product = {
      id: `prod_${Date.now()}`,
      name: body.name,
      description: body.description || '',
      price: body.price,
      originalPrice: body.originalPrice,
      images: body.images || ['/placeholder.jpg'],
      category: body.category || 'Allgemein',
      categoryId: body.categoryId,
      rating: 0,
      reviewCount: 0,
      stock: body.stock || 100,
      isNew: body.isNew ?? true,
      isSale: body.isSale ?? false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    // In real app: await db.products.create(newProduct)

    return NextResponse.json({
      success: true,
      product: newProduct,
    }, { status: 201 })
  } catch (error) {
    console.error('Create product error:', error)
    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 }
    )
  }
}
