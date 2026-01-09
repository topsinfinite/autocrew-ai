/**
 * Client validation schemas
 *
 * Provides Zod schemas for client-related operations including
 * creation, updates, and API input validation.
 */

import { z } from 'zod';
import { planEnum, statusEnum } from '@/db/schema';

// Base client validation
export const createClientSchema = z.object({
  companyName: z.string()
    .min(2, 'Company name must be at least 2 characters')
    .max(100, 'Company name must be at most 100 characters'),
  contactPersonName: z.string()
    .min(2, 'Contact person name must be at least 2 characters')
    .max(100, 'Contact person name must be at most 100 characters'),
  contactEmail: z.string()
    .email('Valid email address required')
    .toLowerCase(),
  phone: z.string()
    .min(10, 'Phone number must be at least 10 characters')
    .max(20, 'Phone number must be at most 20 characters')
    .optional()
    .nullable(),
  address: z.string()
    .max(200, 'Address must be at most 200 characters')
    .optional()
    .nullable(),
  city: z.string()
    .max(100, 'City must be at most 100 characters')
    .optional()
    .nullable(),
  country: z.string()
    .max(100, 'Country must be at most 100 characters')
    .optional()
    .nullable(),
  plan: z.enum(planEnum.enumValues),
  status: z.enum(statusEnum.enumValues).default('trial'),
});

// Update schema - all fields optional except validation rules apply when provided
export const updateClientSchema = createClientSchema.partial().extend({
  id: z.string().uuid('Invalid client ID'),
});

// Query/filter schema for listing clients
export const clientFilterSchema = z.object({
  status: z.enum(statusEnum.enumValues).optional(),
  plan: z.enum(planEnum.enumValues).optional(),
  search: z.string().optional(), // For searching by company name or contact
  limit: z.coerce.number().int().min(1).max(100).default(20),
  offset: z.coerce.number().int().min(0).default(0),
});

// Admin user creation for client
export const createClientAdminSchema = z.object({
  clientId: z.string().uuid('Invalid client ID'),
  email: z.string()
    .email('Valid email address required')
    .toLowerCase(),
  name: z.string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be at most 100 characters'),
  role: z.enum(['client_admin', 'viewer']).default('client_admin'),
});

// Type inference
export type CreateClientInput = z.infer<typeof createClientSchema>;
export type UpdateClientInput = z.infer<typeof updateClientSchema>;
export type ClientFilterInput = z.infer<typeof clientFilterSchema>;
export type CreateClientAdminInput = z.infer<typeof createClientAdminSchema>;
