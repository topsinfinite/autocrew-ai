import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { clients } from '@/db/schema';
import { insertClientSchema } from '@/db/schema';
import { generateClientCode } from '@/lib/utils/generators/client-code-generator';
import { generateSlug, generateUniqueSlug, logger, successResponse, errorResponse, ErrorCodes } from '@/lib/utils';
import { eq, and, desc, asc } from 'drizzle-orm';
import { nanoid } from 'nanoid';
import { requireAuth, isSuperAdmin } from '@/lib/auth/session-helpers';
import { mapDatabaseError } from '@/lib/errors/error-codes';

/**
 * GET /api/clients
 * List all clients with optional filtering and sorting
 *
 * Authorization:
 * - SuperAdmin: Can view all clients
 * - Client Admin: Forbidden (403)
 *
 * Query params: status, plan, sortBy, order
 */
export async function GET(request: NextRequest) {
  const requestId = request.headers.get('x-request-id');
  const startTime = Date.now();

  try {
    await logger.info('Fetch clients request received', { requestId });

    // Require authentication
    await requireAuth();

    // Only SuperAdmin can list all clients
    if (!await isSuperAdmin()) {
      await logger.warn('Fetch clients failed - insufficient permissions', {
        requestId,
      });
      return errorResponse(ErrorCodes.PERMISSION_SUPER_ADMIN_REQUIRED, null, requestId);
    }

    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get('status');
    const plan = searchParams.get('plan');
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const order = searchParams.get('order') || 'desc';

    // Build where conditions
    const conditions = [];
    if (status) {
      conditions.push(eq(clients.status, status as 'active' | 'inactive' | 'trial'));
    }
    if (plan) {
      conditions.push(eq(clients.plan, plan as 'starter' | 'professional' | 'enterprise'));
    }

    // Build query
    let query = db.select().from(clients);

    // Apply filters if any
    if (conditions.length > 0) {
      query = query.where(and(...conditions)) as any;
    }

    // Apply sorting
    const validSortColumns = ['createdAt', 'updatedAt', 'companyName', 'status', 'plan'] as const;
    const sortColumn = validSortColumns.includes(sortBy as any)
      ? clients[sortBy as keyof typeof clients]
      : clients.createdAt;
    query = query.orderBy(order === 'asc' ? asc(sortColumn as any) : desc(sortColumn as any)) as any;

    // Execute query
    const result = await query;

    const duration = Date.now() - startTime;
    await logger.info('Clients fetched successfully', {
      requestId,
      count: result.length,
      filters: { status, plan },
      sortBy,
      order,
      duration,
      operation: 'fetch_clients',
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
      'Failed to fetch clients',
      {
        requestId,
        duration,
        operation: 'fetch_clients',
      },
      error
    );
    return errorResponse(ErrorCodes.INTERNAL_ERROR, error, requestId);
  }
}

/**
 * POST /api/clients
 * Create a new client
 *
 * Authorization:
 * - SuperAdmin: Can create clients
 * - Client Admin: Forbidden (403)
 */
export async function POST(request: NextRequest) {
  const requestId = request.headers.get('x-request-id');
  const startTime = Date.now();

  try {
    await logger.info('Create client request received', { requestId });

    // Require authentication
    await requireAuth();

    // Only SuperAdmin can create clients
    if (!await isSuperAdmin()) {
      await logger.warn('Create client failed - insufficient permissions', {
        requestId,
      });
      return errorResponse(ErrorCodes.PERMISSION_SUPER_ADMIN_REQUIRED, null, requestId);
    }

    const body = await request.json();

    // Validate request body
    const validation = insertClientSchema.safeParse(body);

    if (!validation.success) {
      await logger.warn('Create client validation failed', {
        requestId,
        errors: validation.error.issues,
      });
      return errorResponse(ErrorCodes.VALIDATION_FAILED, validation.error.issues, requestId);
    }

    const data = validation.data;

    // Auto-generate ID if not provided (using nanoid like Better Auth)
    const id = data.id || `org_${nanoid(16)}`;

    // Auto-generate client code if not provided
    const clientCode = data.clientCode || await generateClientCode(data.companyName);

    // Auto-generate slug if not provided
    const baseSlug = data.slug || generateSlug(data.companyName);
    const slug = await generateUniqueSlug(baseSlug, async (slugToCheck) => {
      const existing = await db
        .select()
        .from(clients)
        .where(eq(clients.slug, slugToCheck))
        .limit(1);
      return existing.length > 0;
    });

    // Insert client
    try {
      const [newClient] = await db
        .insert(clients)
        .values({
          ...data,
          id,
          clientCode,
          slug,
          status: data.status || 'trial',
        })
        .returning();

      const duration = Date.now() - startTime;
      await logger.info('Client created successfully', {
        requestId,
        clientId: newClient.id,
        clientCode,
        companyName: newClient.companyName,
        duration,
        operation: 'create_client',
      });

      return NextResponse.json(
        {
          success: true,
          data: newClient,
          message: `Client created successfully with code: ${clientCode}`,
          requestId,
        },
        { status: 201 }
      );
    } catch (dbError: any) {
      // Handle unique constraint violation (duplicate client code)
      if (dbError.code === '23505') {
        await logger.warn('Create client failed - duplicate client code', {
          requestId,
          clientCode,
        });
        return errorResponse(ErrorCodes.CLIENT_ALREADY_EXISTS, null, requestId);
      }
      throw dbError;
    }
  } catch (error) {
    const duration = Date.now() - startTime;
    await logger.error(
      'Failed to create client',
      {
        requestId,
        duration,
        operation: 'create_client',
      },
      error
    );
    return errorResponse(ErrorCodes.INTERNAL_ERROR, error, requestId);
  }
}
