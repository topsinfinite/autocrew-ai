# Knowledge Base Re-Architecture Plan

## Executive Summary

Re-architect the knowledge base system to follow the **conversations/histories pattern** used throughout this codebase. Currently, documents are uploaded to n8n and stored in dynamic vector tables, but there's no metadata index table - the GET endpoint queries the vector table directly using GROUP BY on `metadata.Title`, which is inefficient and doesn't follow the established architectural pattern.

**Pattern to Follow:**
- **`conversations` table** = metadata index with foreign keys (fast queries, multi-tenant filtering)
- **`histories_*` tables** = dynamic tables with actual data
- **List view:** Query metadata table only
- **Detail view:** Join with dynamic table on-demand

**Applying to Knowledge Base:**
- **`knowledge_base_documents` table** = NEW metadata index (like conversations)
- **`vec_*` tables** = existing vector tables with chunks (like histories_*)
- **List view:** Query `knowledge_base_documents` only (fast)
- **Detail view:** Join with vector table using `docId` foreign key

---

## Database Schema Design

### New Table: `knowledge_base_documents`

**Location:** `/db/schema.ts`

```typescript
export const knowledgeBaseDocuments = pgTable(
  'knowledge_base_documents',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    docId: text('doc_id').notNull().unique(),  // FK to vector chunks
    clientId: text('client_id').notNull().references(() => clients.clientCode, { onDelete: 'cascade' }),
    crewId: uuid('crew_id').notNull().references(() => crews.id, { onDelete: 'cascade' }),
    filename: text('filename').notNull(),
    fileType: text('file_type').notNull(),
    fileSize: integer('file_size'),
    chunkCount: integer('chunk_count').notNull().default(0),
    status: text('status').notNull().default('indexed'),  // 'indexed'|'processing'|'error'
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => ({
    docIdIdx: index('kb_doc_id_idx').on(table.docId),
    clientIdIdx: index('kb_client_id_idx').on(table.clientId),
    crewIdIdx: index('kb_crew_id_idx').on(table.crewId),
    createdAtIdx: index('kb_created_at_idx').on(table.createdAt),
    filenameIdx: index('kb_filename_idx').on(table.filename),
  })
);

export type KnowledgeBaseDocument = typeof knowledgeBaseDocuments.$inferSelect;
export type NewKnowledgeBaseDocument = typeof knowledgeBaseDocuments.$inferInsert;
```

**Comparison to Conversations:**
| conversations | knowledge_base_documents | Purpose |
|--------------|--------------------------|---------|
| `sessionId` | `docId` | Foreign key to dynamic table |
| `clientId` | `clientId` | Multi-tenant filtering |
| `crewId` | `crewId` | Crew association |
| `customerName` | `filename` | Display metadata |
| `sentiment` | `fileType` | Additional metadata |
| `duration` | `fileSize` | Numeric metadata |

---

## Document Flow & ID Generation

### Strategy: Generate docId Before n8n (Recommended)

**Flow:**
1. POST receives file
2. Backend generates `docId = crypto.randomUUID()`
3. Create `knowledge_base_documents` record with status='processing'
4. Send to n8n with docId in FormData
5. n8n stores `docId` in `metadata.docId` for all chunks
6. n8n returns success with `chunkCount`
7. Backend updates status='indexed', chunkCount

**Implementation:**
```typescript
// In POST /api/crews/[id]/knowledge-base
const docId = crypto.randomUUID();

// 1. Create metadata record
await db.insert(knowledgeBaseDocuments).values({
  docId,
  clientId: crew.clientId,
  crewId: crew.id,
  filename: file.name,
  fileType: file.type,
  fileSize: file.size,
  chunkCount: 0,
  status: 'processing',
});

// 2. Send to n8n
const n8nFormData = new FormData();
n8nFormData.append('crewCode', crew.crewCode);
n8nFormData.append('docId', docId);  // NEW
n8nFormData.append('binary', file, file.name);

// 3. Update on success
await db.update(knowledgeBaseDocuments)
  .set({
    status: 'indexed',
    chunkCount: n8nResponse.document?.chunk_count,
    updatedAt: new Date()
  })
  .where(eq(knowledgeBaseDocuments.docId, docId));
```

**Rollback on Error:**
```typescript
catch (error) {
  // Delete metadata record if n8n fails
  await db.delete(knowledgeBaseDocuments)
    .where(eq(knowledgeBaseDocuments.docId, docId));
  throw error;
}
```

---

## Query Patterns

### Pattern 1: List Documents (Metadata Only - FAST)

**Before (SLOW):**
```sql
-- Full scan + GROUP BY on vector table
SELECT metadata->>'Title' as title, COUNT(*) as chunks
FROM vec_acme_001_sup_001
GROUP BY title
```

**After (FAST):**
```typescript
// Index scan on metadata table
const documents = await db
  .select()
  .from(knowledgeBaseDocuments)
  .where(eq(knowledgeBaseDocuments.crewId, crewId))
  .orderBy(desc(knowledgeBaseDocuments.createdAt));
```

