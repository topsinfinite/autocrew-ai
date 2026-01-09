/**
 * Central type definitions barrel export
 *
 * All types are organized by domain and re-exported here for easy importing.
 * Import types using: import { TypeName } from '@/types'
 */

// Authentication & User types
export * from './auth';

// Client & Organization types
export * from './client';

// Crew & Configuration types
export * from './crew';

// Conversation & Messaging types
export * from './conversation';

// Lead Generation types
export * from './lead';

// Knowledge Base & Vector Storage types
export * from './knowledge-base';

// n8n Integration types
export * from './n8n';

// Dashboard & Analytics types
export * from './dashboard';

// API Response types (kept in separate file)
export * from './api';
