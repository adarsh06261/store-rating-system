import { z } from 'zod';

export const nameSchema = z
  .string()
  .min(20, 'Name must be at least 20 characters')
  .max(60, 'Name must be at most 60 characters');

export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .max(16, 'Password must be at most 16 characters')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[!@#$%^&*(),.?":{}|<>]/, 'Password must contain at least one special character');

export const emailSchema = z.string().email('Invalid email address');

export const addressSchema = z
  .string()
  .max(400, 'Address must be at most 400 characters')
  .optional()
  .or(z.literal(''));

export const signupSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  password: passwordSchema,
  address: addressSchema,
});

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required'),
});

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });
