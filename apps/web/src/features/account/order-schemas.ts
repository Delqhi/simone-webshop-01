import { z } from 'zod'

const ApiOrderItemSchema = z.object({
  id: z.string(),
  product_id: z.string().nullable().optional(),
  sku: z.string().nullable().optional(),
  title: z.string().nullable().optional(),
  variant: z.string().nullable().optional(),
  quantity: z.number().int().positive().default(1),
  price: z.number().nullable().optional(),
  unit_price_amount: z.number().int().nullable().optional(),
})

export const ApiOrderSchema = z.object({
  id: z.string(),
  status: z.string(),
  currency: z.string().default('EUR'),
  total_amount: z.number().int().nullable().optional(),
  total: z.number().nullable().optional(),
  payment_status: z.string().default('pending'),
  tracking_number: z.string().nullable().optional(),
  tracking_url: z.string().nullable().optional(),
  created_at: z.string(),
  updated_at: z.string(),
  items: z.array(ApiOrderItemSchema).optional(),
})

export const ApiOrderListSchema = z.object({
  items: z.array(ApiOrderSchema),
  page: z.number().int().optional(),
  limit: z.number().int().optional(),
})

export type ApiOrder = z.infer<typeof ApiOrderSchema>
export type ApiOrderList = z.infer<typeof ApiOrderListSchema>
