/**
 * Data Access Layer (DAL)
 *
 * Centralizes data requests and authorization logic following Next.js 16 best practices.
 * All database queries should go through this layer to ensure proper authentication
 * and authorization checks are performed close to data access (proximity principle).
 *
 * @see https://nextjs.org/docs/app/guides/authentication
 */

import { cache } from 'react';
import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { db } from '@/db';
import { clients, crews, conversations, user, member } from '@/db/schema';
import { eq, inArray, and } from 'drizzle-orm';
import type { Session } from '@/lib/auth';

/**
 * Extended session type with organization context
 */
export interface SessionWithClient extends Session {
  session: Session['session'] & {
    activeOrganizationId: string | null;
  };
  user: Session['user'] & {
    role: 'super_admin' | 'client_admin' | 'viewer';
  };
}

// ============================================================================
// Core Authentication Functions
// ============================================================================

/**
 * Verify and get current session (cached per request)
 * This is the foundation - all other DAL functions use this
 *
 * @throws Error if not authenticated
 * @returns SessionWithClient
 */
export const verifyAuth = cache(async (): Promise<SessionWithClient> => {
  const requestHeaders = await headers();
  const session = await auth.api.getSession({
    headers: requestHeaders,
  });

  if (!session) {
    // Get the current pathname from headers to use as callbackUrl
    // This prevents infinite redirect loop with proxy.ts
    const pathname = requestHeaders.get('x-pathname') ||
                     requestHeaders.get('x-invoke-path') ||
                     new URL(requestHeaders.get('referer') || '/dashboard', 'http://localhost').pathname;
    redirect(`/login?callbackUrl=${encodeURIComponent(pathname)}`);
  }

  return session as SessionWithClient;
});

/**
 * Check if current user is SuperAdmin (cached)
 *
 * @returns boolean
 */
export const isSuperAdmin = cache(async (): Promise<boolean> => {
  try {
    const session = await verifyAuth();
    return session.user.role === 'super_admin';
  } catch {
    return false;
  }
});

/**
 * Get active organization ID from session
 *
 * @returns string | null
 */
export const getActiveOrganizationId = cache(async (): Promise<string | null> => {
  try {
    const session = await verifyAuth();
    return session.session.activeOrganizationId || null;
  } catch {
    return null;
  }
});

// ============================================================================
// Client/Organization Data Access
// ============================================================================

/**
 * Get all clients (SuperAdmin only)
 *
 * @throws Error if not SuperAdmin
 * @returns Array of clients
 */
export const getClients = cache(async () => {
  const session = await verifyAuth();

  if (session.user.role !== 'super_admin') {
    throw new Error('Forbidden - SuperAdmin access required');
  }

  return await db.select().from(clients);
});

/**
 * Get a single client by ID with authorization check
 *
 * @param clientId - Client/organization ID
 * @returns Client or null
 */
export const getClient = cache(async (clientId: string) => {
  const session = await verifyAuth();

  const [client] = await db
    .select()
    .from(clients)
    .where(eq(clients.id, clientId))
    .limit(1);

  if (!client) {
    return null;
  }

  // SuperAdmin can access any client
  if (session.user.role === 'super_admin') {
    return client;
  }

  // Client Admin can only access their organization
  const activeOrgId = session.session.activeOrganizationId;
  if (activeOrgId !== client.id) {
    throw new Error('Forbidden - Cannot access other organization data');
  }

  return client;
});

/**
 * Get organizations for the current user
 * SuperAdmin gets all, Client Admin gets their organization(s)
 *
 * @returns Array of clients
 */
export const getAvailableClients = cache(async () => {
  const session = await verifyAuth();

  // SuperAdmin sees all clients
  if (session.user.role === 'super_admin') {
    return await db.select().from(clients);
  }

  // Client Admin sees only their organization(s)
  const userId = session.user.id;

  // Get user's organization memberships
  const memberships = await db
    .select()
    .from(member)
    .where(eq(member.userId, userId));

  if (memberships.length === 0) {
    return [];
  }

  // Get client data for user's organizations
  const orgIds = memberships.map((m) => m.organizationId);
  const userClients = await db
    .select()
    .from(clients)
    .where(inArray(clients.id, orgIds));

  return userClients;
});

