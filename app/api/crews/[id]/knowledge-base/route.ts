import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { crews, clients, member, knowledgeBaseDocuments } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { requireAuth, isSuperAdmin } from '@/lib/auth/session-helpers';
import { validateFile, logger, successResponse, errorResponse, ErrorCodes } from '@/lib/utils';
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
  const requestId = request.headers.get('x-request-id');
  const startTime = Date.now();
  const { id } = await params;
  let docId: string | null = null;
  let crew: any = null;
  let session: any = null;
  let file: File | null = null;

  try {
    // 1. Verify authentication
    session = await requireAuth();

    await logger.info('Upload document request received', {
      requestId,
      crewId: id,
      userId: session.user.id,
    });

    // 2. Parse multipart form data
    const formData = await request.formData();
    file = formData.get('file') as File | null;

    if (!file) {
      await logger.warn('Upload document failed - no file provided', {
        requestId,
        crewId: id,
      });
      return errorResponse(
        {
          code: 'VALIDATION_FAILED',
          status: 400,
          message: 'No file provided',
        },
        null,
        requestId
      );
    }

    // 3. Validate file
    const validation = validateFile(file);
    if (!validation.valid) {
      await logger.warn('Upload document failed - invalid file', {
        requestId,
        crewId: id,
        filename: file.name,
        fileSize: file.size,
        fileType: file.type,
        validationError: validation.error,
      });
      return errorResponse(
        {
          code: 'VALIDATION_FAILED',
          status: 400,
          message: validation.error || 'Invalid file',
        },
        null,
        requestId
      );
    }

    // 4. Fetch crew
    const [crew] = await db.select().from(crews).where(eq(crews.id, id)).limit(1);
    if (!crew) {
      await logger.warn('Upload document failed - crew not found', {
        requestId,
        crewId: id,
      });
      return errorResponse(ErrorCodes.CREW_NOT_FOUND, null, requestId);
    }

    // 5. Verify crew type is customer_support
    if (crew.type !== 'customer_support') {
      await logger.warn('Upload document failed - wrong crew type', {
        requestId,
        crewId: id,
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
        await logger.warn('Upload document failed - insufficient permissions', {
          requestId,
          crewId: id,
          userId,
          clientId: crew.clientId,
        });
        return errorResponse(
          {
            code: 'PERMISSION_DENIED',
            status: 403,
            message: 'You can only upload documents to crews from your organization',
          },
          null,
          requestId
        );
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
      await logger.error('N8N_API_KEY environment variable is not set', {
        requestId,
        crewId: id,
        docId,
      });
      throw new Error('N8N API key not configured');
    }

    if (!n8nDocumentUploadWebhook) {
      await logger.error('N8N_DOCUMENT_UPLOAD_WEBHOOK environment variable is not set', {
        requestId,
        crewId: id,
        docId,
      });
      throw new Error('N8N document upload webhook not configured');
    }

    await logger.info('Sending document to n8n for processing', {
      requestId,
      crewId: id,
      crewCode: crew.crewCode,
      docId,
      filename: file.name,
      fileSize: file.size,
      fileType: file.type,
      operation: 'upload_document',
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

      await logger.info('Received response from n8n', {
        requestId,
        crewId: id,
        docId,
        status: n8nResponse.status,
        operation: 'upload_document',
      });

      const n8nData: N8nUploadResponse = await n8nResponse.json();

      await logger.info('N8N response data received', {
        requestId,
        crewId: id,
        docId,
        n8nStatus: n8nData.status,
        chunkCount: n8nData.document?.chunk_count,
        operation: 'upload_document',
      });

      // 10. Handle n8n response
      if (n8nData.status === 'error' || !n8nResponse.ok) {
        await logger.warn('N8N document processing failed', {
          requestId,
          crewId: id,
          docId,
          filename: file.name,
          n8nError: n8nData.message,
          statusCode: n8nData.statusCode || n8nResponse.status,
          operation: 'upload_document',
        });

        // Mark document as error in database
        await markDocumentAsError(
          docId,
          n8nData.message || 'Failed to process document',
          {
            userId: session.user.id,
            filename: file.name,
          }
        );

        return errorResponse(
          {
            code: 'EXTERNAL_SERVICE_ERROR',
            status: n8nData.statusCode || n8nResponse.status,
            message: n8nData.message || 'Failed to process document',
          },
          null,
          requestId
        );
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

      const duration = Date.now() - startTime;
      await logger.info('Document uploaded and processed successfully', {
        requestId,
        crewId: id,
        docId,
        filename: file.name,
        chunkCount,
        vectorTable: n8nData.metadata?.vector_table,
        duration,
        operation: 'upload_document',
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
        requestId,
      });

    } catch (error) {
      clearTimeout(timeoutId);

      if (error instanceof Error && error.name === 'AbortError') {
        await logger.warn('Document processing timeout', {
          requestId,
          crewId: id,
          docId,
          filename: file?.name,
          operation: 'upload_document',
        });

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

        return errorResponse(
          {
            code: 'TIMEOUT',
            status: 408,
            message: 'Document processing timeout - file may be too large or complex',
          },
          null,
          requestId
        );
      }

      throw error;
    }

  } catch (error) {
    const duration = Date.now() - startTime;
    await logger.error(
      'Failed to upload document',
      {
        requestId,
        crewId: id,
        docId,
        filename: file?.name,
        duration,
        operation: 'upload_document',
      },
      error
    );

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

    return errorResponse(ErrorCodes.INTERNAL_ERROR, error, requestId);
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
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const requestId = request.headers.get('x-request-id');
  const startTime = Date.now();

  try {
    // 1. Verify authentication
    const session = await requireAuth();
    const { id } = await params;

    await logger.info('List knowledge base documents request received', {
      requestId,
      crewId: id,
      userId: session.user.id,
    });

    // 2. Fetch crew
    const [crew] = await db.select().from(crews).where(eq(crews.id, id)).limit(1);
    if (!crew) {
      await logger.warn('List documents failed - crew not found', {
        requestId,
        crewId: id,
      });
      return errorResponse(ErrorCodes.CREW_NOT_FOUND, null, requestId);
    }

    // 3. Verify crew type is customer_support
    if (crew.type !== 'customer_support') {
      await logger.warn('List documents failed - wrong crew type', {
        requestId,
        crewId: id,
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
        await logger.warn('List documents failed - insufficient permissions', {
          requestId,
          crewId: id,
          userId,
          clientId: crew.clientId,
        });
        return errorResponse(
          {
            code: 'PERMISSION_DENIED',
            status: 403,
            message: 'You can only access crews from your organization',
          },
          null,
          requestId
        );
      }
    }

    // 5. Query metadata table (FAST - indexed query)
    const documents = await getDocuments({ crewId: id });

    const duration = Date.now() - startTime;
    await logger.info('Knowledge base documents retrieved successfully', {
      requestId,
      crewId: id,
      crewCode: crew.crewCode,
      documentCount: documents.length,
      duration,
      operation: 'list_documents',
    });

    return NextResponse.json({
      success: true,
      data: documents,
      count: documents.length,
      requestId,
    });

  } catch (error) {
    const duration = Date.now() - startTime;
    await logger.error(
      'Failed to retrieve knowledge base documents',
      {
        requestId,
        duration,
        operation: 'list_documents',
      },
      error
    );
    return errorResponse(ErrorCodes.INTERNAL_ERROR, error, requestId);
  }
}
