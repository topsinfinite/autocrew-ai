import { NextRequest, NextResponse } from 'next/server';
import { getConversationById } from '@/lib/db/conversations';
import { requireAuth, isSuperAdmin } from '@/lib/auth/session-helpers';
import { db } from '@/db';
import { conversations, member, clients } from '@/db/schema';
import { eq, inArray } from 'drizzle-orm';
import { logger, successResponse, errorResponse, ErrorCodes } from '@/lib/utils';

/**
 * GET /api/conversations/[id]
 * Get a single conversation with full transcript
 *
 * Authorization:
 * - SuperAdmin: Can view any conversation
 * - Client Admin: Can only view conversations from their organization
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const requestId = request.headers.get('x-request-id');
  const startTime = Date.now();

  try {
    // Require authentication
    const session = await requireAuth();
    const { id } = await params;

    await logger.info('Fetch conversation request received', {
      requestId,
      conversationId: id,
      userId: session.user.id,
    });

    // Get the conversation to check ownership
    const [conv] = await db
      .select()
      .from(conversations)
      .where(eq(conversations.id, id))
      .limit(1);

    if (!conv) {
      await logger.warn('Fetch conversation failed - not found', {
        requestId,
        conversationId: id,
      });
      return errorResponse(
        {
          code: 'CONVERSATION_NOT_FOUND',
          status: 404,
          message: 'Conversation not found',
        },
        null,
        requestId
      );
    }

    // Authorization check
    if (!(await isSuperAdmin())) {
      // Client Admin - verify they belong to the conversation's organization
      const userId = session.user.id;

      // Get user's organization memberships
      const memberships = await db
        .select()
        .from(member)
        .where(eq(member.userId, userId));

      if (memberships.length === 0) {
        await logger.warn('Fetch conversation failed - no organization membership', {
          requestId,
          conversationId: id,
          userId,
        });
        return errorResponse(
          {
            code: 'PERMISSION_DENIED',
            status: 403,
            message: 'No organization membership',
          },
          null,
          requestId
        );
      }

      // Get clientCodes for user's organizations
      const orgIds = memberships.map(m => m.organizationId);
      const userClients = await db
        .select()
        .from(clients)
        .where(inArray(clients.id, orgIds));

      const allowedClientCodes = userClients.map(c => c.clientCode);

      // Check if conversation belongs to one of user's organizations
      if (!allowedClientCodes.includes(conv.clientId)) {
        await logger.warn('Fetch conversation failed - forbidden', {
          requestId,
          conversationId: id,
          userId,
          conversationClientId: conv.clientId,
          allowedClientCodes,
        });
        return errorResponse(
          {
            code: 'PERMISSION_DENIED',
            status: 403,
            message: 'Cannot access other organization\'s conversations',
          },
          null,
          requestId
        );
      }
    }

    // Fetch full conversation with transcript
    const conversation = await getConversationById(id);

    if (!conversation) {
      await logger.warn('Fetch conversation failed - not found after authorization', {
        requestId,
        conversationId: id,
      });
      return errorResponse(
        {
          code: 'CONVERSATION_NOT_FOUND',
          status: 404,
          message: 'Conversation not found',
        },
        null,
        requestId
      );
    }

    const duration = Date.now() - startTime;
    await logger.info('Conversation fetched successfully', {
      requestId,
      conversationId: id,
      clientId: conversation.clientId,
      crewId: conversation.crewId,
      duration,
      operation: 'fetch_conversation',
    });

    return successResponse(conversation, undefined, requestId);
  } catch (error) {
    const duration = Date.now() - startTime;
    await logger.error(
      'Failed to fetch conversation',
      {
        requestId,
        duration,
        operation: 'fetch_conversation',
      },
      error
    );
    return errorResponse(ErrorCodes.INTERNAL_ERROR, error, requestId);
  }
}
