import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { clients } from '@/db/schema';
import { insertClientSchema } from '@/db/schema';
import { generateClientCode } from '@/lib/utils/client-code-generator';
import { eq, and, desc, asc } from 'drizzle-orm';

/**
 * GET /api/clients
 * List all clients with optional filtering and sorting
 * Query params: status, plan, sortBy, order
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get('status');
    const plan = searchParams.get('plan');
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const order = searchParams.get('order') || 'desc';

    // Build where conditions
    const conditions = [];
    if (status) {
      conditions.push(eq(clients.status, status as 'active' | 'inactive' | 'trial'));
    }
    if (plan) {
      conditions.push(eq(clients.plan, plan as 'starter' | 'professional' | 'enterprise'));
    }

    // Build query
    let query = db.select().from(clients);

    // Apply filters if any
    if (conditions.length > 0) {
      query = query.where(and(...conditions)) as any;
    }

    // Apply sorting
    const validSortColumns = ['createdAt', 'updatedAt', 'companyName', 'status', 'plan'] as const;
    const sortColumn = validSortColumns.includes(sortBy as any)
      ? clients[sortBy as keyof typeof clients]
      : clients.createdAt;
    query = query.orderBy(order === 'asc' ? asc(sortColumn as any) : desc(sortColumn as any)) as any;

    // Execute query
    const result = await query;

    return NextResponse.json({
      success: true,
      data: result,
      count: result.length,
    });
  } catch (error) {
    console.error('GET /api/clients error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch clients',
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/clients
 * Create a new client
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate request body
    const validation = insertClientSchema.safeParse(body);

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

    // Auto-generate client code if not provided
    const clientCode = data.clientCode || await generateClientCode(data.companyName);

    // Insert client
    try {
      const [newClient] = await db
        .insert(clients)
        .values({
          ...data,
          clientCode,
          status: data.status || 'trial',
        })
        .returning();

      return NextResponse.json(
        {
          success: true,
          data: newClient,
          message: `Client created successfully with code: ${clientCode}`,
        },
        { status: 201 }
      );
    } catch (dbError: any) {
      // Handle unique constraint violation (duplicate client code)
      if (dbError.code === '23505') {
        return NextResponse.json(
          {
            success: false,
            error: 'A client with this code already exists',
          },
          { status: 409 }
        );
      }
      throw dbError;
    }
  } catch (error) {
    console.error('POST /api/clients error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to create client',
      },
      { status: 500 }
    );
  }
}
