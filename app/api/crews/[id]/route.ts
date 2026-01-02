import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { crews } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { deprovisionCrew } from '@/lib/utils/crew-provisioning';
import type { CrewStatus } from '@/types';

/**
 * GET /api/crews/:id
 * Get a single crew by ID
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const [crew] = await db.select().from(crews).where(eq(crews.id, id)).limit(1);

    if (!crew) {
      return NextResponse.json(
        {
          success: false,
          error: 'Crew not found',
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: crew,
    });
  } catch (error) {
    console.error('GET /api/crews/:id error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch crew',
      },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/crews/:id
 * Update a crew (name, status, webhookUrl only)
 * Note: type, clientId, crewCode are immutable
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    // Check if crew exists
    const [existingCrew] = await db.select().from(crews).where(eq(crews.id, id)).limit(1);

    if (!existingCrew) {
      return NextResponse.json(
        {
          success: false,
          error: 'Crew not found',
        },
        { status: 404 }
      );
    }

    // Prevent updating immutable fields
    const { type, clientId, crewCode, config, ...allowedUpdates } = body;

    if (type || clientId || crewCode || config) {
      return NextResponse.json(
        {
          success: false,
          error: 'Cannot update immutable fields: type, clientId, crewCode, config',
        },
        { status: 400 }
      );
    }

    // Validate status if provided
    if (allowedUpdates.status) {
      const validStatuses: CrewStatus[] = ['active', 'inactive', 'error'];
      if (!validStatuses.includes(allowedUpdates.status)) {
        return NextResponse.json(
          {
            success: false,
            error: `Invalid status. Must be one of: ${validStatuses.join(', ')}`,
          },
          { status: 400 }
        );
      }
    }

    // Update crew with allowed fields only
    const [updatedCrew] = await db
      .update(crews)
      .set({
        ...allowedUpdates,
        updatedAt: new Date(),
      })
      .where(eq(crews.id, id))
      .returning();

    return NextResponse.json({
      success: true,
      data: updatedCrew,
      message: 'Crew updated successfully',
    });
  } catch (error) {
    console.error('PATCH /api/crews/:id error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to update crew',
      },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/crews/:id
 * Delete a crew and cleanup associated tables
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Check if crew exists
    const [existingCrew] = await db.select().from(crews).where(eq(crews.id, id)).limit(1);

    if (!existingCrew) {
      return NextResponse.json(
        {
          success: false,
          error: 'Crew not found',
        },
        { status: 404 }
      );
    }

    // Deprovision crew (deletes record and cleans up tables)
    await deprovisionCrew(id);

    return NextResponse.json({
      success: true,
      message: `Crew deleted successfully: ${existingCrew.crewCode}`,
    });
  } catch (error) {
    console.error('DELETE /api/crews/:id error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to delete crew',
      },
      { status: 500 }
    );
  }
}
