import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { crews, clients } from '@/db/schema';
import { insertCrewSchema } from '@/db/schema';
import { provisionCrew } from '@/lib/utils/crew-provisioning';
import { eq, and, desc, asc } from 'drizzle-orm';
import type { CrewType, CrewStatus } from '@/types';

/**
 * GET /api/crews
 * List all crews with optional filtering and sorting
 * Query params: clientId, type, status, sortBy, order
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const clientId = searchParams.get('clientId');
    const type = searchParams.get('type');
    const status = searchParams.get('status');
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const order = searchParams.get('order') || 'desc';

    // Build where conditions
    const conditions = [];
    if (clientId) {
      conditions.push(eq(crews.clientId, clientId));
    }
    if (type) {
      conditions.push(eq(crews.type, type as CrewType));
    }
    if (status) {
      conditions.push(eq(crews.status, status as CrewStatus));
    }

    // Build query
    let query = db.select().from(crews);

    // Apply filters if any
    if (conditions.length > 0) {
      query = query.where(and(...conditions)) as any;
    }

    // Apply sorting
    const validSortColumns = ['createdAt', 'updatedAt', 'name', 'type', 'status'] as const;
    const sortColumn = validSortColumns.includes(sortBy as any)
      ? crews[sortBy as keyof typeof crews]
      : crews.createdAt;
    query = query.orderBy(order === 'asc' ? asc(sortColumn as any) : desc(sortColumn as any)) as any;

    // Execute query
    const result = await query;

    return NextResponse.json({
      success: true,
      data: result,
      count: result.length,
    });
  } catch (error) {
    console.error('GET /api/crews error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch crews',
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/crews
 * Create a new crew with dynamic tables (for customer_support type)
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate request body
    const validation = insertCrewSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          error: 'Validation failed',
          details: validation.error.issues,
        },
        { status: 400 }
      );
    }

    const data = validation.data;

    // Verify client exists
    const [client] = await db
      .select()
      .from(clients)
      .where(eq(clients.clientCode, data.clientId))
      .limit(1);

    if (!client) {
      return NextResponse.json(
        {
          success: false,
          error: `Client not found: ${data.clientId}`,
        },
        { status: 404 }
      );
    }

    // Provision crew (creates tables for customer_support, generates crew code)
    try {
      const result = await provisionCrew({
        name: data.name,
        clientId: data.clientId,
        type: data.type as CrewType,
        webhookUrl: data.webhookUrl,
        status: data.status as CrewStatus | undefined,
      });

      return NextResponse.json(
        {
          success: true,
          data: result.crew,
          tablesCreated: result.tablesCreated,
          message: `Crew created successfully: ${result.crew.crewCode}`,
        },
        { status: 201 }
      );
    } catch (provisionError: any) {
      // Handle unique constraint violation (duplicate crew code - should be rare)
      if (provisionError.code === '23505') {
        return NextResponse.json(
          {
            success: false,
            error: 'A crew with this code already exists. Please try again.',
          },
          { status: 409 }
        );
      }
      throw provisionError;
    }
  } catch (error) {
    console.error('POST /api/crews error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create crew',
      },
      { status: 500 }
    );
  }
}
