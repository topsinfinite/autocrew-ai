import { NextRequest, NextResponse } from 'next/server';
import { getConversations, discoverConversations } from '@/lib/db/conversations';

export async function GET(request: NextRequest) {
  try {
    const params = request.nextUrl.searchParams;

    // TODO: Get user from session/auth (when Better Auth is implemented)
    // For now, get from query param or headers
    const userRole = params.get('userRole') || 'client_admin'; // Default to client_admin
    const userClientId = params.get('userClientId'); // The client the user belongs to
    const requestedClientId = params.get('clientId');

    // AUTHORIZATION CHECK
    if (userRole === 'client_admin') {
      // Client admins can ONLY see their own organization's conversations
      if (!userClientId) {
        return NextResponse.json(
          { success: false, error: 'Unauthorized: No client association' },
          { status: 403 }
        );
      }

      // If they try to access another client's data, deny
      if (requestedClientId && requestedClientId !== userClientId) {
        return NextResponse.json(
          { success: false, error: 'Unauthorized: Cannot access other clients data' },
          { status: 403 }
        );
      }

      // Force clientId to be their own
      params.set('clientId', userClientId);
    }
    // Super admins can see any clientId (no filtering)

    const clientId = params.get('clientId');

    // If clientId provided, discover new conversations first
    if (clientId) {
      await discoverConversations(clientId);
    }

    const conversations = await getConversations({
      clientId: clientId || undefined,
      crewId: params.get('crewId') || undefined,
      sentiment: (params.get('sentiment') as any) || undefined,
      resolved: params.get('resolved') === 'true' ? true : undefined,
      limit: params.get('limit') ? parseInt(params.get('limit')!) : 50,
      offset: params.get('offset') ? parseInt(params.get('offset')!) : 0,
    });

    return NextResponse.json({
      success: true,
      data: conversations,
      count: conversations.length,
    });
  } catch (error) {
    console.error('GET /api/conversations error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch conversations' },
      { status: 500 }
    );
  }
}
