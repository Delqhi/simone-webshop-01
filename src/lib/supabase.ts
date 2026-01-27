import { createClient, SupabaseClient } from '@supabase/supabase-js'

// Placeholder for build time - real values come from environment
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key'

// Lazy initialization to avoid build-time errors
let _supabase: SupabaseClient | null = null

export const supabase = (() => {
  if (!_supabase) {
    _supabase = createClient(supabaseUrl, supabaseAnonKey)
  }
  return _supabase
})()

// Server-side client with service role (for API routes)
let _serverClient: SupabaseClient | null = null

export function createServerClient(): SupabaseClient {
  if (_serverClient) return _serverClient
  
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder-service-key'
  
  _serverClient = createClient(url, serviceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
  
  return _serverClient
}

// Database types (based on schema.sql)
export type Database = {
  public: {
    Tables: {
      customers: {
        Row: {
          id: string
          email: string
          name: string
          phone: string | null
          address: Record<string, unknown> | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          name: string
          phone?: string | null
          address?: Record<string, unknown> | null
        }
        Update: {
          email?: string
          name?: string
          phone?: string | null
          address?: Record<string, unknown> | null
        }
      }
      products: {
        Row: {
          id: string
          supplier_id: string | null
          name: string
          description: string | null
          price: number
          original_price: number | null
          images: string[]
          category_id: string | null
          variants: Record<string, unknown> | null
          stock: number
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          supplier_id?: string | null
          name: string
          description?: string | null
          price: number
          original_price?: number | null
          images?: string[]
          category_id?: string | null
          variants?: Record<string, unknown> | null
          stock?: number
          is_active?: boolean
        }
        Update: {
          name?: string
          description?: string | null
          price?: number
          original_price?: number | null
          images?: string[]
          category_id?: string | null
          variants?: Record<string, unknown> | null
          stock?: number
          is_active?: boolean
        }
      }
      orders: {
        Row: {
          id: string
          customer_id: string
          status: string
          subtotal: number
          shipping_cost: number
          tax: number
          total: number
          shipping_address: Record<string, unknown>
          billing_address: Record<string, unknown>
          payment_method: string | null
          payment_status: string
          tracking_number: string | null
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          customer_id: string
          status?: string
          subtotal: number
          shipping_cost?: number
          tax?: number
          total: number
          shipping_address: Record<string, unknown>
          billing_address: Record<string, unknown>
          payment_method?: string | null
          payment_status?: string
          tracking_number?: string | null
          notes?: string | null
        }
        Update: {
          status?: string
          subtotal?: number
          shipping_cost?: number
          tax?: number
          total?: number
          shipping_address?: Record<string, unknown>
          billing_address?: Record<string, unknown>
          payment_method?: string | null
          payment_status?: string
          tracking_number?: string | null
          notes?: string | null
        }
      }
      categories: {
        Row: {
          id: string
          name: string
          slug: string
          description: string | null
          image: string | null
          parent_id: string | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          description?: string | null
          image?: string | null
          parent_id?: string | null
        }
        Update: {
          name?: string
          slug?: string
          description?: string | null
          image?: string | null
          parent_id?: string | null
        }
      }
    }
  }
}
