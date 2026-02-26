import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Product, CartItem, Customer } from '@/types'

type CartProductInput = Pick<Product, 'id' | 'name' | 'price'> & Partial<Product>

function normalizeProduct(input: CartProductInput): Product {
  return {
    id: input.id,
    name: input.name,
    slug: input.slug || input.id,
    description: input.description || '',
    price: input.price,
    originalPrice: input.originalPrice,
    compareAtPrice: input.compareAtPrice,
    images: input.images || [input.image || '/placeholder.jpg'],
    category: input.category || 'All',
    categoryId: input.categoryId || 'all',
    rating: input.rating || 0,
    reviewCount: input.reviewCount || 0,
    isNew: input.isNew,
    isSale: input.isSale,
    isFeatured: input.isFeatured,
    inStock: input.inStock ?? true,
    variants: input.variants,
    supplier: input.supplier,
    stock: input.stock ?? 999,
    createdAt: input.createdAt || new Date().toISOString(),
    updatedAt: input.updatedAt || new Date().toISOString(),
  }
}

function recalculateTotals(items: CartItem[]) {
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0)
  return { total, itemCount }
}

// Cart Store
interface CartState {
  items: CartItem[]
  addItem: (product: CartProductInput, quantity?: number) => void
  removeItem: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  total: number
  itemCount: number
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      total: 0,
      itemCount: 0,
      
      addItem: (rawProduct: CartProductInput, quantity = 1) => {
        const product = normalizeProduct(rawProduct)
        set((state) => {
          const existingItem = state.items.find(item => item.product.id === product.id)
          
          if (existingItem) {
            const items = state.items.map(item =>
              item.product.id === product.id
                ? { ...item, quantity: item.quantity + quantity }
                : item
            )
            return {
              items,
              ...recalculateTotals(items),
            }
          }
          
          const image = product.images?.[0] || '/placeholder.jpg'
          const items = [
            ...state.items,
            {
              id: crypto.randomUUID(),
              product,
              productId: product.id,
              name: product.name,
              image,
              price: product.price,
              quantity,
            },
          ]

          return {
            items,
            ...recalculateTotals(items),
          }
        })
      },
      
      removeItem: (productId: string) => {
        set((state) => {
          const items = state.items.filter(item => item.product.id !== productId)
          return { items, ...recalculateTotals(items) }
        })
      },
      
      updateQuantity: (productId: string, quantity: number) => {
        if (quantity < 1) {
          get().removeItem(productId)
          return
        }
        
        set((state) => {
          const items = state.items.map(item =>
            item.product.id === productId
              ? { ...item, quantity }
              : item
          )
          return { items, ...recalculateTotals(items) }
        })
      },
      
      clearCart: () => set({ items: [], total: 0, itemCount: 0 }),
    }),
    {
      name: 'simone-cart',
    }
  )
)

// UI Store
interface UIState {
  isCartOpen: boolean
  isMobileMenuOpen: boolean
  isChatOpen: boolean
  toggleCart: () => void
  openCart: () => void
  closeCart: () => void
  toggleMobileMenu: () => void
  closeMobileMenu: () => void
  toggleChat: () => void
  openChat: () => void
  closeChat: () => void
}

export const useUIStore = create<UIState>((set) => ({
  isCartOpen: false,
  isMobileMenuOpen: false,
  isChatOpen: false,
  
  toggleCart: () => set((state) => ({ isCartOpen: !state.isCartOpen, isMobileMenuOpen: false })),
  openCart: () => set({ isCartOpen: true, isMobileMenuOpen: false }),
  closeCart: () => set({ isCartOpen: false }),
  
  toggleMobileMenu: () => set((state) => ({ isMobileMenuOpen: !state.isMobileMenuOpen, isCartOpen: false })),
  closeMobileMenu: () => set({ isMobileMenuOpen: false }),
  
  toggleChat: () => set((state) => ({ isChatOpen: !state.isChatOpen })),
  openChat: () => set({ isChatOpen: true }),
  closeChat: () => set({ isChatOpen: false }),
}))

// User Store
interface UserState {
  user: Customer | null
  isAuthenticated: boolean
  login: (customer: Customer) => void
  logout: () => void
  updateUser: (data: Partial<Customer>) => void
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      
      login: (customer: Customer) => set({ user: customer, isAuthenticated: true }),
      
      logout: () => set({ user: null, isAuthenticated: false }),
      
      updateUser: (data: Partial<Customer>) => set((state) => ({
        user: state.user ? { ...state.user, ...data } : null,
      })),
    }),
    {
      name: 'simone-user',
    }
  )
)
