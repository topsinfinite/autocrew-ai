import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { crews, clients, member } from '@/db/schema';
import { insertCrewSchema } from '@/db/schema';
import { provisionCrew } from '@/lib/utils/crew';
import { eq, and, desc, asc, inArray } from 'drizzle-orm';
import type { CrewType, CrewStatus } from '@/types';
import { requireAuth, isSuperAdmin, requireAuthWithClient } from '@/lib/auth/session-helpers';

/**
 * GET /api/crews
 * List crews with multi-tenant filtering
 *
 * Authorization:
 * - SuperAdmin: Can view all crews (optionally filter by clientId)
 * - Client Admin: Can only view crews from their organization
 *
 * Query params: clientId, type, status, sortBy, order
 */
export async function GET(request: NextRequest) {
  try {
    // Require authentication
    const session = await requireAuth();

    const searchParams = request.nextUrl.searchParams;
    const requestedClientId = searchParams.get('clientId');
    const type = searchParams.get('type');
    const status = searchParams.get('status');
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const order = searchParams.get('order') || 'desc';

    // Determine which clients the user can access
    let allowedClientCodes: string[] = [];

    if (await isSuperAdmin()) {
      // SuperAdmin can see all crews, or filter by specific clientId
      if (requestedClientId) {
        // Get clientCode for the requested organization ID
        const [client] = await db
          .select()
          .from(clients)
          .where(eq(clients.id, requestedClientId))
          .limit(1);

        if (client) {
          allowedClientCodes = [client.clientCode];
        } else {
          // Requested client doesn't exist
          return NextResponse.json({
            success: true,
            data: [],
            count: 0,
          });
        }
      }
      // If no clientId specified, don't filter (SuperAdmin sees all)
    } else {
      // Client Admin - only see crews from their organization(s)
      // @ts-ignore - Better Auth additionalFields typing
      const userId = session.user.id;

      // Get user's organization memberships
      const memberships = await db
        .select()
        .from(member)
        .where(eq(member.userId, userId));

      if (memberships.length === 0) {
        // User has no organization membership - return empty
        return NextResponse.json({
          success: true,
          data: [],
          count: 0,
        });
      }

      // Get clientCodes for user's organizations
      const orgIds = memberships.map(m => m.organizationId);
      const userClients = await db
        .select()
        .from(clients)
        .where(inArray(clients.id, orgIds));

      allowedClientCodes = userClients.map(c => c.clientCode);
    }

    // Build where conditions
    const conditions = [];

    // Apply client filtering for non-SuperAdmins or when SuperAdmin specifies clientId
    if (allowedClientCodes.length > 0) {
      conditions.push(inArray(crews.clientId, allowedClientCodes));
    }

    if (type) {
      conditions.push(eq(crews.type, type as CrewType));
    }
    if (status) {
      conditions.push(eq(crews.status, status as CrewStatus));
    }

    // Build query
    let query = db.select().from(crews);

    // Apply filters if any
    if (conditions.length > 0) {
      query = query.where(and(...conditions)) as any;
    }

    // Apply sorting
    const validSortColumns = ['createdAt', 'updatedAt', 'name', 'type', 'status'] as const;
    const sortColumn = validSortColumns.includes(sortBy as any)
      ? crews[sortBy as keyof typeof crews]
      : crews.createdAt;
    query = query.orderBy(order === 'asc' ? asc(sortColumn as any) : desc(sortColumn as any)) as any;

    // Execute query
    const result = await query;

    return NextResponse.json({
      success: true,
      data: result,
      count: result.length,
    });
  } catch (error) {
    console.error('GET /api/crews error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch crews',
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/crews
 * Create a new crew with dynamic tables (for customer_support type)
 *
 * Authorization:
 * - SuperAdmin: Can create crews for any client
 * - Client Admin: Can only create crews for their organization
 */
export async function POST(request: NextRequest) {
  try {
    // Require authentication
    const session = await requireAuth();

    const body = await request.json();

    // Validate request body
    const validation = insertCrewSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          error: 'Validation failed',
          details: validation.error.issues,
        },
        { status: 400 }
      );
    }

    const data = validation.data;

    // Verify client exists
    const [client] = await db
      .select()
      .from(clients)
      .where(eq(clients.clientCode, data.clientId))
      .limit(1);

    if (!client) {
      return NextResponse.json(
        {
          success: false,
          error: `Client not found: ${data.clientId}`,
        },
        { status: 404 }
      );
    }

    // Authorization check: verify user can create crews for this client
    if (!await isSuperAdmin()) {
      // Client Admin - verify they belong to this organization
      // @ts-ignore - Better Auth additionalFields typing
      const userId = session.user.id;

      const membership = await db
        .select()
        .from(member)
        .where(
          and(
            eq(member.userId, userId),
            eq(member.organizationId, client.id)
          )
        )
        .limit(1);

      if (membership.length === 0) {
        return NextResponse.json(
          {
            success: false,
            error: 'Forbidden - You can only create crews for your organization',
          },
          { status: 403 }
        );
      }
    }

    // Provision crew (creates tables for customer_support, generates crew code)
    try {
      const result = await provisionCrew({
        name: data.name,
        clientId: data.clientId,
        type: data.type as CrewType,
        webhookUrl: data.webhookUrl,
        status: data.status as CrewStatus | undefined,
      });

      return NextResponse.json(
        {
          success: true,
          data: result.crew,
          tablesCreated: result.tablesCreated,
          message: `Crew created successfully: ${result.crew.crewCode}`,
        },
        { status: 201 }
      );
    } catch (provisionError: any) {
      // Handle unique constraint violation (duplicate crew code - should be rare)
      if (provisionError.code === '23505') {
        return NextResponse.json(
          {
            success: false,
            error: 'A crew with this code already exists. Please try again.',
          },
          { status: 409 }
        );
      }
      throw provisionError;
    }
  } catch (error) {
    console.error('POST /api/crews error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create crew',
      },
      { status: 500 }
    );
  }
}
