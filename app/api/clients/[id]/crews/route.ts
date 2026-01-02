import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { crews, clients } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';

/**
 * GET /api/clients/:id/crews
 * Get all crews for a specific client
 * Returns crews ordered by createdAt DESC
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: clientCode } = await params;

    // Verify client exists
    const [client] = await db
      .select()
      .from(clients)
      .where(eq(clients.clientCode, clientCode))
      .limit(1);

    if (!client) {
      return NextResponse.json(
        {
          success: false,
          error: `Client not found: ${clientCode}`,
        },
        { status: 404 }
      );
    }

    // Get all crews for this client
    const clientCrews = await db
      .select()
      .from(crews)
      .where(eq(crews.clientId, clientCode))
      .orderBy(desc(crews.createdAt));

    return NextResponse.json({
      success: true,
      data: clientCrews,
      count: clientCrews.length,
      client: {
        clientCode: client.clientCode,
        companyName: client.companyName,
      },
    });
  } catch (error) {
    console.error('GET /api/clients/:id/crews error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch client crews',
      },
      { status: 500 }
    );
  }
}
