import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { clients, crews, conversations, member, user } from '@/db/schema';
import { insertClientSchema } from '@/db/schema';
import { eq, and, inArray } from 'drizzle-orm';
import { isSuperAdmin } from '@/lib/auth/session-helpers';
import { deprovisionCrew } from '@/lib/utils/crew';

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
  try {
    // SECURITY: Only SuperAdmin can delete clients
    if (!(await isSuperAdmin())) {
      return NextResponse.json(
        {
          success: false,
          error: 'Forbidden - SuperAdmin access required',
        },
        { status: 403 }
      );
    }

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

    const clientCode = existingClient.clientCode;
    const clientId = existingClient.id;

    console.log(`[DELETE Client] Starting deletion for ${existingClient.companyName} (${clientCode})`);

    // STEP 1: Get all crews for this client
    const clientCrews = await db
      .select()
      .from(crews)
      .where(eq(crews.clientId, clientCode));

    console.log(`[DELETE Client] Found ${clientCrews.length} crews to delete`);

    // STEP 2: Delete each crew (this also drops their database tables)
    for (const crew of clientCrews) {
      try {
        console.log(`[DELETE Client] Deleting crew: ${crew.name} (${crew.crewCode})`);
        await deprovisionCrew(crew.id);
      } catch (error) {
        console.error(`[DELETE Client] Failed to delete crew ${crew.id}:`, error);
        // Continue with other deletions even if one crew fails
      }
    }

    // STEP 3: Delete all conversations
    const deletedConversations = await db
      .delete(conversations)
      .where(eq(conversations.clientId, clientCode))
      .returning();

    console.log(`[DELETE Client] Deleted ${deletedConversations.length} conversations`);

    // STEP 4: Get all members of this organization
    const members = await db
      .select()
      .from(member)
      .where(eq(member.organizationId, clientId));

    const userIds = members.map((m) => m.userId);
    console.log(`[DELETE Client] Found ${userIds.length} members`);

    // STEP 5: Check which users are orphaned (only belong to this organization)
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

      console.log(`[DELETE Client] Found ${orphanedUserIds.length} orphaned users to delete`);

      // Delete orphaned users
      if (orphanedUserIds.length > 0) {
        await db.delete(user).where(inArray(user.id, orphanedUserIds));
      }
    }

    // STEP 6: Delete the client (this will cascade delete members and invitations)
    await db.delete(clients).where(eq(clients.id, id));

    console.log(`[DELETE Client] Successfully deleted ${existingClient.companyName}`);

    return NextResponse.json({
      success: true,
      message: `Client "${existingClient.companyName}" and all associated data deleted successfully`,
      data: {
        deletedCrews: clientCrews.length,
        deletedConversations: deletedConversations.length,
        deletedUsers: userIds.length,
      },
    });
  } catch (error) {
    console.error('DELETE /api/clients/:id error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to delete client',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