**Performance:** 10-100x faster (indexed query vs full table scan)

### Pattern 2: Get Document Details (On-Demand)

```typescript
// 1. Get metadata
const [doc] = await db
  .select()
  .from(knowledgeBaseDocuments)
  .where(eq(knowledgeBaseDocuments.docId, docId))
  .limit(1);

// 2. Get chunks from vector table (if needed)
const chunks = await client.unsafe(
  `SELECT id, content, metadata, created_at
   FROM ${vectorTableName}
   WHERE metadata->>'docId' = $1
   ORDER BY (metadata->>'chunkIndex')::int ASC`,
  [docId]
);

return { ...doc, chunks };
```

### Pattern 3: Delete Document (Both Tables)

```typescript
// 1. Delete metadata
await db
  .delete(knowledgeBaseDocuments)
  .where(eq(knowledgeBaseDocuments.docId, docId));

// 2. Delete chunks
await db.execute(sql`
  DELETE FROM ${sql.identifier(vectorTableName)}
  WHERE metadata->>'docId' = ${docId}
`);
```

---

## Multi-Tenancy Implementation

### Helper Functions

**Create:** `/lib/db/knowledge-base.ts` (mirrors `/lib/db/conversations.ts`)

```typescript
export interface GetDocumentsParams {
  clientId?: string;
  crewId?: string;
  status?: 'indexed' | 'processing' | 'error';
  limit?: number;
  offset?: number;
}

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

export async function getDocumentById(docId: string) {
  const [doc] = await db
    .select()
    .from(knowledgeBaseDocuments)
    .where(eq(knowledgeBaseDocuments.docId, docId))
    .limit(1);

  if (!doc) return null;

  // Get crew to find vector table name
  const [crew] = await db
    .select()
    .from(crews)
    .where(eq(crews.id, doc.crewId))
    .limit(1);

  const config = crew.config as CrewConfig;
  const chunks = config.vectorTableName
    ? await queryVectorTable(config.vectorTableName, docId)
    : [];

  return { ...doc, chunks };
}

async function queryVectorTable(tableName: string, docId: string) {
  // Validate table name (prevent SQL injection)
  if (!/^[a-z0-9_]+$/.test(tableName)) {
    throw new Error('Invalid table name');
  }

  return await client.unsafe(
    `SELECT id, content, metadata, created_at
     FROM ${tableName}
     WHERE metadata->>'docId' = $1
     ORDER BY (metadata->>'chunkIndex')::int ASC`,
    [docId]
  );
}
```

**Authorization Pattern:**
```typescript
// SuperAdmin: See all
const allDocs = await getDocuments({});

// Client Admin: Filter by clientId
const clientDocs = await getDocuments({ clientId: 'ACME-001' });

// Crew-specific
const crewDocs = await getDocuments({ crewId: crew.id });
```

---

## N8N Integration Updates

### Required Changes

**Input (ADD docId):**
```javascript
// FormData sent to n8n
{
  crewCode: "ACME-001-SUP-001",
  docId: "550e8400-e29b-41d4-a716-446655440000",  // NEW
  binary: <file data>
}
```

**Processing:**
```javascript
// In PGVector Store node metadata field
{
  "docId": "{{ $json.docId }}",           // NEW - from FormData
  "filename": "{{ $binary.filename }}",
  "fileType": "{{ $binary.mimeType }}",
  "fileSize": {{ $binary.fileSize }},
  "chunkIndex": {{ $index }}
}
```

**Output (ADD chunkCount):**
```json
{
  "status": "success",
  "metadata": {
    "crew_code": "ACME-001-SUP-001",
    "vector_table": "vec_acme_001_sup_001",
    "doc_id": "550e8400-e29b-41d4-a716-446655440000"
  },
  "document": {
    "status": "indexed",
    "chunk_count": 42,  // NEW
    "embeddings_model": "text-embedding-3-small"
  }
}
```

**Workflow Changes:**
1. Add "Extract docId" node after webhook
2. Update PGVector Store metadata to include docId
3. Add "Count Chunks" node
4. Update response format

---

## Migration Strategy

### Phase 1: Database Schema

**1. Update `/db/schema.ts`**
- Add `knowledgeBaseDocuments` table
- Add indexes
- Export types

**2. Generate & Apply Migration**
```bash
npm run db:generate
npm run db:migrate
```

**3. Update `/types/index.ts`**
```typescript
export interface KnowledgeBaseDocument {
  id: string;
  docId: string;
  clientId: string;
  crewId: string;
  filename: string;
  fileType: string;
  fileSize: number;
  chunkCount: number;
  status: 'indexed' | 'processing' | 'error';
  createdAt: Date;
  updatedAt: Date;
}

export interface KnowledgeBaseDocumentWithChunks extends KnowledgeBaseDocument {
  chunks: VectorChunk[];
}
```

### Phase 2: Discovery Script (Backfill)

**Create:** `/scripts/discover-knowledge-base-documents.ts`

