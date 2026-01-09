/**
 * Authentication validation schemas
 *
 * Provides Zod schemas for authentication-related operations including
 * login, signup, password management, and user creation.
 */

import { z } from 'zod';

// Password validation rules
const passwordSchema = z.string()
  .min(8, 'Password must be at least 8 characters')
  .max(100, 'Password must be at most 100 characters')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number')
  .regex(/[^a-zA-Z0-9]/, 'Password must contain at least one special character');

// Login schema
export const loginSchema = z.object({
  email: z.string()
    .email('Valid email address required')
    .toLowerCase(),
  password: z.string()
    .min(1, 'Password is required'),
  rememberMe: z.boolean().optional().default(false),
});

// Signup schema
export const signupSchema = z.object({
  name: z.string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be at most 100 characters'),
  email: z.string()
    .email('Valid email address required')
    .toLowerCase(),
  password: passwordSchema,
  confirmPassword: z.string(),
  companyName: z.string()
    .min(2, 'Company name must be at least 2 characters')
    .max(100, 'Company name must be at most 100 characters'),
  acceptTerms: z.boolean()
    .refine((val) => val === true, {
      message: 'You must accept the terms and conditions',
    }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

// Setup password schema (for invited users)
export const setupPasswordSchema = z.object({
  token: z.string()
    .min(1, 'Token is required'),
  password: passwordSchema,
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

// Forgot password schema
export const forgotPasswordSchema = z.object({
  email: z.string()
    .email('Valid email address required')
    .toLowerCase(),
});

// Reset password schema
export const resetPasswordSchema = z.object({
  token: z.string()
    .min(1, 'Reset token is required'),
  password: passwordSchema,
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

// Change password schema (for authenticated users)
export const changePasswordSchema = z.object({
  currentPassword: z.string()
    .min(1, 'Current password is required'),
  newPassword: passwordSchema,
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
}).refine((data) => data.currentPassword !== data.newPassword, {
  message: "New password must be different from current password",
  path: ['newPassword'],
});

// Update profile schema
export const updateProfileSchema = z.object({
  name: z.string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be at most 100 characters')
    .optional(),
  email: z.string()
    .email('Valid email address required')
    .toLowerCase()
    .optional(),
}).refine((data) => data.name || data.email, {
  message: 'At least one field must be provided',
});

// Email verification schema
export const verifyEmailSchema = z.object({
  token: z.string()
    .min(1, 'Verification token is required'),
});

// Resend verification email schema
export const resendVerificationSchema = z.object({
  email: z.string()
    .email('Valid email address required')
    .toLowerCase(),
});

// Type inference
export type LoginInput = z.infer<typeof loginSchema>;
export type SignupInput = z.infer<typeof signupSchema>;
export type SetupPasswordInput = z.infer<typeof setupPasswordSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
export type VerifyEmailInput = z.infer<typeof verifyEmailSchema>;
export type ResendVerificationInput = z.infer<typeof resendVerificationSchema>;
