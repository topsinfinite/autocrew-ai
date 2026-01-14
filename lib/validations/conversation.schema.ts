/**
 * Conversation validation schemas
 *
 * Provides Zod schemas for conversation-related operations including
 * creation, updates, and queries.
 */

import { z } from 'zod';
import { sentimentEnum, conversationStatusEnum } from '@/db/schema';

// Conversation message schema
export const conversationMessageSchema = z.object({
  role: z.enum(['user', 'assistant']),
  content: z.string()
    .min(1, 'Message content is required')
    .max(10000, 'Message content must be at most 10,000 characters'),
  timestamp: z.coerce.date(),
});

// Create conversation schema
export const createConversationSchema = z.object({
  sessionId: z.string()
    .min(1, 'Session ID is required'),
  clientId: z.string()
    .min(1, 'Client ID is required'),
  crewId: z.string()
    .uuid('Invalid crew ID'),
  customerName: z.string()
    .min(1, 'Customer name is required')
    .max(100, 'Customer name must be at most 100 characters')
    .optional()
    .nullable(),
  customerEmail: z.string()
    .email('Valid email address required')
    .optional()
    .nullable(),
  sentiment: z.enum(sentimentEnum.enumValues).optional().nullable(),
  status: z.enum(conversationStatusEnum.enumValues).optional().default('pending'),
  resolved: z.boolean().optional().default(false),
  duration: z.number()
    .int('Duration must be an integer')
    .min(0, 'Duration must be positive')
    .optional()
    .nullable(),
});

// Update conversation schema
export const updateConversationSchema = z.object({
  id: z.string().uuid('Invalid conversation ID'),
  customerName: z.string()
    .min(1, 'Customer name must not be empty')
    .max(100, 'Customer name must be at most 100 characters')
    .optional(),
  customerEmail: z.string()
    .email('Valid email address required')
    .optional(),
  sentiment: z.enum(sentimentEnum.enumValues).optional(),
  status: z.enum(conversationStatusEnum.enumValues).optional(),
  resolved: z.boolean().optional(),
  duration: z.number()
    .int('Duration must be an integer')
    .min(0, 'Duration must be positive')
    .optional(),
});

// Query/filter schema for listing conversations
export const conversationFilterSchema = z.object({
  crewId: z.string().uuid('Invalid crew ID').optional(),
  clientId: z.string().optional(),
  sentiment: z.enum(sentimentEnum.enumValues).optional(),
  status: z.enum(conversationStatusEnum.enumValues).optional(),
  resolved: z.coerce.boolean().optional(),
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),
  search: z.string().optional(), // For searching by customer name or email
  limit: z.coerce.number().int().min(1).max(100).default(20),
  offset: z.coerce.number().int().min(0).default(0),
  sortBy: z.enum(['createdAt', 'duration', 'sentiment', 'status']).optional().default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).optional().default('desc'),
}).refine(
  (data) => {
    if (data.startDate && data.endDate) {
      return data.startDate <= data.endDate;
    }
    return true;
  },
  {
    message: 'Start date must be before or equal to end date',
    path: ['endDate'],
  }
);

// Type inference
export type ConversationMessage = z.infer<typeof conversationMessageSchema>;
export type CreateConversationInput = z.infer<typeof createConversationSchema>;
export type UpdateConversationInput = z.infer<typeof updateConversationSchema>;
export type ConversationFilterInput = z.infer<typeof conversationFilterSchema>;
