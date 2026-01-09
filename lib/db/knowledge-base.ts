import { db, client } from '@/db';
import { knowledgeBaseDocuments, crews } from '@/db/schema';
import { eq, and, desc } from 'drizzle-orm';
import { logger } from '@/lib/utils';
import type { CrewConfig, VectorChunk, KnowledgeBaseDocumentWithChunks } from '@/types';

/**
 * Knowledge Base Database Helpers
 *
 * Mirrors the conversations.ts pattern for managing knowledge base documents.
 * - Metadata table: knowledge_base_documents (for fast list queries)
 * - Dynamic tables: vec_* tables (for actual chunk data)
 */

export interface GetDocumentsParams {
  clientId?: string;
  crewId?: string;
  status?: 'indexed' | 'processing' | 'error';
  limit?: number;
  offset?: number;
}

/**
 * Get documents from metadata table (fast, indexed query)
 * Similar to getConversations() in conversations.ts
 */
export async function getDocuments(params: GetDocumentsParams = {}) {
  const { clientId, crewId, status, limit = 50, offset = 0 } = params;

  const conditions = [];
  if (clientId) conditions.push(eq(knowledgeBaseDocuments.clientId, clientId));
  if (crewId) conditions.push(eq(knowledgeBaseDocuments.crewId, crewId));
  if (status) conditions.push(eq(knowledgeBaseDocuments.status, status));

  return await db
    .select()
    .from(knowledgeBaseDocuments)
    .where(conditions.length > 0 ? and(...conditions) : undefined)
    .orderBy(desc(knowledgeBaseDocuments.createdAt))
    .limit(limit)
    .offset(offset);
}

/**
 * Get document by ID (metadata only)
 * Similar to getConversationById() without chunks
 */
export async function getDocumentById(docId: string) {
  const [doc] = await db
    .select()
    .from(knowledgeBaseDocuments)
    .where(eq(knowledgeBaseDocuments.docId, docId))
    .limit(1);

  return doc || null;
}

/**
 * Get document with chunks from vector table (on-demand)
 * Similar to getConversationMessages() pattern
 */
export async function getDocumentWithChunks(
  docId: string
): Promise<KnowledgeBaseDocumentWithChunks | null> {
  // Step 1: Get metadata
  const doc = await getDocumentById(docId);
  if (!doc) return null;

  // Step 2: Get crew to find vector table name
  const [crew] = await db
    .select()
    .from(crews)
    .where(eq(crews.id, doc.crewId))
    .limit(1);

  if (!crew) return null;

  // Step 3: Query vector table for chunks
  const config = crew.config as CrewConfig;
  const chunks = config.vectorTableName
    ? await queryVectorTable(config.vectorTableName, docId)
    : [];

  return {
    ...doc,
    chunks,
  } as KnowledgeBaseDocumentWithChunks;
}

/**
 * Query dynamic vector table for chunks
 * Similar to getConversationMessages() querying histories tables
 */
export async function queryVectorTable(
  tableName: string,
  docId: string
): Promise<VectorChunk[]> {
  try {
    // Validate table name (prevent SQL injection)
    if (!/^[a-z0-9_]+$/.test(tableName)) {
      throw new Error(`Invalid table name: ${tableName}`);
    }

    const result = await client.unsafe<VectorChunk[]>(
      `SELECT id, content, metadata, created_at
       FROM ${tableName}
       WHERE metadata->>'docId' = $1
       ORDER BY (metadata->>'chunkIndex')::int ASC`,
      [docId]
    );

    return result || [];
  } catch (error) {
    await logger.error('Failed to query vector table', {
      tableName,
      docId,
      operation: 'query_vector_table',
    }, error);
    return [];
  }
}

/**
 * Delete document (metadata and chunks)
 */
export async function deleteDocument(docId: string, vectorTableName: string): Promise<number> {
  try {
    // Validate table name (prevent SQL injection)
    if (!/^[a-z0-9_]+$/.test(vectorTableName)) {
      throw new Error(`Invalid table name: ${vectorTableName}`);
    }

    // Delete chunks from vector table
    const result = await client.unsafe<Array<{ id: string }>>(
      `DELETE FROM ${vectorTableName}
       WHERE metadata->>'docId' = $1
       RETURNING id`,
      [docId]
    );

    // Delete metadata record
    await db
      .delete(knowledgeBaseDocuments)
      .where(eq(knowledgeBaseDocuments.docId, docId));

    return result.length;
  } catch (error) {
    await logger.error('Failed to delete document', {
      docId,
      vectorTableName,
      operation: 'delete_document',
    }, error);
    throw error;
  }
}

/**
 * Discovery: Scan vector tables and create missing metadata records
 * Similar to discoverConversations pattern
 */
export async function discoverDocuments(clientId: string): Promise<void> {
  // Get all customer_support crews for this client
  const clientCrews = await db
    .select()
    .from(crews)
    .where(and(
      eq(crews.clientId, clientId),
      eq(crews.type, 'customer_support')
    ));

  // Get existing document docIds
  const existing = await db
    .select({ docId: knowledgeBaseDocuments.docId })
    .from(knowledgeBaseDocuments)
    .where(eq(knowledgeBaseDocuments.clientId, clientId));

  const existingDocIds = new Set(existing.map((e) => e.docId));

  // Scan each crew's vector table for new documents
  for (const crew of clientCrews) {
    const config = crew.config as CrewConfig;
    if (!config.vectorTableName) continue;

    try {
      // Validate table name
      if (!/^[a-z0-9_]+$/.test(config.vectorTableName)) {
        await logger.error('Invalid vector table name detected', {
          vectorTableName: config.vectorTableName,
          crewId: crew.id,
          clientId,
          operation: 'discover_documents',
        });
        continue;
      }

      // Get all unique docIds from vector table
      const docs = await client.unsafe<Array<{
        doc_id: string;
        filename: string;
        file_type: string;
        file_size: number;
        chunk_count: string;
        created_at: string;
      }>>(
        `SELECT DISTINCT
           metadata->>'docId' as doc_id,
           metadata->>'filename' as filename,
           metadata->>'fileType' as file_type,
           (metadata->>'fileSize')::int as file_size,
           COUNT(*) as chunk_count,
           MIN(created_at) as created_at
         FROM ${config.vectorTableName}
         WHERE metadata->>'docId' IS NOT NULL
         GROUP BY doc_id, filename, file_type, file_size`
      );

      // Create metadata records for new documents
      for (const doc of docs) {
        if (existingDocIds.has(doc.doc_id)) continue;

        await db.insert(knowledgeBaseDocuments).values({
          docId: doc.doc_id,
          clientId,
          crewId: crew.id,
          filename: doc.filename || 'Unknown Document',
          fileType: doc.file_type || 'application/pdf',
          fileSize: doc.file_size || null,
          chunkCount: parseInt(doc.chunk_count, 10),
          status: 'indexed',
          createdAt: new Date(doc.created_at),
          updatedAt: new Date(),
        });

        existingDocIds.add(doc.doc_id);
      }
    } catch (error) {
      await logger.error('Failed to scan vector table for documents', {
        vectorTableName: config.vectorTableName,
        crewId: crew.id,
        clientId,
        operation: 'discover_documents',
      }, error);
    }
  }
}
