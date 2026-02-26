import { z } from 'zod';

export const AccountAddressSchema = z.object({
  id: z.string().min(1),
  name: z.string().nullable().optional(),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  street1: z.string().min(1),
  street2: z.string().nullable().optional(),
  city: z.string().min(1),
  zip: z.string().min(1),
  country: z.string().min(1),
  phone: z.string().nullable().optional(),
  isDefault: z.boolean().default(false),
});

export const AccountProfileSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  firstName: z.string().nullable().optional(),
  lastName: z.string().nullable().optional(),
  name: z.string().nullable().optional(),
  phone: z.string().nullable().optional(),
  role: z.string().min(1),
  companyName: z.string().nullable().optional(),
  vatId: z.string().nullable().optional(),
  purchaseOrderRef: z.string().nullable().optional(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  addresses: z.array(AccountAddressSchema).default([]),
});

export const AccountProfileUpdateSchema = z.object({
  firstName: z.string().min(1).optional(),
  lastName: z.string().min(1).optional(),
  name: z.string().min(1).optional(),
  phone: z.string().min(1).optional(),
  companyName: z.string().min(1).optional(),
  vatId: z.string().min(1).optional(),
  purchaseOrderRef: z.string().min(1).optional(),
});

export type AccountAddress = z.infer<typeof AccountAddressSchema>;
export type AccountProfile = z.infer<typeof AccountProfileSchema>;
export type AccountProfileUpdate = z.infer<typeof AccountProfileUpdateSchema>;
