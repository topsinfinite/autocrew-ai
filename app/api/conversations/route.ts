import { NextRequest, NextResponse } from 'next/server';
import { getConversations, discoverConversations } from '@/lib/db/conversations';
import { requireAuth, isSuperAdmin } from '@/lib/auth/session-helpers';
import { db } from '@/db';
import { member, clients } from '@/db/schema';
import { eq, inArray } from 'drizzle-orm';
import { logger, errorResponse, ErrorCodes } from '@/lib/utils';

/**
 * GET /api/conversations
 * List conversations with multi-tenant filtering
 *
 * Authorization:
 * - SuperAdmin: Can view all conversations (optionally filter by clientId)
 * - Client Admin: Can only view conversations from their organization
 *
 * Query params: clientId, crewId, sentiment, resolved, limit, offset
 */
export async function GET(request: NextRequest) {
  const requestId = request.headers.get('x-request-id');
  const startTime = Date.now();

  try {
    // Require authentication
    const session = await requireAuth();

    const params = request.nextUrl.searchParams;
    const requestedClientCode = params.get('clientId');

    await logger.info('Fetch conversations request received', {
      requestId,
      userId: session.user.id,
      filters: {
        clientId: requestedClientCode,
        crewId: params.get('crewId'),
        sentiment: params.get('sentiment'),
        resolved: params.get('resolved'),
      },
    });

    // Determine which clients the user can access
    let allowedClientCodes: string[] = [];
    const isSuperAdminUser = await isSuperAdmin();

    if (isSuperAdminUser) {
      // SuperAdmin can see all conversations, or filter by specific clientCode
      if (requestedClientCode) {
        // Verify the client exists
        const [client] = await db
          .select()
          .from(clients)
          .where(eq(clients.clientCode, requestedClientCode))
          .limit(1);

        if (client) {
          allowedClientCodes = [client.clientCode];
        } else {
          // Requested client doesn't exist
          await logger.warn('Fetch conversations - client not found', {
            requestId,
            clientCode: requestedClientCode,
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
      // Client Admin - only see conversations from their organization(s)
      // @ts-ignore - Better Auth additionalFields typing
      const userId = session.user.id;

      // Get user's organization memberships
      const memberships = await db
        .select()
        .from(member)
        .where(eq(member.userId, userId));

      if (memberships.length === 0) {
        // User has no organization membership - return empty
        await logger.warn('Fetch conversations - no organization membership', {
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

      // If Client Admin tries to access a client that's not theirs, deny
      if (requestedClientCode && !allowedClientCodes.includes(requestedClientCode)) {
        await logger.warn('Fetch conversations failed - forbidden', {
          requestId,
          userId,
          requestedClientCode,
          allowedClientCodes,
        });
        return errorResponse(
          {
            code: 'PERMISSION_DENIED',
            status: 403,
            message: 'Cannot access other organization\'s data',
          },
          null,
          requestId
        );
      }
    }

    // If clientIds specified, discover new conversations first
    if (allowedClientCodes.length > 0) {
      for (const clientCode of allowedClientCodes) {
        await discoverConversations(clientCode);
      }
    }

    // Build filter object
    const filters: any = {
      crewId: params.get('crewId') || undefined,
      sentiment: (params.get('sentiment') as any) || undefined,
      resolved: params.get('resolved') === 'true' ? true : params.get('resolved') === 'false' ? false : undefined,
      fromDate: params.get('fromDate') ? new Date(params.get('fromDate')!) : undefined,
      toDate: params.get('toDate') ? new Date(params.get('toDate')!) : undefined,
      limit: params.get('limit') ? parseInt(params.get('limit')!) : 50,
      offset: params.get('offset') ? parseInt(params.get('offset')!) : 0,
    };

    // Add client filtering for Client Admins or when SuperAdmin specifies clientId
    if (allowedClientCodes.length > 0) {
      // If only one client code, use it directly; otherwise we need to query across multiple
      if (allowedClientCodes.length === 1) {
        filters.clientId = allowedClientCodes[0];
      } else {
        // For multiple clients, we'll need to fetch and merge results
        // For now, let's use the first one (typically users have only one org)
        filters.clientId = allowedClientCodes[0];
      }
    }

    const conversations = await getConversations(filters);

    const duration = Date.now() - startTime;
    await logger.info('Conversations fetched successfully', {
      requestId,
      userId: session.user.id,
      isSuperAdmin: isSuperAdminUser,
      count: conversations.length,
      filters,
      duration,
      operation: 'fetch_conversations',
    });

    return NextResponse.json({
      success: true,
      data: conversations,
      count: conversations.length,
      requestId,
    });
  } catch (error) {
    const duration = Date.now() - startTime;
    await logger.error(
      'Failed to fetch conversations',
      {
        requestId,
        duration,
        operation: 'fetch_conversations',
      },
      error
    );
    return errorResponse(ErrorCodes.INTERNAL_ERROR, error, requestId);
  }
}
