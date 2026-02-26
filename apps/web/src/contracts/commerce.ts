import { z } from 'zod';

export const CustomerSegmentSchema = z.enum(['b2c', 'b2b']);

export const PricingContextSchema = z.object({
  segment: CustomerSegmentSchema,
  currency: z.string().length(3),
  showNet: z.boolean().default(false),
  vatRate: z.number().min(0).max(1).optional(),
  minimumOrderAmount: z.number().nonnegative().optional(),
});

export const TrustSignalSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  description: z.string().min(1),
  icon: z.string().min(1),
  priority: z.enum(['primary', 'secondary', 'supporting']).default('secondary'),
  href: z.string().optional(),
});

export const PromotionPlacementSchema = z.enum(['all', 'header', 'pdp', 'cart']);
export const PromotionSegmentScopeSchema = z.enum(['all', 'b2c', 'b2b']);

export const PromotionBannerSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  type: z.string().min(1),
  code: z.string().nullable().optional(),
  bannerText: z.string().min(1),
  bannerColor: z.string().min(1),
  placement: PromotionPlacementSchema,
  segmentScope: PromotionSegmentScopeSchema,
  discountValue: z.number().optional(),
  discountPercentage: z.number().optional(),
  minimumOrder: z.number().optional(),
  startDate: z.string().datetime(),
  endDate: z.string().datetime().nullable().optional(),
});

export const PromotionBannerListSchema = z.object({
  items: z.array(PromotionBannerSchema),
});

export const CheckoutProfileSchema = z.object({
  segment: CustomerSegmentSchema,
  email: z.string().email(),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  companyName: z.string().min(2).optional(),
  vatId: z.string().min(2).optional(),
  purchaseOrderRef: z.string().min(2).optional(),
});

export const CheckoutShippingAddressSchema = z.object({
  first_name: z.string().min(1),
  last_name: z.string().min(1),
  street1: z.string().min(1),
  street2: z.string().optional(),
  city: z.string().min(1),
  zip: z.string().min(1),
  country: z.string().min(1),
  phone: z.string().optional(),
});

export const CheckoutRequestSchema = z.object({
  email: z.string().email(),
  currency: z.literal('EUR'),
  shipping_method: z.string().min(1),
  customer_type: CustomerSegmentSchema.default('b2c'),
  company_name: z.string().min(2).optional(),
  vat_id: z.string().min(2).optional(),
  purchase_order_ref: z.string().min(2).optional(),
  shipping_address: CheckoutShippingAddressSchema,
  items: z.array(z.object({
    sku: z.string().min(1),
    title: z.string().min(1).optional(),
    quantity: z.number().int().positive(),
    unit_price_amount: z.number().int().positive().optional(),
  })).min(1),
});

export const CheckoutSessionResponseSchema = z.object({
  order_id: z.string().uuid(),
  checkout_url: z.string().url(),
  stripe_session_id: z.string().min(1),
  status: z.literal('requires_payment'),
});

export const CheckoutSessionStatusResponseSchema = z.object({
  order_id: z.string().uuid(),
  stripe_session_id: z.string().min(1),
  checkout_url: z.string().url(),
  checkout_status: z.string().min(1),
  payment_status: z.string().min(1),
  order_status: z.string().min(1),
  payment_state: z.enum(['pending', 'paid', 'failed']),
});

export const InvoiceLineItemSchema = z.object({
  sku: z.string().optional(),
  title: z.string().min(1),
  quantity: z.number().int().positive(),
  unit_price_amount: z.number().int().nonnegative(),
  line_total_amount: z.number().int().nonnegative(),
});

export const InvoiceDocumentSchema = z.object({
  invoice_number: z.string().min(1),
  order_id: z.string().uuid(),
  issue_date: z.string().date(),
  performance_date: z.string().date(),
  currency: z.string().length(3),
  subtotal_amount: z.number().int().nonnegative(),
  shipping_amount: z.number().int().nonnegative(),
  tax_amount: z.number().int().nonnegative(),
  total_amount: z.number().int().nonnegative(),
  pdf_path: z.string().min(1),
  pdf_sha256: z.string().min(32),
  line_items: z.array(InvoiceLineItemSchema),
});

export const OrderConfirmationEmailSchema = z.object({
  order_id: z.string().uuid(),
  recipient: z.string().email(),
  subject: z.string().min(1),
  invoice_number: z.string().min(1).optional(),
});

export const ShipmentEmailSchema = z.object({
  order_id: z.string().uuid(),
  recipient: z.string().email(),
  status: z.string().min(1),
  tracking_number: z.string().optional(),
  tracking_url: z.string().optional(),
});

export type CustomerSegment = z.infer<typeof CustomerSegmentSchema>;
export type PricingContext = z.infer<typeof PricingContextSchema>;
export type TrustSignal = z.infer<typeof TrustSignalSchema>;
export type PromotionPlacement = z.infer<typeof PromotionPlacementSchema>;
export type PromotionSegmentScope = z.infer<typeof PromotionSegmentScopeSchema>;
export type PromotionBanner = z.infer<typeof PromotionBannerSchema>;
export type PromotionBannerList = z.infer<typeof PromotionBannerListSchema>;
export type CheckoutProfile = z.infer<typeof CheckoutProfileSchema>;
export type CheckoutShippingAddress = z.infer<typeof CheckoutShippingAddressSchema>;
export type CheckoutRequest = z.infer<typeof CheckoutRequestSchema>;
export type CheckoutSessionResponse = z.infer<typeof CheckoutSessionResponseSchema>;
export type CheckoutSessionStatusResponse = z.infer<typeof CheckoutSessionStatusResponseSchema>;
export type InvoiceLineItem = z.infer<typeof InvoiceLineItemSchema>;
export type InvoiceDocument = z.infer<typeof InvoiceDocumentSchema>;
export type OrderConfirmationEmail = z.infer<typeof OrderConfirmationEmailSchema>;
export type ShipmentEmail = z.infer<typeof ShipmentEmailSchema>;
