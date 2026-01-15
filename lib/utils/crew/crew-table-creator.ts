import { db } from '@/db';
import { sql } from 'drizzle-orm';
import { sanitizeTableName } from './crew-table-generator';

/**
 * Create a vector table for RAG/embeddings
 * Schema:
 * - id: UUID primary key
 * - content: TEXT for the document/chunk content
 * - metadata: JSONB for additional data
 * - embedding: VECTOR(1536) for OpenAI embeddings
 * - created_at: TIMESTAMP
 *
 * Indexes:
 * - HNSW index for fast similarity search
 * - GIN index for JSONB metadata queries
 */
export async function createVectorTable(tableName: string): Promise<void> {
  // Validate table name
  const sanitized = sanitizeTableName(tableName);

  try {
    // Create table
    await db.execute(sql.raw(`
      CREATE TABLE ${sanitized} (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        content TEXT NOT NULL,
        metadata JSONB DEFAULT '{}'::jsonb,
        embedding VECTOR(1536),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `));

    // Create HNSW index for fast vector similarity search
    await db.execute(sql.raw(`
      CREATE INDEX ${sanitized}_embedding_idx
      ON ${sanitized}
      USING hnsw (embedding vector_cosine_ops)
    `));

    // Create GIN index for JSONB metadata queries
    await db.execute(sql.raw(`
      CREATE INDEX ${sanitized}_metadata_idx
      ON ${sanitized}
      USING gin (metadata)
    `));

    console.log(`✓ Created vector table: ${sanitized}`);
  } catch (error) {
    console.error(`Failed to create vector table ${sanitized}:`, error);
    throw error;
  }
}

/**
 * Create a histories table for conversation logs
 * Schema:
 * - id: SERIAL primary key
 * - session_id: TEXT for grouping conversation sessions
 * - message: JSONB for storing message data (role, content, etc.)
 * - created_at: TIMESTAMP
 *
 * Indexes:
 * - Index on session_id for fast session lookups
 * - Index on created_at DESC for chronological queries
 */
export async function createHistoriesTable(tableName: string): Promise<void> {
  // Validate table name
  const sanitized = sanitizeTableName(tableName);

  try {
    // Create table
    await db.execute(sql.raw(`
      CREATE TABLE ${sanitized} (
        id SERIAL PRIMARY KEY,
        session_id TEXT NOT NULL,
        message JSONB NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `));

    // Create index on session_id for fast lookups
    await db.execute(sql.raw(`
      CREATE INDEX ${sanitized}_session_id_idx
      ON ${sanitized} (session_id)
    `));

    // Create index on created_at for chronological queries
    await db.execute(sql.raw(`
      CREATE INDEX ${sanitized}_created_at_idx
      ON ${sanitized} (created_at DESC)
    `));

    console.log(`✓ Created histories table: ${sanitized}`);
  } catch (error) {
    console.error(`Failed to create histories table ${sanitized}:`, error);
    throw error;
  }
}

/**
 * Drop a table with safety checks
 * - Validates table name for SQL injection prevention
 * - Uses CASCADE to drop dependent objects
 * - Logs the operation
 *
 * Safety: Only drops tables matching crew table patterns
 * Supports both old format (no prefix) and new format (__ prefix)
 */
export async function dropTable(tableName: string): Promise<void> {
  try {
    // Basic validation to prevent SQL injection
    if (!tableName || typeof tableName !== 'string') {
      console.error(`Invalid table name: ${tableName}`);
      return;
    }

    // Check max length (PostgreSQL limit: 63 characters)
    if (tableName.length > 63) {
      console.error(`Table name exceeds PostgreSQL limit: ${tableName}`);
      return;
    }

    // Only allow alphanumeric and underscores (basic SQL injection prevention)
    // Supports both old format (no prefix) and new format (__ prefix)
    const safePattern = /^_?_?[a-z0-9_]+$/;
    if (!safePattern.test(tableName)) {
      console.error(`Invalid characters in table name: ${tableName}`);
      return;
    }

    // Must contain crew table identifiers (vector or histories) to prevent accidental drops
    if (!tableName.includes('vector') && !tableName.includes('histories')) {
      console.error(`Refusing to drop non-crew table: ${tableName}`);
      return;
    }

    // Drop table with CASCADE to remove indexes and constraints
    await db.execute(sql.raw(`DROP TABLE IF EXISTS "${tableName}" CASCADE`));

    console.log(`✓ Dropped table: ${tableName}`);
  } catch (error) {
    // Log error but don't throw - allow cleanup to continue
    console.error(`Failed to drop table ${tableName}:`, error);
  }
}

/**
 * Drop multiple tables in a single operation
 * Useful for cleanup operations
 */
export async function dropTables(tableNames: string[]): Promise<void> {
  for (const tableName of tableNames) {
    await dropTable(tableName);
  }
}
