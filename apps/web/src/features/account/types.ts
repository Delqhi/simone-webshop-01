import type { ComponentType, SVGProps } from 'react'
import type { Address, Customer, Order, Product } from '@/types'

export type TabType = 'profile' | 'orders' | 'wishlist' | 'addresses' | 'settings'

export type TabIcon = ComponentType<SVGProps<SVGSVGElement>>

export interface AccountTab {
  id: TabType
  label: string
  icon: TabIcon
}

export interface AccountDisplayUser extends Customer {
  addresses: Address[]
}

export interface AccountData {
  displayUser: AccountDisplayUser
  orders: Order[]
  wishlist: Product[]
  addresses: Address[]
}
