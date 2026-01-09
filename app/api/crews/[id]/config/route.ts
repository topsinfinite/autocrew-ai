import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { crews, clients, member } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { requireAuth, isSuperAdmin } from '@/lib/auth/session-helpers';
import type { CrewConfig } from '@/types';

/**
 * PATCH /api/crews/[id]/config
 * Update crew configuration (support_email and support_client_name)
 *
 * Authorization:
 * - SuperAdmin: Can update any crew's configuration
 * - Client Admin: Can only update crews from their organization
 *
 * Request body:
 * {
 *   supportEmail: string
 *   supportClientName: string
 * }
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Verify authentication
    const session = await requireAuth();
    const { id } = await params;
    const body = await request.json();
    const { supportEmail, supportClientName } = body;

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!supportEmail || !emailRegex.test(supportEmail)) {
      return NextResponse.json({
        success: false,
        error: 'Valid support email is required'
      }, { status: 400 });
    }

    // Validate client name
    if (!supportClientName || supportClientName.trim().length === 0) {
      return NextResponse.json({
        success: false,
        error: 'Support client name is required'
      }, { status: 400 });
    }

    // Fetch crew
    const [crew] = await db.select().from(crews).where(eq(crews.id, id)).limit(1);
    if (!crew) {
      return NextResponse.json({
        success: false,
        error: 'Crew not found'
      }, { status: 404 });
    }

    // Authorization: SuperAdmin or Client Admin from same org
    if (!await isSuperAdmin()) {
      const userId = session.user.id;
      const membership = await db
        .select()
        .from(member)
        .innerJoin(clients, eq(member.organizationId, clients.id))
        .where(and(
          eq(member.userId, userId),
          eq(clients.clientCode, crew.clientId)
        ))
        .limit(1);

      if (membership.length === 0) {
        return NextResponse.json({
          success: false,
          error: 'Forbidden - You can only update crews from your organization'
        }, { status: 403 });
      }
    }

    // Update config
    const currentConfig = crew.config as CrewConfig;
    const updatedConfig: CrewConfig = {
      ...currentConfig,
      metadata: {
        ...currentConfig.metadata,
        support_email: supportEmail,
        support_client_name: supportClientName.trim()
      }
    };

    const [updatedCrew] = await db
      .update(crews)
      .set({
        config: updatedConfig,
        updatedAt: new Date()
      })
      .where(eq(crews.id, id))
      .returning();

    return NextResponse.json({
      success: true,
      data: updatedCrew,
      message: 'Support configuration updated successfully'
    });
  } catch (error) {
    console.error('PATCH /api/crews/[id]/config error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to update crew configuration',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
