import { cache } from 'react';
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import type { Session } from "@/lib/auth";

/**
 * Session Helper Functions for Better Auth
 *
 * DEPRECATED: These functions are kept for backward compatibility.
 * New code should use lib/dal.ts functions instead.
 *
 * Provides utilities for:
 * - Getting current user session with client/organization context
 * - Automatic query filtering by clientId for multi-tenancy
 * - Role-based access control helpers
 *
 * All functions now use React cache() to prevent N+1 query problems.
 */

export interface SessionWithClient extends Session {
  session: Session['session'] & {
    activeOrganizationId: string | null;
  };
  user: Session['user'] & {
    role: 'super_admin' | 'client_admin' | 'viewer';
  };
}

/**
 * Get the current session with client/organization context (server-side only)
 * Use this in Server Components and API Routes
 *
 * UPDATED: Now uses React cache() to prevent repeated database queries.
 * Multiple calls to this function in the same request will return the cached result.
 *
 * @returns Promise<SessionWithClient | null>
 *
 * @example
 * ```ts
 * // In a Server Component
 * import { getSessionWithClient } from '@/lib/auth/session-helpers';
 *
 * export default async function DashboardPage() {
 *   const session = await getSessionWithClient();
 *
 *   if (!session) {
 *     redirect('/login');
 *   }
 *
 *   const clientId = session.session.activeOrganizationId;
 *   // Use clientId to filter queries...
 * }
 * ```
 *
 * @example
 * ```ts
 * // In an API Route
 * import { getSessionWithClient } from '@/lib/auth/session-helpers';
 *
 * export async function GET() {
 *   const session = await getSessionWithClient();
 *
 *   if (!session) {
 *     return new Response('Unauthorized', { status: 401 });
 *   }
 *
 *   const clientId = session.session.activeOrganizationId;
 *   // Filter data by clientId...
 * }
 * ```
 */
export const getSessionWithClient = cache(async (): Promise<SessionWithClient | null> => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return null;
  }

  return session as SessionWithClient;
});

/**
 * Get the active organization/client ID from the current session
 * Returns null if no session or no active organization
 *
 * @returns Promise<string | null>
 *
 * @example
 * ```ts
 * const clientId = await getActiveClientId();
 * if (!clientId) {
 *   return new Response('No active organization', { status: 400 });
 * }
 * ```
 */
export async function getActiveClientId(): Promise<string | null> {
  const session = await getSessionWithClient();
  return session?.session.activeOrganizationId || null;
}

/**
 * Require authentication and return session
 * Throws error if not authenticated
 *
 * @throws Error if not authenticated
 * @returns Promise<SessionWithClient>
 *
 * @example
 * ```ts
 * export async function GET() {
 *   const session = await requireAuth();
 *   // Session is guaranteed to exist here
 *   const userId = session.user.id;
 * }
 * ```
 */
export async function requireAuth(): Promise<SessionWithClient> {
  const session = await getSessionWithClient();

  if (!session) {
    throw new Error('Unauthorized - authentication required');
  }

  return session;
}

/**
 * Require authentication with active organization
 * Throws error if not authenticated or no active organization
 *
 * @throws Error if not authenticated or no active organization
 * @returns Promise<{ session: SessionWithClient; clientId: string }>
 *
 * @example
 * ```ts
 * export async function GET() {
 *   const { session, clientId } = await requireAuthWithClient();
 *   // Both session and clientId are guaranteed to exist
 *   const crews = await getCrewsByClientId(clientId);
 * }
 * ```
 */
export async function requireAuthWithClient(): Promise<{
  session: SessionWithClient;
  clientId: string;
}> {
  const session = await requireAuth();

  const clientId = session.session.activeOrganizationId;

  if (!clientId) {
    throw new Error('No active organization - please select an organization');
  }

  return { session, clientId };
}

/**
 * Check if the current user is a SuperAdmin
 * SuperAdmins have global access across all organizations
 *
 * UPDATED: Now uses cached session to prevent repeated queries.
 *
 * @returns Promise<boolean>
 *
 * @example
 * ```ts
 * const isAdmin = await isSuperAdmin();
 * if (isAdmin) {
 *   // Allow access to all clients
 * }
 * ```
 */
export const isSuperAdmin = cache(async (): Promise<boolean> => {
  const session = await getSessionWithClient();

  if (!session) {
    return false;
  }

  // Check if user has super_admin role
  return session.user.role === 'super_admin';
});

/**
 * Check if the current user has access to a specific client/organization
 * SuperAdmins have access to all clients
 *
 * @param clientId - The client ID to check access for
 * @returns Promise<boolean>
 *
 * @example
 * ```ts
 * const canAccess = await hasAccessToClient('org_123');
 * if (!canAccess) {
 *   return new Response('Forbidden', { status: 403 });
 * }
 * ```
 */
export async function hasAccessToClient(clientId: string): Promise<boolean> {
  const session = await getSessionWithClient();

  if (!session) {
    return false;
  }

  // SuperAdmins have access to all clients
  if (await isSuperAdmin()) {
    return true;
  }

  // Check if the user's active organization matches the requested client
  return session.session.activeOrganizationId === clientId;
}

/**
 * Query filter helper - automatically filters queries by clientId
 * Use this to ensure multi-tenant data isolation
 *
 * @param clientId - The client ID to filter by (optional, will use active org if not provided)
 * @returns Promise<string | null> - The clientId to use for filtering, or null if SuperAdmin
 *
 * @example
 * ```ts
 * import { eq } from 'drizzle-orm';
 * import { crews } from '@/db/schema';
 *
 * export async function GET() {
 *   const filterClientId = await withClientFilter();
 *
 *   const query = db.select().from(crews);
 *
 *   // Only filter if not SuperAdmin
 *   if (filterClientId) {
 *     query.where(eq(crews.clientId, filterClientId));
 *   }
 *
 *   const results = await query;
 *   return Response.json(results);
 * }
 * ```
 */
export async function withClientFilter(
  clientId?: string
): Promise<string | null> {
  // If SuperAdmin, return null (no filter)
  if (await isSuperAdmin()) {
    return null;
  }

  // Use provided clientId or get from active organization
  if (clientId) {
    // Verify user has access to this client
    const hasAccess = await hasAccessToClient(clientId);
    if (!hasAccess) {
      throw new Error('Forbidden - no access to this organization');
    }
    return clientId;
  }

  // Get active organization from session
  const activeClientId = await getActiveClientId();

  if (!activeClientId) {
    throw new Error('No active organization');
  }

  return activeClientId;
}
