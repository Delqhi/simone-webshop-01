import { ApiOrderListSchema, ApiOrderSchema } from '@/features/account/order-schemas'
import { ApiAccountProfileSchema, type ApiAccountProfile } from '@/features/account/profile-schemas'
import { mapApiOrderToUIOrder } from '@/features/account/order-mapper'
import { getAuthHeaders } from '@/lib/api/auth'
import type { Address, Customer, Order } from '@/types'

export type AccountOrderSource = 'api' | 'empty' | 'api_unavailable' | 'unauthorized'
export type AccountProfileSource = 'api' | 'api_unavailable' | 'unauthorized'

export interface AccountOrderLoadResult {
  source: AccountOrderSource
  orders: Order[]
  error: string | null
}

export interface AccountProfileLoadResult {
  source: AccountProfileSource
  profile: Customer | null
  error: string | null
}

export function allowAccountFallback(): boolean {
  if (process.env.NEXT_PUBLIC_WEB_ACCOUNT_FALLBACK_ENABLED === 'true') {
    return true
  }
  return process.env.NODE_ENV !== 'production'
}

async function fetchOrderDetails(orderID: string): Promise<unknown | null> {
  const response = await fetch(`/api/orders?id=${orderID}`, {
    cache: 'no-store',
    headers: await getAuthHeaders(),
  })
  if (!response.ok) {
    return null
  }
  return response.json()
}

function mapProfileToCustomer(input: ApiAccountProfile): Customer {
  const resolvedName = input.name || [input.first_name, input.last_name].filter(Boolean).join(' ').trim() || input.email

  return {
    id: input.id,
    email: input.email,
    name: resolvedName,
    phone: input.phone || undefined,
    createdAt: input.created_at,
    addresses: input.addresses.map((address) => ({
      id: address.id,
      name: address.name || `${address.first_name} ${address.last_name}`.trim(),
      street: [address.street1, address.street2 || ''].filter(Boolean).join(', '),
      city: address.city,
      postalCode: address.zip,
      country: address.country,
      phone: address.phone || undefined,
      isDefault: address.is_default,
    })),
  }
}

export async function loadAccountProfile(): Promise<AccountProfileLoadResult> {
  try {
    const response = await fetch('/api/account/me', {
      cache: 'no-store',
      headers: await getAuthHeaders(),
    })

    if (response.status === 401 || response.status === 403) {
      return { source: 'unauthorized', profile: null, error: null }
    }

    if (!response.ok) {
      throw new Error(`account_profile_fetch_failed:${response.status}`)
    }

    const payload = ApiAccountProfileSchema.parse(await response.json())
    return { source: 'api', profile: mapProfileToCustomer(payload), error: null }
  } catch (error) {
    return {
      source: 'api_unavailable',
      profile: null,
      error: error instanceof Error ? error.message : 'account_profile_fetch_failed',
    }
  }
}

export async function loadAccountOrders(options: {
  userID: string
  addresses: Address[]
  fallbackOrders: Order[]
}): Promise<AccountOrderLoadResult> {
  try {
    const response = await fetch('/api/orders?limit=20', {
      cache: 'no-store',
      headers: await getAuthHeaders(),
    })

    if (response.status === 401 || response.status === 403) {
      return {
        source: 'unauthorized',
        orders: allowAccountFallback() ? options.fallbackOrders : [],
        error: null,
      }
    }

    if (!response.ok) {
      throw new Error(`orders_fetch_failed:${response.status}`)
    }

    const listPayload = ApiOrderListSchema.parse(await response.json())
    const detailPayloads = await Promise.all(listPayload.items.map((order) => fetchOrderDetails(order.id)))

    const merged = listPayload.items.map((summary, index) => {
      const detail = detailPayloads[index]
      if (!detail) {
        return summary
      }
      const parsed = ApiOrderSchema.safeParse(detail)
      return parsed.success ? parsed.data : summary
    })

    return {
      source: merged.length > 0 ? 'api' : 'empty',
      orders: merged.map((order) => mapApiOrderToUIOrder(order, options.userID, options.addresses)),
      error: null,
    }
  } catch (error) {
    if (!allowAccountFallback()) {
      return {
        source: 'api_unavailable',
        orders: [],
        error: error instanceof Error ? error.message : 'orders_fetch_failed',
      }
    }

    return {
      source: 'api_unavailable',
      orders: options.fallbackOrders,
      error: error instanceof Error ? error.message : null,
    }
  }
}
