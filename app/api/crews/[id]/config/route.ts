import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { crews, clients, member } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { requireAuth, isSuperAdmin } from '@/lib/auth/session-helpers';
import type { CrewConfig } from '@/types';
import { logger, successResponse, errorResponse, ErrorCodes, sanitizePII } from '@/lib/utils';

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
  const requestId = request.headers.get('x-request-id');
  const startTime = Date.now();

  try {
    // Verify authentication
    const session = await requireAuth();
    const { id } = await params;
    const body = await request.json();
    const { supportEmail, supportClientName } = body;

    await logger.info('Update crew config request received', {
      requestId,
      crewId: id,
      userId: session.user.id,
      supportEmail: sanitizePII({ email: supportEmail }).email,
    });

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!supportEmail || !emailRegex.test(supportEmail)) {
      await logger.warn('Update crew config failed - invalid email', {
        requestId,
        crewId: id,
        supportEmail: sanitizePII({ email: supportEmail }).email,
      });
      return errorResponse(
        {
          code: 'VALIDATION_FAILED',
          status: 400,
          message: 'Valid support email is required',
        },
        null,
        requestId
      );
    }

    // Validate client name
    if (!supportClientName || supportClientName.trim().length === 0) {
      await logger.warn('Update crew config failed - missing client name', {
        requestId,
        crewId: id,
      });
      return errorResponse(
        {
          code: 'VALIDATION_FAILED',
          status: 400,
          message: 'Support client name is required',
        },
        null,
        requestId
      );
    }

    // Fetch crew
    const [crew] = await db.select().from(crews).where(eq(crews.id, id)).limit(1);
    if (!crew) {
      await logger.warn('Update crew config failed - crew not found', {
        requestId,
        crewId: id,
      });
      return errorResponse(ErrorCodes.CREW_NOT_FOUND, null, requestId);
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
        await logger.warn('Update crew config failed - insufficient permissions', {
          requestId,
          crewId: id,
          userId,
          clientId: crew.clientId,
        });
        return errorResponse(
          {
            code: 'PERMISSION_DENIED',
            status: 403,
            message: 'You can only update crews from your organization',
          },
          null,
          requestId
        );
      }
    }

    // Update config with metadata and activation state
    const currentConfig = crew.config as CrewConfig;
    const documentsUploaded = currentConfig.activationState?.documentsUploaded ?? false;
    const supportConfigured = true; // Support is now configured
    const activationReady = documentsUploaded && supportConfigured;

    const updatedConfig: CrewConfig = {
      ...currentConfig,
      metadata: {
        ...currentConfig.metadata,
        support_email: supportEmail,
        support_client_name: supportClientName.trim()
      },
      activationState: {
        documentsUploaded,
        supportConfigured,
        activationReady
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

    const duration = Date.now() - startTime;
    await logger.info('Crew config updated successfully', {
      requestId,
      crewId: id,
      crewCode: crew.crewCode,
      supportEmail: sanitizePII({ email: supportEmail }).email,
      supportClientName,
      duration,
      operation: 'update_crew_config',
    });

    return successResponse(
      updatedCrew,
      'Support configuration updated successfully',
      requestId
    );
  } catch (error) {
    const duration = Date.now() - startTime;
    await logger.error(
      'Failed to update crew configuration',
      {
        requestId,
        duration,
        operation: 'update_crew_config',
      },
      error
    );
    return errorResponse(ErrorCodes.INTERNAL_ERROR, error, requestId);
  }
}
