import { NextRequest, NextResponse } from 'next/server';
import { getConversationById } from '@/lib/db/conversations';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const searchParams = request.nextUrl.searchParams;

    // TODO: Get user from session/auth (when Better Auth is implemented)
    const userRole = searchParams.get('userRole') || 'client_admin';
    const userClientId = searchParams.get('userClientId');

    const conversation = await getConversationById(id);

    if (!conversation) {
      return NextResponse.json(
        { success: false, error: 'Conversation not found' },
        { status: 404 }
      );
    }

    // AUTHORIZATION CHECK
    if (userRole === 'client_admin') {
      // Client admins can only access their own conversations
      if (conversation.clientId !== userClientId) {
        return NextResponse.json(
          { success: false, error: 'Unauthorized: Cannot access this conversation' },
          { status: 403 }
        );
      }
    }
    // Super admins can access any conversation

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
