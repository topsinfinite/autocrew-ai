import { NextRequest, NextResponse } from 'next/server';
import { getConversationsByCrew } from '@/lib/db/conversations';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const conversations = await getConversationsByCrew(id);

    return NextResponse.json({
      success: true,
      data: conversations,
      count: conversations.length,
    });
  } catch (error) {
    console.error('GET /api/crews/[id]/conversations error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch conversations' },
      { status: 500 }
    );
  }
}
