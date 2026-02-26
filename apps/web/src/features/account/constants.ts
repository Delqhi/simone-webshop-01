import {
  ChevronRightIcon,
  CogIcon,
  HeartIcon,
  MapPinIcon,
  ShoppingBagIcon,
  UserCircleIcon,
} from '@heroicons/react/24/outline'
import type { OrderStatus } from '@/types'
import type { AccountTab } from '@/features/account/types'

export const ACCOUNT_TABS: AccountTab[] = [
  { id: 'profile', label: 'Profil', icon: UserCircleIcon },
  { id: 'orders', label: 'Bestellungen', icon: ShoppingBagIcon },
  { id: 'wishlist', label: 'Wunschliste', icon: HeartIcon },
  { id: 'addresses', label: 'Adressen', icon: MapPinIcon },
  { id: 'settings', label: 'Einstellungen', icon: CogIcon },
]

export const ACTIVE_TAB_ICON = ChevronRightIcon

export const STATUS_COLORS: Record<OrderStatus, string> = {
  pending: 'bg-amber-100 text-amber-700',
  confirmed: 'bg-blue-100 text-blue-700',
  processing: 'bg-violet-100 text-violet-700',
  shipped: 'bg-cyan-100 text-cyan-700',
  delivered: 'bg-emerald-100 text-emerald-700',
  cancelled: 'bg-red-100 text-red-700',
  refunded: 'bg-slate-100 text-slate-700',
}

export const STATUS_LABELS: Record<OrderStatus, string> = {
  pending: 'Ausstehend',
  confirmed: 'Bestätigt',
  processing: 'In Bearbeitung',
  shipped: 'Versendet',
  delivered: 'Zugestellt',
  cancelled: 'Storniert',
  refunded: 'Erstattet',
}
