import { db } from '@/db';
import { knowledgeBaseDocuments, crews } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { withTransaction } from '@/lib/db/transaction-helpers';
import { deleteDocument } from '@/lib/db/knowledge-base';
import type { CrewConfig } from '@/types';

export interface UpdateDocumentStatusParams {
  docId: string;
  status: 'indexed' | 'processing' | 'error';
  chunkCount?: number;
  error?: string;
}

export interface UpdateCrewActivationParams {
  crewId: string;
  currentConfig: CrewConfig;
}

/**
 * Atomically update document status and crew config
 * This is the critical operation that needs transaction safety
 */
export async function updateDocumentAndCrew(
  docId: string,
  crewId: string,
  chunkCount: number,
  currentConfig: CrewConfig,
  context: { userId: string; filename: string }
) {
  const result = await withTransaction(
    async (tx) => {
      // 1. Update metadata record with indexed status
      await tx
        .update(knowledgeBaseDocuments)
        .set({
          status: 'indexed',
          chunkCount,
          updatedAt: new Date(),
        })
        .where(eq(knowledgeBaseDocuments.docId, docId));

      // 2. Update crew config if first upload
      if (!currentConfig.activationState?.documentsUploaded) {
        const updatedConfig: CrewConfig = {
          ...currentConfig,
          activationState: {
            documentsUploaded: true,
            supportConfigured: !!currentConfig.metadata?.support_email,
            activationReady: false,
          },
        };

        await tx
          .update(crews)
          .set({
            config: updatedConfig,
            updatedAt: new Date(),
          })
          .where(eq(crews.id, crewId));

        return { updatedCrewConfig: true };
      }

      return { updatedCrewConfig: false };
    },
    {
      operation: 'Update Document and Crew',
      context: {
        docId,
        crewId,
        chunkCount,
        userId: context.userId,
        filename: context.filename,
      },
    }
  );

  if (!result.success) {
    throw new Error(
      `Failed to update document and crew: ${result.error?.message}`
    );
  }

  return result.data;
}

/**
 * Update document status to error
 */
export async function markDocumentAsError(
  docId: string,
  errorMessage: string,
  context: { userId: string; filename: string }
) {
  try {
    await db
      .update(knowledgeBaseDocuments)
      .set({
        status: 'error',
        updatedAt: new Date(),
      })
      .where(eq(knowledgeBaseDocuments.docId, docId));

    console.warn('[KB Service] Document marked as error', {
      docId,
      errorMessage,
      userId: context.userId,
      filename: context.filename,
    });
  } catch (error) {
    console.error(
      '[KB Service] Failed to mark document as error',
      {
        docId,
        errorMessage,
        userId: context.userId,
        filename: context.filename,
      },
      error
    );
    throw error;
  }
}

/**
 * Complete rollback: delete metadata and vector chunks
 */
export async function rollbackDocument(
  docId: string,
  vectorTableName: string | undefined,
  context: { userId: string; filename: string; crewId: string }
) {
  try {
    if (vectorTableName) {
      // Use the deleteDocument helper which deletes both
      await deleteDocument(docId, vectorTableName);
      console.log('[KB Service] Complete rollback successful', {
        docId,
        vectorTableName,
        userId: context.userId,
        filename: context.filename,
        crewId: context.crewId,
      });
    } else {
      // No vector table, just delete metadata
      await db
        .delete(knowledgeBaseDocuments)
        .where(eq(knowledgeBaseDocuments.docId, docId));

      console.log('[KB Service] Metadata rollback successful', {
        docId,
        userId: context.userId,
        filename: context.filename,
        crewId: context.crewId,
      });
    }
  } catch (error) {
    // Critical: rollback failed - needs manual intervention
    console.error(
      '[KB Service] CRITICAL: Rollback failed - manual cleanup required',
      {
        docId,
        vectorTableName,
        userId: context.userId,
        filename: context.filename,
        crewId: context.crewId,
      },
      error
    );
    throw error;
  }
}

/**
 * Create initial metadata record
 */
export async function createDocumentMetadata(params: {
  docId: string;
  clientId: string;
  crewId: string;
  filename: string;
  fileType: string;
  fileSize: number;
}) {
  await db.insert(knowledgeBaseDocuments).values({
    docId: params.docId,
    clientId: params.clientId,
    crewId: params.crewId,
    filename: params.filename,
    fileType: params.fileType,
    fileSize: params.fileSize,
    chunkCount: 0,
    status: 'processing',
  });

  console.log('[KB Service] Document metadata created', {
    docId: params.docId,
    filename: params.filename,
    fileSize: params.fileSize,
  });
}