// ============================================================================
// Crew Data Access
// ============================================================================

/**
 * Get crews with automatic multi-tenant filtering
 *
 * @param options - Filter options
 * @returns Array of crews
 */
export const getCrews = cache(async (options?: {
  clientId?: string;
  type?: string;
  status?: string;
}) => {
  const session = await verifyAuth();

  let query = db.select().from(crews);
  const conditions = [];

  // Apply client filtering based on role
  if (session.user.role === 'super_admin') {
    // SuperAdmin can optionally filter by clientId
    if (options?.clientId) {
      // Get clientCode from organization ID
      const [client] = await db
        .select()
        .from(clients)
        .where(eq(clients.id, options.clientId))
        .limit(1);

      if (client) {
        conditions.push(eq(crews.clientId, client.clientCode));
      }
    }
    // Otherwise, no filter - see all crews
  } else {
    // Client Admin - only their organization's crews
    const userId = session.user.id;

    const memberships = await db
      .select()
      .from(member)
      .where(eq(member.userId, userId));

    if (memberships.length === 0) {
      return [];
    }

    const orgIds = memberships.map((m) => m.organizationId);
    const userClients = await db
      .select()
      .from(clients)
      .where(inArray(clients.id, orgIds));

    const allowedClientCodes = userClients.map((c) => c.clientCode);

    if (allowedClientCodes.length > 0) {
      conditions.push(inArray(crews.clientId, allowedClientCodes));
    }
  }

  // Apply additional filters
  if (options?.type) {
    conditions.push(eq(crews.type, options.type as any));
  }
  if (options?.status) {
    conditions.push(eq(crews.status, options.status as any));
  }

  // Build and execute query
  if (conditions.length > 0) {
    query = query.where(and(...conditions)) as any;
  }

  return await query;
});

/**
 * Get a single crew by ID with authorization check
 *
 * @param crewId - Crew ID
 * @returns Crew or null
 */
export const getCrew = cache(async (crewId: string) => {
  const session = await verifyAuth();

  const [crew] = await db
    .select()
    .from(crews)
    .where(eq(crews.id, crewId))
    .limit(1);

  if (!crew) {
    return null;
  }

  // SuperAdmin can access any crew
  if (session.user.role === 'super_admin') {
    return crew;
  }

  // Client Admin - verify they have access to this crew's client
  const userId = session.user.id;
  const memberships = await db
    .select()
    .from(member)
    .where(eq(member.userId, userId));

  const orgIds = memberships.map((m) => m.organizationId);
  const userClients = await db
    .select()
    .from(clients)
    .where(inArray(clients.id, orgIds));

  const allowedClientCodes = userClients.map((c) => c.clientCode);

  if (!allowedClientCodes.includes(crew.clientId)) {
    throw new Error('Forbidden - Cannot access crew from other organization');
  }

  return crew;
});

// ============================================================================
// Conversation Data Access
// ============================================================================

/**
 * Get conversations with automatic multi-tenant filtering
 *
 * @param options - Filter options
 * @returns Array of conversations
 */
export const getConversations = cache(async (options?: {
  clientId?: string;
  crewId?: string;
  sentiment?: string;
  resolved?: boolean;
  limit?: number;
  offset?: number;
}) => {
  const session = await verifyAuth();

  let query = db.select().from(conversations);
  const conditions = [];

  // Apply client filtering based on role
  if (session.user.role === 'super_admin') {
    // SuperAdmin can optionally filter by clientId
    if (options?.clientId) {
      // Get clientCode from organization ID
      const [client] = await db
        .select()
        .from(clients)
        .where(eq(clients.id, options.clientId))
        .limit(1);

      if (client) {
        conditions.push(eq(conversations.clientId, client.clientCode));
      }
    }
  } else {
    // Client Admin - only their organization's conversations
    const userId = session.user.id;

    const memberships = await db
      .select()
      .from(member)
      .where(eq(member.userId, userId));

    if (memberships.length === 0) {
      return [];
    }

    const orgIds = memberships.map((m) => m.organizationId);
    const userClients = await db
      .select()
      .from(clients)
      .where(inArray(clients.id, orgIds));

    const allowedClientCodes = userClients.map((c) => c.clientCode);

    if (allowedClientCodes.length > 0) {
      conditions.push(inArray(conversations.clientId, allowedClientCodes));
    }
  }

  // Apply additional filters
  if (options?.crewId) {
    conditions.push(eq(conversations.crewId, options.crewId));
  }
  if (options?.sentiment) {
    conditions.push(eq(conversations.sentiment, options.sentiment as any));
  }
  if (options?.resolved !== undefined) {
    conditions.push(eq(conversations.resolved, options.resolved));
  }

  // Build and execute query
  if (conditions.length > 0) {
    query = query.where(and(...conditions)) as any;
  }

  // Apply pagination
  if (options?.limit) {
    query = query.limit(options.limit) as any;
  }
  if (options?.offset) {
    query = query.offset(options.offset) as any;
  }

  return await query;
});

