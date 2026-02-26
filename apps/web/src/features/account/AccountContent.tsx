import { AddressesTab } from '@/features/account/AddressesTab'
import { OrdersTab } from '@/features/account/OrdersTab'
import { ProfileTab } from '@/features/account/ProfileTab'
import { SettingsTab } from '@/features/account/SettingsTab'
import { WishlistTab } from '@/features/account/WishlistTab'
import type { AccountOrderSource, AccountProfileSource } from '@/features/account/client'
import type { AccountData, TabType } from '@/features/account/types'
import type { Address } from '@/types'

interface AccountContentProps {
  activeTab: TabType
  data: AccountData
  ordersState: {
    loading: boolean
    error: string | null
    source: AccountOrderSource
  }
  profileState: {
    source: AccountProfileSource
    error: string | null
  }
  onCreateAddress: () => void
  onEditAddress: (address: Address) => void
}

export function AccountContent({ activeTab, data, profileState, ordersState, onCreateAddress, onEditAddress }: AccountContentProps) {
  if (activeTab === 'profile') {
    return <ProfileTab user={data.displayUser} state={profileState} />
  }

  if (activeTab === 'orders') {
    return <OrdersTab orders={data.orders} loading={ordersState.loading} error={ordersState.error} source={ordersState.source} />
  }

  if (activeTab === 'wishlist') {
    return <WishlistTab products={data.wishlist} />
  }

  if (activeTab === 'addresses') {
    return <AddressesTab addresses={data.addresses} onCreate={onCreateAddress} onEdit={onEditAddress} />
  }

  return <SettingsTab />
}
