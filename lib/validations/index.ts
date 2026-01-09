/**
 * Validation schemas barrel export
 *
 * Centralized Zod validation schemas for all domain entities.
 * Import schemas using: import { schemaName } from '@/lib/validations'
 */

// Client validation schemas
export * from './client.schema';

// Crew validation schemas
export * from './crew.schema';

// Authentication validation schemas
export * from './auth.schema';

// Knowledge base validation schemas
export * from './knowledge-base.schema';

// Conversation validation schemas
export * from './conversation.schema';