// ============================================================================
// User/Member Data Access
// ============================================================================

/**
 * Get all users (SuperAdmin only)
 *
 * @throws Error if not SuperAdmin
 * @returns Array of users
 */
export const getUsers = cache(async () => {
  const session = await verifyAuth();

  if (session.user.role !== 'super_admin') {
    throw new Error('Forbidden - SuperAdmin access required');
  }

  return await db.select().from(user);
});

/**
 * Get users for a specific organization
 *
 * @param organizationId - Organization ID
 * @returns Array of users with member info
 */
export const getOrganizationUsers = cache(async (organizationId: string) => {
  const session = await verifyAuth();

  // Verify access to this organization
  if (session.user.role !== 'super_admin') {
    const activeOrgId = session.session.activeOrganizationId;
    if (activeOrgId !== organizationId) {
      throw new Error('Forbidden - Cannot access other organization users');
    }
  }

  // Get members for this organization
  const members = await db
    .select()
    .from(member)
    .where(eq(member.organizationId, organizationId));

  if (members.length === 0) {
    return [];
  }

  // Get user details
  const userIds = members.map((m) => m.userId);
  const users = await db
    .select()
    .from(user)
    .where(inArray(user.id, userIds));

  return users;
});

// ============================================================================
// Dashboard Stats (Helper)
// ============================================================================

/**
 * Get dashboard statistics for current user
 *
 * @returns Dashboard stats
 */
export const getDashboardStats = cache(async () => {
  const session = await verifyAuth();

  if (session.user.role === 'super_admin') {
    // SuperAdmin stats - all data
    const [allClients, allCrews, allUsers, allConversations] = await Promise.all([
      db.select().from(clients),
      db.select().from(crews),
      db.select().from(user).where(eq(user.role, 'client_admin')),
      db.select().from(conversations),
    ]);

    return {
      totalClients: allClients.length,
      activeClients: allClients.filter((c) => c.status === 'active').length,
      totalCrews: allCrews.length,
      totalUsers: allUsers.length,
      totalConversations: allConversations.length,
    };
  } else {
    // Client Admin stats - only their organization
    const userId = session.user.id;

    const memberships = await db
      .select()
      .from(member)
      .where(eq(member.userId, userId));

    if (memberships.length === 0) {
      return {
        totalClients: 0,
        activeClients: 0,
        totalCrews: 0,
        totalUsers: 0,
        totalConversations: 0,
      };
    }

    const orgIds = memberships.map((m) => m.organizationId);
    const userClients = await db
      .select()
      .from(clients)
      .where(inArray(clients.id, orgIds));

    const allowedClientCodes = userClients.map((c) => c.clientCode);

    const [orgCrews, orgMembers, orgConversations] = await Promise.all([
      db.select().from(crews).where(inArray(crews.clientId, allowedClientCodes)),
      db.select().from(member).where(inArray(member.organizationId, orgIds)),
      db.select().from(conversations).where(inArray(conversations.clientId, allowedClientCodes)),
    ]);

    return {
      totalClients: userClients.length,
      activeClients: userClients.filter((c) => c.status === 'active').length,
      totalCrews: orgCrews.length,
      totalUsers: orgMembers.length,
      totalConversations: orgConversations.length,
    };
  }
});
