import { useEffect, useMemo, useState } from 'react'
import {
  allowAccountFallback,
  loadAccountOrders,
  loadAccountProfile,
  type AccountOrderSource,
  type AccountProfileSource,
} from '@/features/account/client'
import { fallbackAccountData } from '@/features/account/sample-data'
import type { AccountData } from '@/features/account/types'
import type { Customer, Order } from '@/types'

function mapFallbackUser(user: Customer | null, fallbackEnabled: boolean): AccountData['displayUser'] {
  if (!user) {
    if (fallbackEnabled) {
      return fallbackAccountData.displayUser
    }

    return {
      id: 'unauthorized',
      email: '',
      name: 'Nicht angemeldet',
      addresses: [],
      createdAt: new Date().toISOString(),
    }
  }

  return {
    ...fallbackAccountData.displayUser,
    ...user,
    addresses: user.addresses?.length ? user.addresses : (fallbackEnabled ? fallbackAccountData.addresses : []),
  }
}

export function useAccountData(user: Customer | null) {
  const fallbackEnabled = allowAccountFallback()
  const fallbackUser = useMemo(() => mapFallbackUser(user, fallbackEnabled), [fallbackEnabled, user])
  const [displayUser, setDisplayUser] = useState(fallbackUser)
  const [profileSource, setProfileSource] = useState<AccountProfileSource>('api_unavailable')
  const [profileError, setProfileError] = useState<string | null>(null)

  const addresses = useMemo(
    () => (displayUser.addresses?.length ? displayUser.addresses : (fallbackEnabled ? fallbackAccountData.addresses : [])),
    [displayUser.addresses, fallbackEnabled],
  )
  const [orders, setOrders] = useState<Order[]>(fallbackEnabled ? fallbackAccountData.orders : [])
  const [ordersLoading, setOrdersLoading] = useState(true)
  const [ordersError, setOrdersError] = useState<string | null>(null)
  const [ordersSource, setOrdersSource] = useState<AccountOrderSource>('api_unavailable')

  useEffect(() => {
    let active = true

    const run = async () => {
      setDisplayUser(fallbackUser)
      const result = await loadAccountProfile()

      if (!active) {
        return
      }

      setProfileSource(result.source)
      setProfileError(result.error)
      if (result.profile) {
        setDisplayUser(result.profile)
      }
    }

    void run()

    return () => {
      active = false
    }
  }, [fallbackUser])

  useEffect(() => {
    let active = true

    const run = async () => {
      setOrdersLoading(true)
      const result = await loadAccountOrders({
        userID: displayUser.id,
        addresses,
        fallbackOrders: fallbackEnabled ? fallbackAccountData.orders : [],
      })

      if (!active) {
        return
      }

      setOrders(result.orders)
      setOrdersError(result.error)
      setOrdersSource(result.source)
      setOrdersLoading(false)
    }

    void run()

    return () => {
      active = false
    }
  }, [addresses, displayUser.id, fallbackEnabled])

  return {
    data: {
      displayUser,
      orders,
      wishlist: fallbackEnabled ? fallbackAccountData.wishlist : [],
      addresses,
    } satisfies AccountData,
    profileState: {
      source: profileSource,
      error: profileError,
    },
    ordersState: {
      loading: ordersLoading,
      error: ordersError,
      source: ordersSource,
    },
  }
}
