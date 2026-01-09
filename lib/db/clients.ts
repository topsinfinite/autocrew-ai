import type { Client } from '@/types';
import { db } from '@/db';
import { clients } from '@/db/schema';
import { eq } from 'drizzle-orm';

/**
 * Server-Side Database Helper Functions for Client Management
 *
 * These functions provide direct database access and should only be used
 * in Server Components, API Routes, and Server Actions.
 *
 * DO NOT import these in Client Components!
 */

/**
 * Check if a slug exists in the database (server-side only)
 * @param slug - The slug to check
 * @returns Promise<boolean>
 */
export async function checkSlugExists(slug: string): Promise<boolean> {
  const result = await db
    .select()
    .from(clients)
    .where(eq(clients.slug, slug))
    .limit(1);
  return result.length > 0;
}

/**
 * Check if a client code exists in the database (server-side only)
 * @param clientCode - The client code to check
 * @returns Promise<boolean>
 */
export async function checkClientCodeExists(clientCode: string): Promise<boolean> {
  const result = await db
    .select()
    .from(clients)
    .where(eq(clients.clientCode, clientCode))
    .limit(1);
  return result.length > 0;
}

/**
 * Get client by slug (server-side only)
 * Used by Better Auth organization plugin
 * @param slug - The client slug
 * @returns Promise<Client | null>
 */
export async function getClientBySlug(slug: string): Promise<Client | null> {
  const result = await db
    .select()
    .from(clients)
    .where(eq(clients.slug, slug))
    .limit(1);
  return result[0] as Client || null;
}

/**
 * Get client by clientCode (server-side only)
 * Used for existing foreign key lookups
 * @param clientCode - The client code
 * @returns Promise<Client | null>
 */
export async function getClientByCode(clientCode: string): Promise<Client | null> {
  const result = await db
    .select()
    .from(clients)
    .where(eq(clients.clientCode, clientCode))
    .limit(1);
  return result[0] as Client || null;
}
