import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { crews, clients, member } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { requireAuth, isSuperAdmin } from '@/lib/auth/session-helpers';
import { deleteDocument } from '@/lib/db/knowledge-base';
import type { CrewConfig } from '@/types';

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
  try {
    // 1. Verify authentication
    const session = await requireAuth();
    const { id, docId } = await params;

    // 2. Validate docId
    if (!docId || docId.trim() === '') {
      return NextResponse.json({
        success: false,
        error: 'Document ID is required',
      }, { status: 400 });
    }

    // 3. Fetch crew
    const [crew] = await db.select().from(crews).where(eq(crews.id, id)).limit(1);
    if (!crew) {
      return NextResponse.json({
        success: false,
        error: 'Crew not found',
      }, { status: 404 });
    }

    // 4. Verify crew type is customer_support
    if (crew.type !== 'customer_support') {
      return NextResponse.json({
        success: false,
        error: 'Knowledge base is only available for customer support crews',
      }, { status: 400 });
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
        return NextResponse.json({
          success: false,
          error: 'Forbidden - You can only delete documents from crews in your organization',
        }, { status: 403 });
      }
    }

    // 6. Get vector table name
    const crewConfig = crew.config as CrewConfig;
    const vectorTableName = crewConfig.vectorTableName;

    if (!vectorTableName) {
      return NextResponse.json({
        success: false,
        error: 'Vector table not configured for this crew',
      }, { status: 400 });
    }

    // 7. Delete document (metadata + chunks) using helper function
    const deletedChunks = await deleteDocument(docId, vectorTableName);

    if (deletedChunks === 0) {
      return NextResponse.json({
        success: false,
        error: 'Document not found in knowledge base',
      }, { status: 404 });
    }

    console.log('[Knowledge Base Delete] Deleted document:', {
      docId,
      deletedChunks,
      vectorTable: vectorTableName,
    });

    // 8. Return success response
    return NextResponse.json({
      success: true,
      data: {
        deletedChunks,
      },
      message: `Document deleted successfully (${deletedChunks} chunks removed)`,
    });

  } catch (error) {
    console.error('DELETE /api/crews/[id]/knowledge-base/[docId] error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to delete document',
      details: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 });
  }
}
