import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { clients } from '@/db/schema';
import { insertClientSchema } from '@/db/schema';
import { eq } from 'drizzle-orm';

/**
 * GET /api/clients/:id
 * Get a single client by ID
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const [client] = await db
      .select()
      .from(clients)
      .where(eq(clients.id, id))
      .limit(1);

    if (!client) {
      return NextResponse.json(
        {
          success: false,
          error: 'Client not found',
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: client,
    });
  } catch (error) {
    console.error('GET /api/clients/:id error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch client',
      },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/clients/:id
 * Update a client by ID
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    // Validate with partial schema (all fields optional)
    const validation = insertClientSchema.partial().safeParse(body);

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

    // Check if client exists
    const [existingClient] = await db
      .select()
      .from(clients)
      .where(eq(clients.id, id))
      .limit(1);

    if (!existingClient) {
      return NextResponse.json(
        {
          success: false,
          error: 'Client not found',
        },
        { status: 404 }
      );
    }

    // Update client
    const [updatedClient] = await db
      .update(clients)
      .set({
        ...data,
        updatedAt: new Date(),
      })
      .where(eq(clients.id, id))
      .returning();

    return NextResponse.json({
      success: true,
      data: updatedClient,
      message: 'Client updated successfully',
    });
  } catch (error) {
    console.error('PATCH /api/clients/:id error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to update client',
      },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/clients/:id
 * Delete a client by ID
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Check if client exists
    const [existingClient] = await db
      .select()
      .from(clients)
      .where(eq(clients.id, id))
      .limit(1);

    if (!existingClient) {
      return NextResponse.json(
        {
          success: false,
          error: 'Client not found',
        },
        { status: 404 }
      );
    }

    // Delete client
    await db.delete(clients).where(eq(clients.id, id));

    return NextResponse.json({
      success: true,
      message: 'Client deleted successfully',
    });
  } catch (error) {
    console.error('DELETE /api/clients/:id error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to delete client',
      },
      { status: 500 }
    );
  }
}
