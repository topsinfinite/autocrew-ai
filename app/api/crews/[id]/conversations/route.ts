import { NextRequest, NextResponse } from 'next/server';
import { getConversationsByCrew } from '@/lib/db/conversations';
import { requireAuth } from '@/lib/auth/session-helpers';
import { logger, successResponse, errorResponse, ErrorCodes } from '@/lib/utils';

/**
 * GET /api/crews/[id]/conversations
 * List all conversations for a specific crew
 *
 * Authorization:
 * - SuperAdmin: Can view conversations from any crew
 * - Client Admin: Can view conversations from crews in their organization
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

    await logger.info('Fetch crew conversations request received', {
      requestId,
      crewId: id,
      userId: session.user.id,
    });

    const conversations = await getConversationsByCrew(id);

    const duration = Date.now() - startTime;
    await logger.info('Crew conversations fetched successfully', {
      requestId,
      crewId: id,
      count: conversations.length,
      duration,
      operation: 'fetch_crew_conversations',
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
      'Failed to fetch crew conversations',
      {
        requestId,
        duration,
        operation: 'fetch_crew_conversations',
      },
      error
    );
    return errorResponse(ErrorCodes.INTERNAL_ERROR, error, requestId);
  }
}
