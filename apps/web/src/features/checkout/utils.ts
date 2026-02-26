import type { CartItem } from '@/types'
import { FREE_SHIPPING_THRESHOLD, STANDARD_SHIPPING_COST } from './constants'
import type { CheckoutSessionPayload, ShippingData } from './types'

export function createDefaultShippingData(): ShippingData {
  return {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    street: '',
    city: '',
    zip: '',
    country: 'Deutschland',
    companyName: '',
    vatId: '',
    purchaseOrderRef: '',
  }
}

export function getShippingCost(total: number): number {
  return total >= FREE_SHIPPING_THRESHOLD ? 0 : STANDARD_SHIPPING_COST
}

export function hasMissingShippingFields(data: ShippingData): boolean {
  const required = [data.firstName, data.lastName, data.email, data.street, data.city, data.zip]
  return required.some((value) => !value.trim())
}

export function buildCheckoutPayload(
  shippingData: ShippingData,
  segment: 'b2c' | 'b2b',
  shippingCost: number,
  items: CartItem[],
): CheckoutSessionPayload {
  return {
    email: shippingData.email,
    currency: 'EUR',
    shipping_method: shippingCost === 0 ? 'standard_free' : 'standard',
    customer_type: segment,
    company_name: segment === 'b2b' ? shippingData.companyName : '',
    vat_id: segment === 'b2b' ? shippingData.vatId : '',
    purchase_order_ref: segment === 'b2b' ? shippingData.purchaseOrderRef : '',
    shipping_address: {
      first_name: shippingData.firstName.trim(),
      last_name: shippingData.lastName.trim(),
      street1: shippingData.street.trim(),
      street2: '',
      city: shippingData.city.trim(),
      zip: shippingData.zip.trim(),
      country: shippingData.country.trim(),
      phone: shippingData.phone.trim(),
    },
    items: items.map((item) => ({
      sku: item.product.id,
      title: item.name,
      quantity: item.quantity,
      unit_price_amount: Math.round(item.price * 100),
    })),
  }
}
