import { z } from 'zod';
import { nameSchema, passwordSchema, emailSchema, addressSchema } from './auth.validator.js';

export const createUserSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  password: passwordSchema,
  address: addressSchema,
  role: z.enum(['ADMIN', 'USER', 'STORE_OWNER']),
});

export const createStoreSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  address: addressSchema,
  ownerId: z.string().min(1, 'Owner is required'),
});

export const listQuerySchema = z.object({
  search: z.string().optional(),
  role: z.enum(['ADMIN', 'USER', 'STORE_OWNER']).optional(),
  sortBy: z.enum(['name', 'email', 'createdAt', 'role']).optional().default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).optional().default('desc'),
  page: z.coerce.number().int().min(1).optional().default(1),
  limit: z.coerce.number().int().min(1).max(100).optional().default(10),
});

export const storeListQuerySchema = z.object({
  search: z.string().optional(),
  sortBy: z.enum(['name', 'email', 'createdAt', 'averageRating']).optional().default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).optional().default('desc'),
  minRating: z.coerce.number().min(1).max(5).optional(),
  maxRating: z.coerce.number().min(1).max(5).optional(),
  page: z.coerce.number().int().min(1).optional().default(1),
  limit: z.coerce.number().int().min(1).max(100).optional().default(10),
});

export const submitRatingSchema = z.object({
  rating: z.number().int().min(1, 'Rating must be at least 1').max(5, 'Rating must be at most 5'),
});
