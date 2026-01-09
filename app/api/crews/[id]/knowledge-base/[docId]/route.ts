import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { crews, clients, member } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { requireAuth, isSuperAdmin } from '@/lib/auth/session-helpers';
import { deleteDocument } from '@/lib/db/knowledge-base';
import type { CrewConfig } from '@/types';
import { logger, successResponse, errorResponse, ErrorCodes } from '@/lib/utils';

/**
 * DELETE /api/crews/[id]/knowledge-base/[docId]
 * Delete a document from the crew's knowledge base (metadata + vector table)
 *
 * New Architecture:
 * 1. Delete metadata record from knowledge_base_documents
 * 2. Delete all chunks from vector table
 *
 * Authorization:
 * - SuperAdmin: Can delete documents from any crew
 * - Client Admin: Can only delete documents from crews in their organization
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; docId: string }> }
) {
  const requestId = request.headers.get('x-request-id');
  const startTime = Date.now();

  try {
    // 1. Verify authentication
    const session = await requireAuth();
    const { id, docId } = await params;

    await logger.info('Delete document request received', {
      requestId,
      crewId: id,
      docId,
      userId: session.user.id,
    });

    // 2. Validate docId
    if (!docId || docId.trim() === '') {
      await logger.warn('Delete document failed - missing docId', {
        requestId,
        crewId: id,
      });
      return errorResponse(
        {
          code: 'VALIDATION_FAILED',
          status: 400,
          message: 'Document ID is required',
        },
        null,
        requestId
      );
    }

    // 3. Fetch crew
    const [crew] = await db.select().from(crews).where(eq(crews.id, id)).limit(1);
    if (!crew) {
      await logger.warn('Delete document failed - crew not found', {
        requestId,
        crewId: id,
        docId,
      });
      return errorResponse(ErrorCodes.CREW_NOT_FOUND, null, requestId);
    }

    // 4. Verify crew type is customer_support
    if (crew.type !== 'customer_support') {
      await logger.warn('Delete document failed - wrong crew type', {
        requestId,
        crewId: id,
        docId,
        crewType: crew.type,
      });
      return errorResponse(
        {
          code: 'INVALID_CREW_TYPE',
          status: 400,
          message: 'Knowledge base is only available for customer support crews',
        },
        null,
        requestId
      );
    }

    // 5. Authorization check
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
        await logger.warn('Delete document failed - insufficient permissions', {
          requestId,
          crewId: id,
          docId,
          userId,
          clientId: crew.clientId,
        });
        return errorResponse(
          {
            code: 'PERMISSION_DENIED',
            status: 403,
            message: 'You can only delete documents from crews in your organization',
          },
          null,
          requestId
        );
      }
    }

    // 6. Get vector table name
    const crewConfig = crew.config as CrewConfig;
    const vectorTableName = crewConfig.vectorTableName;

    if (!vectorTableName) {
      await logger.warn('Delete document failed - vector table not configured', {
        requestId,
        crewId: id,
        docId,
      });
      return errorResponse(
        {
          code: 'CONFIG_ERROR',
          status: 400,
          message: 'Vector table not configured for this crew',
        },
        null,
        requestId
      );
    }

    // 7. Delete document (metadata + chunks) using helper function
    const deletedChunks = await deleteDocument(docId, vectorTableName);

    if (deletedChunks === 0) {
      await logger.warn('Delete document failed - document not found', {
        requestId,
        crewId: id,
        docId,
        vectorTable: vectorTableName,
      });
      return errorResponse(
        {
          code: 'DOCUMENT_NOT_FOUND',
          status: 404,
          message: 'Document not found in knowledge base',
        },
        null,
        requestId
      );
    }

    const duration = Date.now() - startTime;
    await logger.info('Document deleted successfully', {
      requestId,
      crewId: id,
      crewCode: crew.crewCode,
      docId,
      deletedChunks,
      vectorTable: vectorTableName,
      duration,
      operation: 'delete_document',
    });

    // 8. Return success response
    return successResponse(
      { deletedChunks },
      `Document deleted successfully (${deletedChunks} chunks removed)`,
      requestId
    );

  } catch (error) {
    const duration = Date.now() - startTime;
    await logger.error(
      'Failed to delete document',
      {
        requestId,
        duration,
        operation: 'delete_document',
      },
      error
    );
    return errorResponse(ErrorCodes.INTERNAL_ERROR, error, requestId);
  }
}