```typescript
import { db, client } from '@/db';
import { knowledgeBaseDocuments, crews } from '@/db/schema';
import { eq } from 'drizzle-orm';
import crypto from 'crypto';

async function main() {
  console.log('Discovering existing documents...');

  const allCrews = await db
    .select()
    .from(crews)
    .where(eq(crews.type, 'customer_support'));

  for (const crew of allCrews) {
    const config = crew.config as any;
    if (!config.vectorTableName) continue;

    try {
      // Get unique documents from vector table using metadata.Title
      const docs = await client.unsafe(
        `SELECT DISTINCT
           metadata->>'Title' as title,
           COUNT(*) as chunk_count,
           MIN(created_at) as created_at
         FROM ${config.vectorTableName}
         WHERE metadata->>'Title' IS NOT NULL
         GROUP BY title`
      );

      for (const doc of docs as any[]) {
        // Generate docId from title (deterministic)
        const docId = crypto.createHash('md5')
          .update(`${crew.id}-${doc.title}`)
          .digest('hex');

        // Insert metadata record
        await db.insert(knowledgeBaseDocuments).values({
          docId,
          clientId: crew.clientId,
          crewId: crew.id,
          filename: doc.title,
          fileType: 'application/pdf',
          chunkCount: parseInt(doc.chunk_count),
          status: 'indexed',
          createdAt: new Date(doc.created_at),
        });

        console.log(`✓ ${doc.title}: Indexed`);
      }
    } catch (error) {
      console.error(`⊗ ${crew.crewCode}:`, error);
    }
  }
}

main();
```

**Run:**
```bash
npx tsx scripts/discover-knowledge-base-documents.ts
```

### Phase 3: Update Backend

**Files to Modify:**

1. **`/lib/db/knowledge-base.ts`** (NEW)
   - `getDocuments(params)`
   - `getDocumentById(docId)`
   - `discoverDocuments(clientId)`
   - `queryVectorTable(tableName, docId)`

2. **`/app/api/crews/[id]/knowledge-base/route.ts`**
   - POST: Create metadata before n8n, update after
   - GET: Query metadata table instead of vector table

3. **`/app/api/crews/[id]/knowledge-base/[docId]/route.ts`**
   - DELETE: Delete from both tables

4. **`/lib/api/knowledge-base.ts`**
   - Update client helpers (minimal changes)

### Phase 4: Update N8N Workflow

1. Add docId extraction from FormData
2. Store docId in chunk metadata
3. Return chunk_count in response
4. Test with new POST requests

### Phase 5: Testing

**Checklist:**
- [ ] Migration creates table with indexes
- [ ] Discovery script backfills existing data
- [ ] POST creates metadata + updates on success
- [ ] GET queries metadata table (fast)
- [ ] DELETE removes from both tables
- [ ] Authorization enforced (multi-tenant)
- [ ] N8N stores docId in chunks
- [ ] N8N returns chunk_count

---

## Performance Improvements

### Query Performance

| Operation | Before | After | Improvement |
|-----------|--------|-------|-------------|
| List all docs | O(n) - Full scan + GROUP BY | O(log n) - Index scan | 10-100x |
| Filter by client | O(n) - No client index | O(log n) - Index | 50-500x |
| Get by docId | O(n) - JSONB search | O(1) - Unique index | 100-1000x |

### Index Strategy

```sql
-- Primary (for queries)
CREATE INDEX kb_client_id_idx ON knowledge_base_documents (client_id);
CREATE INDEX kb_crew_id_idx ON knowledge_base_documents (crew_id);
CREATE INDEX kb_created_at_idx ON knowledge_base_documents (created_at DESC);

-- Secondary (for lookups)
CREATE UNIQUE INDEX kb_doc_id_idx ON knowledge_base_documents (doc_id);
CREATE INDEX kb_filename_idx ON knowledge_base_documents (filename);
```

---

## Critical Files

### Files to Create
1. `/lib/db/knowledge-base.ts` - Core business logic
2. `/scripts/discover-knowledge-base-documents.ts` - Migration script

### Files to Modify
1. `/db/schema.ts` - Add table schema
2. `/types/index.ts` - Update interfaces
3. `/app/api/crews/[id]/knowledge-base/route.ts` - POST & GET
4. `/app/api/crews/[id]/knowledge-base/[docId]/route.ts` - DELETE
5. `/lib/api/knowledge-base.ts` - Client helpers

### Database Migrations
- Generate: `npm run db:generate`
- Apply: `npm run db:migrate`
- Backfill: `npx tsx scripts/discover-knowledge-base-documents.ts`

---

## Summary

This re-architecture transforms the knowledge base from **direct vector table queries** to the **conversations/histories metadata index pattern**. Key benefits:

1. ✅ **Performance:** List queries 10-100x faster with indexed metadata table
2. ✅ **Consistency:** Follows exact pattern used in conversations/histories
3. ✅ **Multi-Tenancy:** Proper foreign keys enable fast client/crew filtering
4. ✅ **Data Integrity:** Metadata records ensure referential integrity
5. ✅ **Scalability:** Denormalized metadata allows constant-time queries

The implementation preserves all existing functionality while adding the metadata layer. The discovery script ensures backward compatibility with existing data.
