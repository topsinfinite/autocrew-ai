import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { crews, clients, member } from '@/db/schema';
import { insertCrewSchema } from '@/db/schema';
import { provisionCrew } from '@/lib/utils/crew';
import { eq, and, desc, asc, inArray } from 'drizzle-orm';
import type { CrewType, CrewStatus } from '@/types';
import { requireAuth, isSuperAdmin, requireAuthWithClient } from '@/lib/auth/session-helpers';
import { logger, successResponse, errorResponse, ErrorCodes } from '@/lib/utils';

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
  const requestId = request.headers.get('x-request-id');
  const startTime = Date.now();

  try {
    // Require authentication
    const session = await requireAuth();

    const searchParams = request.nextUrl.searchParams;
    const requestedClientId = searchParams.get('clientId');
    const type = searchParams.get('type');
    const status = searchParams.get('status');
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const order = searchParams.get('order') || 'desc';

    await logger.info('Fetch crews request received', {
      requestId,
      userId: session.user.id,
      filters: { clientId: requestedClientId, type, status, sortBy, order },
    });

    // Determine which clients the user can access
    let allowedClientCodes: string[] = [];
    const isSuperAdminUser = await isSuperAdmin();

    if (isSuperAdminUser) {
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
          await logger.warn('Fetch crews - requested client not found', {
            requestId,
            clientId: requestedClientId,
          });
          return NextResponse.json({
            success: true,
            data: [],
            count: 0,
            requestId,
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
        await logger.warn('Fetch crews - user has no organization membership', {
          requestId,
          userId,
        });
        return NextResponse.json({
          success: true,
          data: [],
          count: 0,
          requestId,
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

    const duration = Date.now() - startTime;
    await logger.info('Crews fetched successfully', {
      requestId,
      userId: session.user.id,
      isSuperAdmin: isSuperAdminUser,
      count: result.length,
      filters: { clientId: requestedClientId, type, status },
      sortBy,
      order,
      duration,
      operation: 'fetch_crews',
    });

    return NextResponse.json({
      success: true,
      data: result,
      count: result.length,
      requestId,
    });
  } catch (error) {
    const duration = Date.now() - startTime;
    await logger.error(
      'Failed to fetch crews',
      {
        requestId,
        duration,
        operation: 'fetch_crews',
      },
      error
    );
    return errorResponse(ErrorCodes.INTERNAL_ERROR, error, requestId);
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
  const requestId = request.headers.get('x-request-id');
  const startTime = Date.now();

  try {
    // Require authentication
    const session = await requireAuth();

    const body = await request.json();

    await logger.info('Create crew request received', {
      requestId,
      userId: session.user.id,
      clientId: body.clientId,
      crewName: body.name,
      crewType: body.type,
    });

    // Validate request body
    const validation = insertCrewSchema.safeParse(body);

    if (!validation.success) {
      await logger.warn('Create crew validation failed', {
        requestId,
        userId: session.user.id,
        errors: validation.error.issues,
      });
      return errorResponse(ErrorCodes.VALIDATION_FAILED, validation.error.issues, requestId);
    }

    const data = validation.data;

    // Verify client exists
    const [client] = await db
      .select()
      .from(clients)
      .where(eq(clients.clientCode, data.clientId))
      .limit(1);

    if (!client) {
      await logger.warn('Create crew failed - client not found', {
        requestId,
        clientId: data.clientId,
      });
      return errorResponse(ErrorCodes.CLIENT_NOT_FOUND, null, requestId);
    }

    // Authorization check: verify user can create crews for this client
    const isSuperAdminUser = await isSuperAdmin();

    if (!isSuperAdminUser) {
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
        await logger.warn('Create crew failed - insufficient permissions', {
          requestId,
          userId,
          clientId: data.clientId,
          organizationId: client.id,
        });
        return errorResponse(
          {
            code: 'PERMISSION_DENIED',
            status: 403,
            message: 'You can only create crews for your organization',
          },
          null,
          requestId
        );
      }
    }

    // Provision crew (creates tables for customer_support, generates crew code)
    try {
      await logger.info('Starting crew provisioning', {
        requestId,
        clientId: data.clientId,
        crewName: data.name,
        crewType: data.type,
        operation: 'create_crew',
      });

      const result = await provisionCrew({
        name: data.name,
        clientId: data.clientId,
        type: data.type as CrewType,
        webhookUrl: data.webhookUrl,
        status: data.status as CrewStatus | undefined,
      });

      const duration = Date.now() - startTime;
      await logger.info('Crew created successfully', {
        requestId,
        userId: session.user.id,
        crewId: result.crew.id,
        crewCode: result.crew.crewCode,
        crewName: result.crew.name,
        crewType: result.crew.type,
        clientId: data.clientId,
        tablesCreated: result.tablesCreated,
        duration,
        operation: 'create_crew',
      });

      return NextResponse.json(
        {
          success: true,
          data: result.crew,
          tablesCreated: result.tablesCreated,
          message: `Crew created successfully: ${result.crew.crewCode}`,
          requestId,
        },
        { status: 201 }
      );
    } catch (provisionError: any) {
      // Handle unique constraint violation (duplicate crew code - should be rare)
      if (provisionError.code === '23505') {
        await logger.warn('Create crew failed - duplicate crew code', {
          requestId,
          clientId: data.clientId,
          crewName: data.name,
        });
        return errorResponse(
          {
            code: 'CREW_ALREADY_EXISTS',
            status: 409,
            message: 'A crew with this code already exists. Please try again.',
          },
          null,
          requestId
        );
      }
      throw provisionError;
    }
  } catch (error) {
    const duration = Date.now() - startTime;
    await logger.error(
      'Failed to create crew',
      {
        requestId,
        duration,
        operation: 'create_crew',
      },
      error
    );
    return errorResponse(ErrorCodes.INTERNAL_ERROR, error, requestId);
  }
}
