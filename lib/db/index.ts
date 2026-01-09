/**
 * Database query helpers barrel export
 *
 * Server-side only database query functions using Drizzle ORM.
 * WARNING: These functions should NEVER be imported in Client Components.
 *
 * Usage: import { getClientById, getConversationsByCrewId } from '@/lib/db'
 */

export * from './clients';
export * from './conversations';
export * from './knowledge-base';
export * from './optimized-conversation-discovery';
export * from './transaction-helpers';
