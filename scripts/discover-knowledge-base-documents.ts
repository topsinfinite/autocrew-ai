import { config } from 'dotenv';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { eq } from 'drizzle-orm';
import crypto from 'crypto';
import * as schema from '../db/schema';

// Load environment variables from .env.local
config({ path: '.env.local' });

const { knowledgeBaseDocuments, crews } = schema;

interface CrewConfig {
  vectorTableName?: string;
  historiesTableName?: string;
  metadata?: Record<string, unknown>;
}

/**
 * Discovery Script: Backfill knowledge_base_documents table
 *
 * This script scans existing vector tables for documents and creates
 * metadata records in the knowledge_base_documents table.
 *
 * Uses metadata.Title from vector chunks to group documents.
 */
async function main() {
  const connectionString = process.env.POSTGRES_URL;

  if (!connectionString) {
    throw new Error('POSTGRES_URL environment variable is not set');
  }

  console.log('🔍 Starting knowledge base document discovery...\n');
  console.log('Connecting to database...');

  const client = postgres(connectionString, { max: 1 });
  const db = drizzle(client, { schema });

  try {
    // Get all customer_support crews
    const allCrews = await db
      .select()
      .from(crews)
      .where(eq(crews.type, 'customer_support'));

    console.log(`Found ${allCrews.length} customer support crews\n`);

    let totalDiscovered = 0;
    let totalErrors = 0;

    for (const crew of allCrews) {
      const config = crew.config as CrewConfig;
      const vectorTableName = config.vectorTableName;

      if (!vectorTableName) {
        console.log(`⊗ ${crew.crewCode}: No vector table configured`);
        continue;
      }

      try {
        // Validate table name (prevent SQL injection)
        if (!/^[a-z0-9_]+$/.test(vectorTableName)) {
          console.error(`⊗ ${crew.crewCode}: Invalid table name - ${vectorTableName}`);
          totalErrors++;
          continue;
        }

        // Check if table exists
        const tableExistsResult = await client.unsafe<Array<{ exists: boolean }>>(
          `SELECT EXISTS (
            SELECT FROM pg_tables
            WHERE tablename = $1
          )`,
          [vectorTableName]
        );

        if (!tableExistsResult[0]?.exists) {
          console.log(`⊗ ${crew.crewCode}: Vector table doesn't exist - ${vectorTableName}`);
          continue;
        }

        // Get all unique documents from vector table using metadata.Title
        const docs = await client.unsafe<Array<{
          title: string;
          chunk_count: string;
          created_at: string;
        }>>(
          `SELECT DISTINCT
             metadata->>'Title' as title,
             COUNT(*) as chunk_count,
             MIN(created_at) as created_at
           FROM ${vectorTableName}
           WHERE metadata->>'Title' IS NOT NULL
           GROUP BY title`
        );

        if (docs.length === 0) {
          console.log(`○ ${crew.crewCode}: No documents found in ${vectorTableName}`);
          continue;
        }

        console.log(`✓ ${crew.crewCode}: Found ${docs.length} document(s)`);

        // Insert metadata records for each document
        for (const doc of docs) {
          // Generate deterministic docId from crew.id + title
          const docId = crypto.createHash('md5')
            .update(`${crew.id}-${doc.title}`)
            .digest('hex');

          // Check if already exists
          const existing = await db
            .select()
            .from(knowledgeBaseDocuments)
            .where(eq(knowledgeBaseDocuments.docId, docId))
            .limit(1);

          if (existing.length > 0) {
            console.log(`  ⊙ "${doc.title}": Already indexed (${doc.chunk_count} chunks)`);
            continue;
          }

          // Insert new metadata record
          await db.insert(knowledgeBaseDocuments).values({
            docId,
            clientId: crew.clientId,
            crewId: crew.id,
            filename: doc.title,
            fileType: 'application/pdf', // Assume PDF for discovered documents
            fileSize: null, // Unknown for old documents
            chunkCount: parseInt(doc.chunk_count, 10),
            status: 'indexed',
            createdAt: new Date(doc.created_at),
            updatedAt: new Date(),
          });

          console.log(`  ✓ "${doc.title}": Indexed (${doc.chunk_count} chunks)`);
          totalDiscovered++;
        }

        console.log('');

      } catch (error) {
        console.error(`⊗ ${crew.crewCode}: Error -`, error instanceof Error ? error.message : 'Unknown error');
        totalErrors++;
        console.log('');
      }
    }

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`✓ Discovery complete!`);
    console.log(`  Documents discovered: ${totalDiscovered}`);
    console.log(`  Errors encountered: ${totalErrors}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    await client.end();
    process.exit(0);

  } catch (error) {
    console.error('\n❌ Fatal error:', error);
    await client.end();
    process.exit(1);
  }
}

main();
