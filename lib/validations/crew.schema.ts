/**
 * Crew validation schemas
 *
 * Provides Zod schemas for crew-related operations including
 * creation, updates, configuration, and activation.
 */

import { z } from 'zod';
import { crewTypeEnum, crewStatusEnum } from '@/db/schema';

// Crew activation state schema
export const crewActivationStateSchema = z.object({
  documentsUploaded: z.boolean().default(false),
  supportConfigured: z.boolean().default(false),
  activationReady: z.boolean().default(false),
});

// Widget settings validation schema
export const widgetSettingsSchema = z.object({
  // Appearance
  primaryColor: z
    .string()
    .regex(/^#[0-9A-Fa-f]{6}$/, 'Must be a valid hex color (e.g., #0891b2)')
    .optional(),
  position: z.enum(['bottom-right', 'bottom-left']).optional(),
  theme: z.enum(['light', 'dark', 'auto']).optional(),

  // Branding
  widgetTitle: z
    .string()
    .max(50, 'Title must be 50 characters or less')
    .optional(),
  widgetSubtitle: z
    .string()
    .max(100, 'Subtitle must be 100 characters or less')
    .optional(),

  // Behavior
  welcomeMessage: z
    .string()
    .max(500, 'Welcome message must be 500 characters or less')
    .optional(),
  firstLaunchAction: z.enum(['none', 'auto-open', 'show-greeting']).optional(),
  greetingDelay: z.number().int().min(0).max(30000).optional(),
});

// Crew configuration schema
export const crewConfigSchema = z.object({
  vectorTableName: z.string().optional(),
  historiesTableName: z.string().optional(),
  metadata: z.object({
    support_email: z.string().email().optional(),
    support_client_name: z.string().optional(),
    agent_name: z.string().optional(),
  }).passthrough().optional(), // Allow additional metadata fields
  widgetSettings: widgetSettingsSchema.optional(),
  activationState: crewActivationStateSchema.optional(),
});

// Base crew creation schema
export const createCrewSchema = z.object({
  name: z.string()
    .min(2, 'Crew name must be at least 2 characters')
    .max(100, 'Crew name must be at most 100 characters'),
  clientId: z.string()
    .min(1, 'Client ID is required'),
  type: z.enum(crewTypeEnum.enumValues),
  webhookUrl: z.string()
    .url('Valid webhook URL required')
    .refine((url) => url.startsWith('http://') || url.startsWith('https://'), {
      message: 'Webhook URL must use HTTP or HTTPS protocol',
    }),
  status: z.enum(crewStatusEnum.enumValues).default('inactive'),
  config: crewConfigSchema.optional(),
});

// Update crew schema
export const updateCrewSchema = createCrewSchema.partial().extend({
  id: z.string().uuid('Invalid crew ID'),
});

// Update crew configuration only
export const updateCrewConfigSchema = z.object({
  id: z.string().uuid('Invalid crew ID'),
  config: crewConfigSchema,
});

// Update crew support configuration (for activation wizard)
export const updateCrewSupportConfigSchema = z.object({
  id: z.string().uuid('Invalid crew ID'),
  supportEmail: z.string().email('Valid email address required'),
  supportClientName: z.string()
    .min(2, 'Client name must be at least 2 characters')
    .max(100, 'Client name must be at most 100 characters'),
  agentName: z.string()
    .min(2, 'Agent name must be at least 2 characters')
    .max(50, 'Agent name must be at most 50 characters'),
});

// Activate/deactivate crew schema
export const toggleCrewStatusSchema = z.object({
  id: z.string().uuid('Invalid crew ID'),
  status: z.enum(['active', 'inactive']),
});

// Query/filter schema for listing crews
export const crewFilterSchema = z.object({
  clientId: z.string().optional(),
  type: z.enum(crewTypeEnum.enumValues).optional(),
  status: z.enum(crewStatusEnum.enumValues).optional(),
  search: z.string().optional(), // For searching by crew name or code
  limit: z.coerce.number().int().min(1).max(100).default(20),
  offset: z.coerce.number().int().min(0).default(0),
});

// Type inference
export type CreateCrewInput = z.infer<typeof createCrewSchema>;
export type UpdateCrewInput = z.infer<typeof updateCrewSchema>;
export type UpdateCrewConfigInput = z.infer<typeof updateCrewConfigSchema>;
export type UpdateCrewSupportConfigInput = z.infer<typeof updateCrewSupportConfigSchema>;
export type ToggleCrewStatusInput = z.infer<typeof toggleCrewStatusSchema>;
export type CrewFilterInput = z.infer<typeof crewFilterSchema>;
export type CrewConfig = z.infer<typeof crewConfigSchema>;
export type CrewActivationState = z.infer<typeof crewActivationStateSchema>;
export type WidgetSettingsInput = z.infer<typeof widgetSettingsSchema>;
