import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { crews, clients, member, knowledgeBaseDocuments } from '@/db/schema';
import { eq, and, count } from 'drizzle-orm';
import { deprovisionCrew } from '@/lib/utils/crew';
import { requireAuth, isSuperAdmin } from '@/lib/auth/session-helpers';
import type { CrewStatus, CrewConfig } from '@/types';
import { logger, successResponse, errorResponse, ErrorCodes } from '@/lib/utils';

/**
 * GET /api/crews/:id
 * Get a single crew by ID
 *
 * Authorization:
 * - SuperAdmin: Can view any crew
 * - Client Admin: Can view crews from their organization
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const requestId = request.headers.get('x-request-id');
  const startTime = Date.now();

  try {
    const { id } = await params;

    await logger.info('Fetch crew request received', { requestId, crewId: id });

    // Require authentication
    await requireAuth();

    const [crew] = await db.select().from(crews).where(eq(crews.id, id)).limit(1);

    if (!crew) {
      await logger.warn('Fetch crew failed - not found', {
        requestId,
        crewId: id,
      });
      return errorResponse(ErrorCodes.CREW_NOT_FOUND, null, requestId);
    }

    const duration = Date.now() - startTime;
    await logger.info('Crew fetched successfully', {
      requestId,
      crewId: id,
      crewCode: crew.crewCode,
      crewName: crew.name,
      crewType: crew.type,
      clientId: crew.clientId,
      duration,
      operation: 'fetch_crew',
    });

    return successResponse(crew, undefined, requestId);
  } catch (error) {
    const duration = Date.now() - startTime;
    await logger.error(
      'Failed to fetch crew',
      {
        requestId,
        duration,
        operation: 'fetch_crew',
      },
      error
    );
    return errorResponse(ErrorCodes.INTERNAL_ERROR, error, requestId);
  }
}

/**
 * PATCH /api/crews/:id
 * Update a crew (name, status, webhookUrl only)
 * Note: type, clientId, crewCode are immutable
 *
 * Authorization:
 * - SuperAdmin: Can update name, webhookUrl (CANNOT change status)
 * - Client Admin: Can update all fields including status
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

    await logger.info('Update crew request received', {
      requestId,
      crewId: id,
      userId: session.user.id,
      updates: Object.keys(body),
    });

    // Check if crew exists
    const [existingCrew] = await db.select().from(crews).where(eq(crews.id, id)).limit(1);

    if (!existingCrew) {
      await logger.warn('Update crew failed - not found', {
        requestId,
        crewId: id,
      });
      return errorResponse(ErrorCodes.CREW_NOT_FOUND, null, requestId);
    }

    // Prevent updating immutable fields
    const { type, clientId, crewCode, config, ...allowedUpdates } = body;

    // Authorization for status changes - CLIENT ADMIN ONLY
    if (allowedUpdates.status) {
      // SuperAdmins CANNOT change status
      if (await isSuperAdmin()) {
        await logger.warn('Update crew failed - SuperAdmin cannot change status', {
          requestId,
          crewId: id,
          userId: session.user.id,
          attemptedStatus: allowedUpdates.status,
        });
        return errorResponse(
          {
            code: 'PERMISSION_DENIED',
            status: 403,
            message: 'SuperAdmin cannot change crew status. Only client admins can activate/deactivate crews.',
          },
          null,
          requestId
        );
      }

      // Verify client admin belongs to this crew's organization
      const userId = session.user.id;
      const membership = await db
        .select()
        .from(member)
        .innerJoin(clients, eq(member.organizationId, clients.id))
        .where(and(
          eq(member.userId, userId),
          eq(clients.clientCode, existingCrew.clientId)
        ))
        .limit(1);

      if (membership.length === 0) {
        await logger.warn('Update crew failed - user not in organization', {
          requestId,
          crewId: id,
          userId,
          clientId: existingCrew.clientId,
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

      // If activating a customer_support crew, check for support_email, support_client_name, and documents
      if (allowedUpdates.status === 'active' && existingCrew.type === 'customer_support') {
        const crewConfig = existingCrew.config as CrewConfig;
        const supportEmail = crewConfig.metadata?.support_email;
        const supportClientName = crewConfig.metadata?.support_client_name;

        if (!supportEmail || !supportClientName) {
          await logger.warn('Crew activation blocked - missing support configuration', {
            requestId,
            crewId: id,
            crewCode: existingCrew.crewCode,
            hasSupportEmail: !!supportEmail,
            hasSupportClientName: !!supportClientName,
          });
          return errorResponse(
            {
              code: 'CREW_CONFIG_INCOMPLETE',
              status: 400,
              message: 'Cannot activate customer support crew without support configuration. Please configure support email and client name first.',
            },
            null,
            requestId
          );
        }

        // Check if at least one document is uploaded
        const documentCountResult = await db
          .select({ count: count() })
          .from(knowledgeBaseDocuments)
          .where(and(
            eq(knowledgeBaseDocuments.crewId, existingCrew.id),
            eq(knowledgeBaseDocuments.status, 'indexed')
          ));

        const docCount = documentCountResult[0]?.count || 0;
        const numDocs = typeof docCount === 'bigint' ? Number(docCount) : docCount;

        await logger.info('Crew activation - document count check', {
          requestId,
          crewId: id,
          crewCode: existingCrew.crewCode,
          indexedDocuments: numDocs,
          operation: 'activate_crew',
        });

        if (numDocs === 0) {
          // Check if there are any processing documents
          const [processingCount] = await db
            .select({ count: count() })
            .from(knowledgeBaseDocuments)
            .where(and(
              eq(knowledgeBaseDocuments.crewId, existingCrew.id),
              eq(knowledgeBaseDocuments.status, 'processing')
            ));

          const numProcessing = processingCount?.count ? (typeof processingCount.count === 'bigint' ? Number(processingCount.count) : processingCount.count) : 0;

          await logger.warn('Crew activation blocked - no indexed documents', {
            requestId,
            crewId: id,
            crewCode: existingCrew.crewCode,
            processingDocuments: numProcessing,
            operation: 'activate_crew',
          });

          const errorMessage = numProcessing > 0
            ? `Cannot activate crew: ${numProcessing} document${numProcessing !== 1 ? 's are' : ' is'} still processing. Please wait for processing to complete (usually 10-30 seconds) and try again.`
            : 'Cannot activate customer support crew without at least one indexed document. Please upload knowledge base documents first.';

          return errorResponse(
            {
              code: 'CREW_ACTIVATION_BLOCKED',
              status: 400,
              message: errorMessage,
            },
            null,
            requestId
          );
        }

        await logger.info('Crew activation - document requirement satisfied', {
          requestId,
          crewId: id,
          crewCode: existingCrew.crewCode,
          indexedDocuments: numDocs,
          operation: 'activate_crew',
        });
      }
    }

    // For other updates (name, webhookUrl), verify organization access
    if (Object.keys(allowedUpdates).length > 0 && !allowedUpdates.status) {
      if (!await isSuperAdmin()) {
        const userId = session.user.id;
        const membership = await db
          .select()
          .from(member)
          .innerJoin(clients, eq(member.organizationId, clients.id))
          .where(and(
            eq(member.userId, userId),
            eq(clients.clientCode, existingCrew.clientId)
          ))
          .limit(1);

        if (membership.length === 0) {
          await logger.warn('Update crew failed - user not in organization', {
            requestId,
            crewId: id,
            userId,
            clientId: existingCrew.clientId,
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
    }

    if (type || clientId || crewCode || config) {
      await logger.warn('Update crew failed - immutable fields', {
        requestId,
        crewId: id,
        attemptedFields: { type, clientId, crewCode, config: !!config },
      });
      return errorResponse(
        {
          code: 'IMMUTABLE_FIELD',
          status: 400,
          message: 'Cannot update immutable fields: type, clientId, crewCode, config',
        },
        null,
        requestId
      );
    }

    // Validate status if provided
    if (allowedUpdates.status) {
      const validStatuses: CrewStatus[] = ['active', 'inactive', 'error'];
      if (!validStatuses.includes(allowedUpdates.status)) {
        await logger.warn('Update crew failed - invalid status', {
          requestId,
          crewId: id,
          attemptedStatus: allowedUpdates.status,
          validStatuses,
        });
        return errorResponse(
          {
            code: 'VALIDATION_FAILED',
            status: 400,
            message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`,
          },
          null,
          requestId
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

    const duration = Date.now() - startTime;
    await logger.info('Crew updated successfully', {
      requestId,
      crewId: id,
      crewCode: updatedCrew.crewCode,
      crewName: updatedCrew.name,
      updates: Object.keys(allowedUpdates),
      duration,
      operation: 'update_crew',
    });

    return successResponse(
      updatedCrew,
      'Crew updated successfully',
      requestId
    );
  } catch (error) {
    const duration = Date.now() - startTime;
    await logger.error(
      'Failed to update crew',
      {
        requestId,
        duration,
        operation: 'update_crew',
      },
      error
    );
    return errorResponse(ErrorCodes.INTERNAL_ERROR, error, requestId);
  }
}

/**
 * DELETE /api/crews/:id
 * Delete a crew and cleanup associated tables
 *
 * Authorization:
 * - SuperAdmin: Can delete any crew
 * - Client Admin: Can delete crews from their organization
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const requestId = request.headers.get('x-request-id');
  const startTime = Date.now();

  try {
    const { id } = await params;

    await logger.info('Delete crew request received', { requestId, crewId: id });

    // Require authentication
    await requireAuth();

    // Check if crew exists
    const [existingCrew] = await db.select().from(crews).where(eq(crews.id, id)).limit(1);

    if (!existingCrew) {
      await logger.warn('Delete crew failed - not found', {
        requestId,
        crewId: id,
      });
      return errorResponse(ErrorCodes.CREW_NOT_FOUND, null, requestId);
    }

    await logger.info('Starting crew deprovisioning', {
      requestId,
      crewId: id,
      crewCode: existingCrew.crewCode,
      crewName: existingCrew.name,
      crewType: existingCrew.type,
      clientId: existingCrew.clientId,
      operation: 'delete_crew',
    });

    // Deprovision crew (deletes record and cleans up tables)
    await deprovisionCrew(id);

    const duration = Date.now() - startTime;
    await logger.info('Crew deleted successfully', {
      requestId,
      crewId: id,
      crewCode: existingCrew.crewCode,
      crewName: existingCrew.name,
      duration,
      operation: 'delete_crew',
    });

    return successResponse(
      null,
      `Crew deleted successfully: ${existingCrew.crewCode}`,
      requestId
    );
  } catch (error) {
    const duration = Date.now() - startTime;
    await logger.error(
      'Failed to delete crew',
      {
        requestId,
        duration,
        operation: 'delete_crew',
      },
      error
    );
    return errorResponse(ErrorCodes.INTERNAL_ERROR, error, requestId);
  }
}
