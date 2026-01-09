import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { crews, clients } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';
import { requireAuth, isSuperAdmin } from '@/lib/auth/session-helpers';
import { logger, successResponse, errorResponse, ErrorCodes } from '@/lib/utils';

/**
 * GET /api/clients/:id/crews
 * Get all crews for a specific client
 * Returns crews ordered by createdAt DESC
 *
 * Authorization:
 * - SuperAdmin: Can view all client crews
 * - Client Admin: Forbidden (403)
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const requestId = request.headers.get('x-request-id');
  const startTime = Date.now();

  try {
    const { id: clientCode } = await params;

    await logger.info('Fetch client crews request received', {
      requestId,
      clientCode,
    });

    // Require authentication
    await requireAuth();

    // Only SuperAdmin can view client crews
    if (!await isSuperAdmin()) {
      await logger.warn('Fetch client crews failed - insufficient permissions', {
        requestId,
        clientCode,
      });
      return errorResponse(ErrorCodes.PERMISSION_SUPER_ADMIN_REQUIRED, null, requestId);
    }

    // Verify client exists
    const [client] = await db
      .select()
      .from(clients)
      .where(eq(clients.clientCode, clientCode))
      .limit(1);

    if (!client) {
      await logger.warn('Fetch client crews failed - client not found', {
        requestId,
        clientCode,
      });
      return errorResponse(ErrorCodes.CLIENT_NOT_FOUND, null, requestId);
    }

    // Get all crews for this client
    const clientCrews = await db
      .select()
      .from(crews)
      .where(eq(crews.clientId, clientCode))
      .orderBy(desc(crews.createdAt));

    const duration = Date.now() - startTime;
    await logger.info('Client crews fetched successfully', {
      requestId,
      clientCode,
      clientId: client.id,
      companyName: client.companyName,
      crewCount: clientCrews.length,
      duration,
      operation: 'fetch_client_crews',
    });

    return NextResponse.json({
      success: true,
      data: clientCrews,
      count: clientCrews.length,
      client: {
        clientCode: client.clientCode,
        companyName: client.companyName,
      },
      requestId,
    });
  } catch (error) {
    const duration = Date.now() - startTime;
    await logger.error(
      'Failed to fetch client crews',
      {
        requestId,
        duration,
        operation: 'fetch_client_crews',
      },
      error
    );
    return errorResponse(ErrorCodes.INTERNAL_ERROR, error, requestId);
  }
}
