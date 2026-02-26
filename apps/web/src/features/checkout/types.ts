import type { LucideIcon } from 'lucide-react'

export type CheckoutStep = 'shipping' | 'payment' | 'review'

export type PaymentMethod = 'card'

export type ShippingData = {
  firstName: string
  lastName: string
  email: string
  phone: string
  street: string
  city: string
  zip: string
  country: string
  companyName: string
  vatId: string
  purchaseOrderRef: string
}

export type StepConfig = {
  id: CheckoutStep
  label: string
  icon: LucideIcon
}

export type CheckoutItemPayload = {
  sku: string
  title: string
  quantity: number
  unit_price_amount: number
}

export type CheckoutShippingAddressPayload = {
  first_name: string
  last_name: string
  street1: string
  street2?: string
  city: string
  zip: string
  country: string
  phone?: string
}

export type CheckoutSessionPayload = {
  email: string
  currency: 'EUR'
  shipping_method: string
  customer_type: 'b2c' | 'b2b'
  company_name: string
  vat_id: string
  purchase_order_ref: string
  shipping_address: CheckoutShippingAddressPayload
  items: CheckoutItemPayload[]
}

export type CheckoutSessionResponse = {
  order_id: string
  checkout_url: string
  stripe_session_id: string
  status: 'requires_payment'
}
