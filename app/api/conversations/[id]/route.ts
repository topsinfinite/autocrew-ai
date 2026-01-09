import { NextRequest, NextResponse } from 'next/server';
import { getConversationById } from '@/lib/db/conversations';
import { requireAuth, isSuperAdmin } from '@/lib/auth/session-helpers';
import { db } from '@/db';
import { conversations, member, clients } from '@/db/schema';
import { eq, inArray } from 'drizzle-orm';

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
  try {
    // Require authentication
    const session = await requireAuth();
    const { id } = await params;

    // Get the conversation to check ownership
    const [conv] = await db
      .select()
      .from(conversations)
      .where(eq(conversations.id, id))
      .limit(1);

    if (!conv) {
      return NextResponse.json(
        { success: false, error: 'Conversation not found' },
        { status: 404 }
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
        return NextResponse.json(
          { success: false, error: 'Forbidden - No organization membership' },
          { status: 403 }
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
        return NextResponse.json(
          { success: false, error: 'Forbidden - Cannot access other organization\'s conversations' },
          { status: 403 }
        );
      }
    }

    // Fetch full conversation with transcript
    const conversation = await getConversationById(id);

    if (!conversation) {
      return NextResponse.json(
        { success: false, error: 'Conversation not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: conversation,
    });
  } catch (error) {
    console.error('GET /api/conversations/[id] error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch conversation' },
      { status: 500 }
    );
  }
}
