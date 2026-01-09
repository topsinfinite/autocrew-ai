import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { crews, clients, member, knowledgeBaseDocuments } from '@/db/schema';
import { eq, and, count } from 'drizzle-orm';
import { deprovisionCrew } from '@/lib/utils/crew';
import { requireAuth, isSuperAdmin } from '@/lib/auth/session-helpers';
import type { CrewStatus, CrewConfig } from '@/types';

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
    // Verify authentication
    const session = await requireAuth();
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

    // Authorization for status changes - CLIENT ADMIN ONLY
    if (allowedUpdates.status) {
      // SuperAdmins CANNOT change status
      if (await isSuperAdmin()) {
        return NextResponse.json({
          success: false,
          error: 'SuperAdmin cannot change crew status. Only client admins can activate/deactivate crews.'
        }, { status: 403 });
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
        return NextResponse.json({
          success: false,
          error: 'Forbidden - You can only update crews from your organization'
        }, { status: 403 });
      }

      // If activating a customer_support crew, check for support_email, support_client_name, and documents
      if (allowedUpdates.status === 'active' && existingCrew.type === 'customer_support') {
        const crewConfig = existingCrew.config as CrewConfig;
        const supportEmail = crewConfig.metadata?.support_email;
        const supportClientName = crewConfig.metadata?.support_client_name;

        if (!supportEmail || !supportClientName) {
          return NextResponse.json({
            success: false,
            error: 'Cannot activate customer support crew without support configuration. Please configure support email and client name first.'
          }, { status: 400 });
        }

        // Check if at least one document is uploaded
        const documentCountResult = await db
          .select({ count: count() })
          .from(knowledgeBaseDocuments)
          .where(and(
            eq(knowledgeBaseDocuments.crewId, existingCrew.id),
            eq(knowledgeBaseDocuments.status, 'indexed')
          ));

        console.log('[Crew Activation] Document count check:', {
          crewId: existingCrew.id,
          crewCode: existingCrew.crewCode,
          result: documentCountResult,
        });

        const docCount = documentCountResult[0]?.count || 0;
        const numDocs = typeof docCount === 'bigint' ? Number(docCount) : docCount;

        if (numDocs === 0) {
          console.log('[Crew Activation] BLOCKED: No indexed documents found');

          // Check if there are any processing documents
          const [processingCount] = await db
            .select({ count: count() })
            .from(knowledgeBaseDocuments)
            .where(and(
              eq(knowledgeBaseDocuments.crewId, existingCrew.id),
              eq(knowledgeBaseDocuments.status, 'processing')
            ));

          const numProcessing = processingCount?.count ? (typeof processingCount.count === 'bigint' ? Number(processingCount.count) : processingCount.count) : 0;

          const errorMessage = numProcessing > 0
            ? `Cannot activate crew: ${numProcessing} document${numProcessing !== 1 ? 's are' : ' is'} still processing. Please wait for processing to complete (usually 10-30 seconds) and try again.`
            : 'Cannot activate customer support crew without at least one indexed document. Please upload knowledge base documents first.';

          return NextResponse.json({
            success: false,
            error: errorMessage
          }, { status: 400 });
        }

        console.log('[Crew Activation] Document requirement satisfied:', numDocs, 'indexed documents');
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
          return NextResponse.json({
            success: false,
            error: 'Forbidden - You can only update crews from your organization'
          }, { status: 403 });
        }
      }
    }

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
