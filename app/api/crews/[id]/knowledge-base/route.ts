import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { crews, clients, member, knowledgeBaseDocuments } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { requireAuth, isSuperAdmin } from '@/lib/auth/session-helpers';
import { validateFile } from '@/lib/utils';
import { getDocuments } from '@/lib/db/knowledge-base';
import {
  createDocumentMetadata,
  updateDocumentAndCrew,
  markDocumentAsError,
  rollbackDocument,
} from '@/lib/services/knowledge-base-service';
import type { CrewConfig, N8nUploadResponse } from '@/types';
import crypto from 'crypto';

/**
 * POST /api/crews/[id]/knowledge-base
 * Upload a document to the crew's knowledge base via n8n webhook
 *
 * New Architecture:
 * 1. Generate docId before sending to n8n
 * 2. Create metadata record in knowledge_base_documents (status='processing')
 * 3. Send file + docId to n8n
 * 4. Update metadata record on success (status='indexed', chunkCount)
 * 5. Rollback metadata record on error
 *
 * Authorization:
 * - SuperAdmin: Can upload to any crew
 * - Client Admin: Can only upload to crews from their organization
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  let docId: string | null = null;
  let crew: any = null;
  let session: any = null;
  let file: File | null = null;

  try {
    // 1. Verify authentication
    session = await requireAuth();
    const { id } = await params;

    // 2. Parse multipart form data
    const formData = await request.formData();
    file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({
        success: false,
        error: 'No file provided',
      }, { status: 400 });
    }

    // 3. Validate file
    const validation = validateFile(file);
    if (!validation.valid) {
      return NextResponse.json({
        success: false,
        error: validation.error,
      }, { status: 400 });
    }

    // 4. Fetch crew
    const [crew] = await db.select().from(crews).where(eq(crews.id, id)).limit(1);
    if (!crew) {
      return NextResponse.json({
        success: false,
        error: 'Crew not found',
      }, { status: 404 });
    }

    // 5. Verify crew type is customer_support
    if (crew.type !== 'customer_support') {
      return NextResponse.json({
        success: false,
        error: 'Knowledge base is only available for customer support crews',
      }, { status: 400 });
    }

    // 6. Authorization check
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
          error: 'Forbidden - You can only upload documents to crews from your organization',
        }, { status: 403 });
      }
    }

    // 7. Generate docId and create metadata record (optimistic)
    docId = crypto.randomUUID();

    await createDocumentMetadata({
      docId,
      clientId: crew.clientId,
      crewId: crew.id,
      filename: file.name,
      fileType: file.type,
      fileSize: file.size,
    });

    // 8. Construct FormData for n8n (with docId)
    const n8nFormData = new FormData();
    n8nFormData.append('crewCode', crew.crewCode);
    n8nFormData.append('docId', docId);  // NEW: Send docId to n8n
    n8nFormData.append('binary', file, file.name);

    // 9. POST to n8n webhook
    const n8nApiKey = process.env.N8N_API_KEY;
    const n8nDocumentUploadWebhook = process.env.N8N_DOCUMENT_UPLOAD_WEBHOOK;

    if (!n8nApiKey) {
      console.error('N8N_API_KEY environment variable is not set');
      throw new Error('N8N API key not configured');
    }

    if (!n8nDocumentUploadWebhook) {
      console.error('N8N_DOCUMENT_UPLOAD_WEBHOOK environment variable is not set');
      throw new Error('N8N document upload webhook not configured');
    }

    console.log('[Knowledge Base Upload] Sending to n8n:', {
      webhookUrl: n8nDocumentUploadWebhook,
      crewCode: crew.crewCode,
      docId,
      filename: file.name,
      fileSize: file.size,
      fileType: file.type,
    });

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 60000); // 60s timeout

    try {
      const n8nResponse = await fetch(n8nDocumentUploadWebhook, {
        method: 'POST',
        headers: {
          'x-api-key': n8nApiKey,
        },
        body: n8nFormData,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      console.log('[Knowledge Base Upload] N8N response status:', n8nResponse.status);

      const n8nData: N8nUploadResponse = await n8nResponse.json();
      console.log('[Knowledge Base Upload] N8N response data:', n8nData);

      // 10. Handle n8n response
      if (n8nData.status === 'error' || !n8nResponse.ok) {
        // Mark document as error in database
        await markDocumentAsError(
          docId,
          n8nData.message || 'Failed to process document',
          {
            userId: session.user.id,
            filename: file.name,
          }
        );

        return NextResponse.json({
          success: false,
          error: n8nData.message || 'Failed to process document',
          statusCode: n8nData.statusCode || n8nResponse.status,
        }, { status: n8nData.statusCode || n8nResponse.status });
      }

      // 11. Update metadata and crew config atomically in transaction
      const chunkCount = n8nData.document?.chunk_count || 0;
      const currentConfig = crew.config as CrewConfig;

      await updateDocumentAndCrew(
        docId,
        crew.id,
        chunkCount,
        currentConfig,
        {
          userId: session.user.id,
          filename: file.name,
        }
      );

      console.log('[Knowledge Base Upload] Document and crew updated successfully:', {
        docId,
        chunkCount,
        crewId: crew.id,
      });

      // 13. Return success response
      return NextResponse.json({
        success: true,
        data: {
          docId,
          filename: file.name,
          chunkCount,
          vectorTable: n8nData.metadata?.vector_table,
          status: n8nData.document?.status,
          embeddingsModel: n8nData.document?.embeddings_model,
        },
        message: 'Document uploaded and processed successfully',
      });

    } catch (error) {
      clearTimeout(timeoutId);

      if (error instanceof Error && error.name === 'AbortError') {
        // Mark document as error due to timeout
        if (docId) {
          await markDocumentAsError(
            docId,
            'Document processing timeout - file may be too large or complex',
            {
              userId: session.user.id,
              filename: file.name,
            }
          );
        }

        return NextResponse.json({
          success: false,
          error: 'Document processing timeout - file may be too large or complex',
        }, { status: 408 });
      }

      throw error;
    }

  } catch (error) {
    console.error('POST /api/crews/[id]/knowledge-base error:', error);

    // Complete rollback: Delete metadata AND vector chunks if they exist
    if (docId && crew) {
      try {
        const crewConfig = crew.config as CrewConfig;
        await rollbackDocument(
          docId,
          crewConfig.vectorTableName,
          {
            userId: session?.user?.id || 'unknown',
            filename: file?.name || 'unknown',
            crewId: crew.id,
          }
        );
      } catch (rollbackError) {
        // Rollback failed - already logged in rollbackDocument
        // Continue to return error response
      }
    }

    return NextResponse.json({
      success: false,
      error: 'Failed to upload document',
      details: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 });
  }
}

/**
 * GET /api/crews/[id]/knowledge-base
 * List all documents in the crew's knowledge base (from metadata table)
 *
 * New Architecture:
 * - Queries knowledge_base_documents table (fast, indexed)
 * - No longer queries vector table directly
 * - 10-100x faster than previous GROUP BY approach
 *
 * Authorization:
 * - SuperAdmin: Can list documents from any crew
 * - Client Admin: Can only list documents from crews in their organization
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // 1. Verify authentication
    const session = await requireAuth();
    const { id } = await params;

    // 2. Fetch crew
    const [crew] = await db.select().from(crews).where(eq(crews.id, id)).limit(1);
    if (!crew) {
      return NextResponse.json({
        success: false,
        error: 'Crew not found',
      }, { status: 404 });
    }

    // 3. Verify crew type is customer_support
    if (crew.type !== 'customer_support') {
      return NextResponse.json({
        success: false,
        error: 'Knowledge base is only available for customer support crews',
      }, { status: 400 });
    }

    // 4. Authorization check
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
          error: 'Forbidden - You can only access crews from your organization',
        }, { status: 403 });
      }
    }

    // 5. Query metadata table (FAST - indexed query)
    const documents = await getDocuments({ crewId: id });

    console.log('[Knowledge Base List] Returned documents:', documents.length);

    return NextResponse.json({
      success: true,
      data: documents,
      count: documents.length,
    });

  } catch (error) {
    console.error('GET /api/crews/[id]/knowledge-base error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to retrieve knowledge base documents',
      details: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 });
  }
}
