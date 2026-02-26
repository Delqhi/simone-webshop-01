import { z } from 'zod'

export const ApiAccountAddressSchema = z.object({
  id: z.string(),
  name: z.string().nullable().optional(),
  first_name: z.string(),
  last_name: z.string(),
  street1: z.string(),
  street2: z.string().nullable().optional(),
  city: z.string(),
  zip: z.string(),
  country: z.string(),
  phone: z.string().nullable().optional(),
  is_default: z.boolean().default(false),
})

export const ApiAccountProfileSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  first_name: z.string().nullable().optional(),
  last_name: z.string().nullable().optional(),
  name: z.string().nullable().optional(),
  phone: z.string().nullable().optional(),
  role: z.string(),
  company_name: z.string().nullable().optional(),
  vat_id: z.string().nullable().optional(),
  purchase_order_ref: z.string().nullable().optional(),
  created_at: z.string(),
  updated_at: z.string(),
  addresses: z.array(ApiAccountAddressSchema).default([]),
})

export type ApiAccountProfile = z.infer<typeof ApiAccountProfileSchema>
