import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { clients, crews, conversations, member, user } from '@/db/schema';
import { insertClientSchema } from '@/db/schema';
import { eq, and, inArray } from 'drizzle-orm';
import { requireAuth, isSuperAdmin } from '@/lib/auth/session-helpers';
import { deprovisionCrew } from '@/lib/utils/crew';
import { logger, successResponse, errorResponse, ErrorCodes } from '@/lib/utils';

/**
 * GET /api/clients/:id
 * Get a single client by ID
 *
 * Authorization:
 * - SuperAdmin: Can view any client
 * - Client Admin: Forbidden (403)
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const requestId = request.headers.get('x-request-id');
  const startTime = Date.now();

  try {
    const { id } = await params;

    await logger.info('Fetch client request received', { requestId, clientId: id });

    // Require authentication
    await requireAuth();

    // Only SuperAdmin can view clients
    if (!await isSuperAdmin()) {
      await logger.warn('Fetch client failed - insufficient permissions', {
        requestId,
        clientId: id,
      });
      return errorResponse(ErrorCodes.PERMISSION_SUPER_ADMIN_REQUIRED, null, requestId);
    }

    const [client] = await db
      .select()
      .from(clients)
      .where(eq(clients.id, id))
      .limit(1);

    if (!client) {
      await logger.warn('Fetch client failed - not found', {
        requestId,
        clientId: id,
      });
      return errorResponse(ErrorCodes.CLIENT_NOT_FOUND, null, requestId);
    }

    const duration = Date.now() - startTime;
    await logger.info('Client fetched successfully', {
      requestId,
      clientId: id,
      clientCode: client.clientCode,
      companyName: client.companyName,
      duration,
      operation: 'fetch_client',
    });

    return successResponse(client, undefined, requestId);
  } catch (error) {
    const duration = Date.now() - startTime;
    await logger.error(
      'Failed to fetch client',
      {
        requestId,
        duration,
        operation: 'fetch_client',
      },
      error
    );
    return errorResponse(ErrorCodes.INTERNAL_ERROR, error, requestId);
  }
}

/**
 * PATCH /api/clients/:id
 * Update a client by ID
 *
 * Authorization:
 * - SuperAdmin: Can update any client
 * - Client Admin: Forbidden (403)
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const requestId = request.headers.get('x-request-id');
  const startTime = Date.now();

  try {
    const { id } = await params;
    const body = await request.json();

    await logger.info('Update client request received', { requestId, clientId: id });

    // Require authentication
    await requireAuth();

    // Only SuperAdmin can update clients
    if (!await isSuperAdmin()) {
      await logger.warn('Update client failed - insufficient permissions', {
        requestId,
        clientId: id,
      });
      return errorResponse(ErrorCodes.PERMISSION_SUPER_ADMIN_REQUIRED, null, requestId);
    }

    // Validate with partial schema (all fields optional)
    const validation = insertClientSchema.partial().safeParse(body);

    if (!validation.success) {
      await logger.warn('Update client validation failed', {
        requestId,
        clientId: id,
        errors: validation.error.issues,
      });
      return errorResponse(ErrorCodes.VALIDATION_FAILED, validation.error.issues, requestId);
    }

    const data = validation.data;

    // Check if client exists
    const [existingClient] = await db
      .select()
      .from(clients)
      .where(eq(clients.id, id))
      .limit(1);

    if (!existingClient) {
      await logger.warn('Update client failed - not found', {
        requestId,
        clientId: id,
      });
      return errorResponse(ErrorCodes.CLIENT_NOT_FOUND, null, requestId);
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

    const duration = Date.now() - startTime;
    await logger.info('Client updated successfully', {
      requestId,
      clientId: id,
      clientCode: updatedClient.clientCode,
      companyName: updatedClient.companyName,
      duration,
      operation: 'update_client',
    });

    return successResponse(
      updatedClient,
      'Client updated successfully',
      requestId
    );
  } catch (error) {
    const duration = Date.now() - startTime;
    await logger.error(
      'Failed to update client',
      {
        requestId,
        duration,
        operation: 'update_client',
      },
      error
    );
    return errorResponse(ErrorCodes.INTERNAL_ERROR, error, requestId);
  }
}

/**
 * DELETE /api/clients/:id
 * Delete a client and all their related data
 *
 * SECURITY: SuperAdmin only
 * USE CASE: GDPR/data deletion requests
 *
 * This endpoint performs a complete cleanup:
 * 1. Deletes all crews (and their database tables)
 * 2. Deletes all conversations
 * 3. Deletes all memberships (cascade)
 * 4. Deletes all invitations (cascade)
 * 5. Deletes orphaned users (users who only belonged to this client)
 * 6. Deletes the client organization
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const requestId = request.headers.get('x-request-id');
  const startTime = Date.now();

  try {
    const { id } = await params;

    await logger.info('Delete client request received', { requestId, clientId: id });

    // Require authentication
    await requireAuth();

    // SECURITY: Only SuperAdmin can delete clients
    if (!await isSuperAdmin()) {
      await logger.warn('Delete client failed - insufficient permissions', {
        requestId,
        clientId: id,
      });
      return errorResponse(ErrorCodes.PERMISSION_SUPER_ADMIN_REQUIRED, null, requestId);
    }

    // Check if client exists
    const [existingClient] = await db
      .select()
      .from(clients)
      .where(eq(clients.id, id))
      .limit(1);

    if (!existingClient) {
      await logger.warn('Delete client failed - not found', {
        requestId,
        clientId: id,
      });
      return errorResponse(ErrorCodes.CLIENT_NOT_FOUND, null, requestId);
    }

    const clientCode = existingClient.clientCode;
    const clientId = existingClient.id;

    await logger.info('Starting client deletion', {
      requestId,
      clientId: id,
      clientCode,
      companyName: existingClient.companyName,
      operation: 'delete_client',
    });

    // STEP 1: Get all crews for this client
    const clientCrews = await db
      .select()
      .from(crews)
      .where(eq(crews.clientId, clientCode));

    await logger.info('Client crews retrieved for deletion', {
      requestId,
      clientId: id,
      crewCount: clientCrews.length,
      operation: 'delete_client',
    });

    // STEP 2: Delete each crew (this also drops their database tables)
    let successfulCrewDeletions = 0;
    let failedCrewDeletions = 0;

    for (const crew of clientCrews) {
      try {
        await logger.info('Deleting crew', {
          requestId,
          clientId: id,
          crewId: crew.id,
          crewCode: crew.crewCode,
          crewName: crew.name,
          operation: 'delete_client',
        });
        await deprovisionCrew(crew.id);
        successfulCrewDeletions++;
      } catch (error) {
        failedCrewDeletions++;
        await logger.error(
          'Failed to delete crew during client deletion',
          {
            requestId,
            clientId: id,
            crewId: crew.id,
            crewCode: crew.crewCode,
            operation: 'delete_client',
          },
          error
        );
        // Continue with other deletions even if one crew fails
      }
    }

    // STEP 3: Delete all conversations
    const deletedConversations = await db
      .delete(conversations)
      .where(eq(conversations.clientId, clientCode))
      .returning();

    await logger.info('Client conversations deleted', {
      requestId,
      clientId: id,
      conversationCount: deletedConversations.length,
      operation: 'delete_client',
    });

    // STEP 4: Get all members of this organization
    const members = await db
      .select()
      .from(member)
      .where(eq(member.organizationId, clientId));

    const userIds = members.map((m) => m.userId);

    await logger.info('Client members retrieved', {
      requestId,
      clientId: id,
      memberCount: userIds.length,
      operation: 'delete_client',
    });

    // STEP 5: Check which users are orphaned (only belong to this organization)
    let orphanedUserCount = 0;

    if (userIds.length > 0) {
      // Get all memberships for these users
      const allMemberships = await db
        .select()
        .from(member)
        .where(inArray(member.userId, userIds));

      // Find users who only have membership to this organization
      const orphanedUserIds = userIds.filter((userId) => {
        const userMemberships = allMemberships.filter((m) => m.userId === userId);
        // If user only has 1 membership and it's to this organization, they're orphaned
        return userMemberships.length === 1 && userMemberships[0].organizationId === clientId;
      });

      orphanedUserCount = orphanedUserIds.length;

      await logger.info('Orphaned users identified for deletion', {
        requestId,
        clientId: id,
        orphanedUserCount,
        operation: 'delete_client',
      });

      // Delete orphaned users
      if (orphanedUserIds.length > 0) {
        await db.delete(user).where(inArray(user.id, orphanedUserIds));
      }
    }

    // STEP 6: Delete the client (this will cascade delete members and invitations)
    await db.delete(clients).where(eq(clients.id, id));

    const duration = Date.now() - startTime;
    await logger.info('Client deleted successfully', {
      requestId,
      clientId: id,
      clientCode,
      companyName: existingClient.companyName,
      deletedCrews: successfulCrewDeletions,
      failedCrewDeletions,
      deletedConversations: deletedConversations.length,
      deletedUsers: orphanedUserCount,
      duration,
      operation: 'delete_client',
    });

    return successResponse(
      {
        deletedCrews: successfulCrewDeletions,
        failedCrewDeletions,
        deletedConversations: deletedConversations.length,
        deletedUsers: orphanedUserCount,
      },
      `Client "${existingClient.companyName}" and all associated data deleted successfully`,
      requestId
    );
  } catch (error) {
    const duration = Date.now() - startTime;
    await logger.error(
      'Failed to delete client',
      {
        requestId,
        duration,
        operation: 'delete_client',
      },
      error
    );
    return errorResponse(ErrorCodes.INTERNAL_ERROR, error, requestId);
  }
}
