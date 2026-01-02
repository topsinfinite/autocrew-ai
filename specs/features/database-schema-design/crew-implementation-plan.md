# Crew Implementation Plan: Multi-Tenant Crew Management with Dynamic Tables

**Document**: crew-implementation-plan.md
**Location**: specs/features/database-schema-design/
**Status**: Planning Phase - Updated with crew_code field
**Last Updated**: December 31, 2025

## Overview

Implement a production-ready Crew data model with automatic dynamic table creation for **customer support crews only**. Each support crew gets dedicated vector (embeddings) and histories (conversation) tables with unique naming per client.

**Scope**: Customer Support crews only. Lead Generation crew table requirements will be specified later.

**Key Features**:
- Multi-tenant crew management
- Automatic vector table creation (pgvector) for RAG capabilities
- Automatic histories table creation for conversation logs
- Transaction-based provisioning with rollback on failure
- Cleanup utilities for orphaned tables
- RESTful API for crew CRUD operations

## User Decisions

Based on clarifying questions:
1. ✅ **Focus**: Customer Support crews only (Lead Gen tables TBD later)
2. ✅ **Client Reference**: Use `client_code` (e.g., "ACME-001") as foreign key
3. ✅ **Conversation Model**: Dynamic histories tables will eventually replace the Conversation model (note for future migration)
4. ✅ **Access Control**: Skip authentication for now (implement with Better-Auth later)

## Database Schema

### Crew Table Structure

```typescript
crews {
  id: UUID (primary key, auto-generated)
  name: TEXT (not null)
  client_id: TEXT (foreign key → clients.client_code, CASCADE)
  crew_code: TEXT (unique, not null, auto-generated)
  type: ENUM('customer_support', 'lead_generation')
  config: JSONB (stores dynamic table names)
  webhook_url: TEXT (not null)
  status: ENUM('active', 'inactive', 'error')
  created_at: TIMESTAMP WITH TIME ZONE
  updated_at: TIMESTAMP WITH TIME ZONE
}
```

**Indexes**: client_id, crew_code (unique), type, status, name

**Crew Code Format**: `{client_code}-{crew_type_short}-{sequence}` (e.g., "ACME-001-SUP-001", "ACME-001-LEAD-001")
- Generated automatically during crew creation
- Includes client_code for multi-tenant isolation
- Used for n8n integration and external references
- Unique across entire system

**Config JSONB Structure**:
```json
{
  "vectorTableName": "acme_001_support_vector_001",
  "historiesTableName": "acme_001_support_histories_001",
  "metadata": {}
}
```

### Dynamic Table Schemas

#### Vector Table (for RAG/embeddings)
```sql
CREATE TABLE {client_code}_{crew_type}_vector_{sequence} (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content TEXT NOT NULL,
  metadata JSONB DEFAULT '{}'::jsonb,
  embedding VECTOR(1536),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- HNSW index for fast similarity search
CREATE INDEX ON {table_name} USING hnsw (embedding vector_cosine_ops);

-- GIN index for JSONB metadata queries
CREATE INDEX ON {table_name} USING gin (metadata);
```

#### Histories Table (for conversation logs)
```sql
CREATE TABLE {client_code}_{crew_type}_histories_{sequence} (
  id SERIAL PRIMARY KEY,
  session_id TEXT NOT NULL,
  message JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for fast lookups
CREATE INDEX ON {table_name} (session_id);
CREATE INDEX ON {table_name} (created_at DESC);
```

## Implementation Phases

### Phase 1: Database Foundation ⚙️

**Goal**: Set up database schema, types, and pgvector extension

**Tasks**:

1. **Install Dependencies**
   ```bash
   npm install pgvector
   ```

2. **Update Database Schema** (`db/schema.ts`)
   - Add `crewTypeEnum` and `crewStatusEnum`
   - Create `crews` table with JSONB config field and `crew_code` field
   - Add indexes (client_id, crew_code (unique), type, status, name)
   - Create Zod validation schemas (`insertCrewSchema`, `selectCrewSchema`)
   - Export TypeScript types (`Crew`, `NewCrew`, `CrewConfig`)

3. **Enable pgvector Extension** (`db/migrate.ts`)
   - Add `CREATE EXTENSION IF NOT EXISTS vector` before running migrations
   - Verify extension is installed

4. **Update Type System** (`types/index.ts`)
   - Update `Crew` interface to match database schema
   - Add `CrewConfig` interface for JSONB structure
   - Add `NewCrewInput` for API validation
   - Update `CrewType` enum to match database

5. **Generate Migrations**
   ```bash
   npm run db:generate  # Creates migration for crews table
   npm run db:migrate   # Runs migrations + enables pgvector
   ```

**Success Criteria**:
- ✅ pgvector extension enabled
- ✅ Crews table created with proper schema
- ✅ TypeScript types compile without errors
- ✅ Migrations run successfully

---

### Phase 2: Dynamic Table Utilities 🛠️

**Goal**: Build utilities for table name generation, creation, and cleanup

**Tasks**:

1. **Create Table Name Generator** (`lib/utils/crew-table-generator.ts`)
   - `generateCrewTableName()`: Generate unique table names
     - Format: `{client_code}_{crew_type}_{table_type}_{sequence}`
     - Example: `acme_001_support_vector_001`
   - `sanitizeTableName()`: Validate and sanitize table names (prevent SQL injection)
   - `tableExists()`: Check if table already exists in database

1a. **Create Crew Code Generator** (`lib/utils/crew-code-generator.ts`)
   - `generateCrewCode()`: Generate unique crew codes
     - Format: `{client_code}-{crew_type_short}-{sequence}`
     - Example: `ACME-001-SUP-001` (support), `ACME-001-LEAD-001` (lead gen)
     - Type abbreviations: SUP (customer_support), LEAD (lead_generation)
   - `isCrewCodeAvailable()`: Check if crew code exists
   - Query existing crew codes for same client and type to get next sequence number

2. **Create Table Creator** (`lib/utils/crew-table-creator.ts`)
   - `createVectorTable()`: Create vector table with pgvector column and HNSW index
   - `createHistoriesTable()`: Create histories table with session_id index
   - `dropTable()`: Delete table with safety checks (pattern matching)

3. **Create Provisioning Orchestrator** (`lib/utils/crew-provisioning.ts`)
   - `provisionCrew()`: Main function to create crew with dynamic tables
     - Wraps in transaction
     - Generates unique `crew_code` using `generateCrewCode()`
     - Generates unique table names (for support crews)
     - Creates tables (for support crews only)
     - Inserts crew record with config and crew_code
     - Rolls back on error (including crew_code cleanup)
   - `deprovisionCrew()`: Delete crew and cleanup dynamic tables
     - Deletes crew record
     - Drops associated tables
     - Logs errors but continues cleanup

4. **Create Cleanup Utilities** (`lib/utils/cleanup-orphaned-tables.ts`)
   - `findOrphanedTables()`: Detect tables not registered in any crew config
   - `cleanupOrphanedTables()`: Remove orphaned tables (with dry-run mode)
   - Safety: Only drop tables matching pattern `{client_code}_{type}_{table_type}_{seq}`

**Success Criteria**:
- ✅ Crew codes generated uniquely (e.g., ACME-001-SUP-001)
- ✅ Table names generated uniquely
- ✅ Vector table creates with pgvector index
- ✅ Histories table creates with proper indexes
- ✅ Transaction rollback works on error
- ✅ Orphaned table detection works

---

### Phase 3: API Routes 🌐

**Goal**: Implement RESTful API for crew management

**Tasks**:

1. **Create Main Crew Routes** (`app/api/crews/route.ts`)

   **GET /api/crews**:
   - Query params: `clientId`, `type`, `status`, `sortBy`, `order`
   - Returns: `{success: true, data: Crew[], count: number}`

   **POST /api/crews**:
   - Validates request body with Zod
   - Verifies client exists
   - Calls `provisionCrew()` to create crew + tables
   - Returns: `{success: true, data: Crew, message: string}`
   - Error handling: 400 (validation), 404 (client not found), 409 (conflict), 500 (server)

2. **Create Single Crew Routes** (`app/api/crews/[id]/route.ts`)

   **GET /api/crews/:id**:
   - Returns single crew by ID
   - 404 if not found

   **PATCH /api/crews/:id**:
   - Update crew (name, status, webhookUrl)
   - Prevent changing `type`, `clientId`, or `crew_code` (immutable)
   - Returns updated crew

   **DELETE /api/crews/:id**:
   - Calls `deprovisionCrew()` to delete crew + cleanup tables
   - Returns success message

3. **Create Client Crews Route** (`app/api/clients/[id]/crews/route.ts`)

   **GET /api/clients/:id/crews**:
   - List all crews for specific client
   - Ordered by created_at DESC

4. **Create API Helper Functions** (`lib/api/crews.ts`)
   - `getCrews()`: Fetch crews with filtering
   - `getCrewById()`: Fetch single crew
   - `createCrew()`: Create new crew
   - `updateCrew()`: Update crew
   - `deleteCrew()`: Delete crew
   - `getCrewsByClient()`: Fetch crews for client

**Success Criteria**:
- ✅ All CRUD endpoints work correctly
- ✅ Dynamic tables created on POST
- ✅ Tables cleaned up on DELETE
- ✅ Proper error handling and validation
- ✅ Consistent response format

---

### Phase 4: Seed Data 🌱

**Goal**: Update seed script to create sample crews with dynamic tables

**Tasks**:

1. **Update Seed Script** (`db/seed.ts`)
   - Clear existing crews before seeding
   - Create 5 sample crews distributed across clients:
     - 2 support crews for ACME-001
     - 1 support crew for TECHSTART-001
     - 1 lead gen crew for ACME-001 (no tables)
     - 1 support crew for HEALTHTECH-001
   - Use `provisionCrew()` for transactional creation
   - Log created table names for verification
   - Verify crews and tables in database

2. **Sample Crew Data**:
   ```typescript
   {
     name: 'Customer Support Crew',
     clientId: 'ACME-001',
     type: 'customer_support',
     webhookUrl: 'https://n8n.example.com/webhook/support-1',
     status: 'active'
   }
   ```

   **Note**: `crew_code` is auto-generated during creation (e.g., "ACME-001-SUP-001")

**Success Criteria**:
- ✅ `npm run db:seed` runs successfully
- ✅ Crews created in database
- ✅ Dynamic tables created for support crews
- ✅ Lead gen crew created without tables
- ✅ Config JSONB populated with table names

---

### Phase 5: Testing & Verification ✅

**Goal**: Comprehensive testing of all components

**Tasks**:

1. **Database Verification**
   ```bash
   # Check crews table
   docker exec {container} psql -U dev_user -d postgres_autocrew_dev -c "\d crews"

   # Check seeded crews
   docker exec {container} psql -U dev_user -d postgres_autocrew_dev -c "SELECT name, type, config FROM crews"

   # Check dynamic tables exist
   docker exec {container} psql -U dev_user -d postgres_autocrew_dev -c "\dt *support*"
   ```

2. **API Testing**
   ```bash
   # List all crews
   curl http://localhost:3000/api/crews

   # Create support crew (should create tables and auto-generate crew_code)
   curl -X POST http://localhost:3000/api/crews \
     -H "Content-Type: application/json" \
     -d '{"name":"Test Crew","clientId":"ACME-001","type":"customer_support","webhookUrl":"https://test.com/webhook"}'

   # Verify tables created
   docker exec {container} psql -U dev_user -d postgres_autocrew_dev -c "\dt *test*"

   # Delete crew (should drop tables)
   curl -X DELETE http://localhost:3000/api/crews/{id}

   # Verify tables deleted
   docker exec {container} psql -U dev_user -d postgres_autocrew_dev -c "\dt *test*"
   ```

3. **Edge Case Testing**
   - Create multiple support crews for same client (verify unique table names)
   - Create lead gen crew (verify no tables created)
   - Try creating crew with non-existent client (should 404)
   - Test concurrent crew creation (verify no naming conflicts)
   - Test orphaned table cleanup utility

4. **Integration Testing Checklist**
   - [ ] Crew creation with all fields
   - [ ] Crew creation with minimal fields
   - [ ] Filter crews by clientId
   - [ ] Filter crews by type
   - [ ] Filter crews by status
   - [ ] Update crew name
   - [ ] Update crew status
   - [ ] Delete crew and verify cleanup
   - [ ] Get crews for specific client
   - [ ] Verify pgvector indexes created
   - [ ] Verify histories indexes created

**Success Criteria**:
- ✅ All API endpoints tested
- ✅ Dynamic tables created and cleaned up correctly
- ✅ No orphaned tables after operations
- ✅ Concurrent operations handled properly
- ✅ Error cases handled gracefully

---

## Critical Files

### Files to Create (10 new files)

1. **`lib/utils/crew-table-generator.ts`**
   - Table name generation logic
   - Sanitization and validation
   - Uniqueness checking

2. **`lib/utils/crew-code-generator.ts`**
   - Crew code generation logic
   - Format: {client_code}-{type_short}-{sequence}
   - Uniqueness checking across system

3. **`lib/utils/crew-table-creator.ts`**
   - Vector table DDL
   - Histories table DDL
   - Table deletion with safety checks

4. **`lib/utils/crew-provisioning.ts`**
   - Crew provisioning orchestrator
   - Transaction management
   - Rollback handling
   - Crew code generation integration

5. **`lib/utils/cleanup-orphaned-tables.ts`**
   - Orphaned table detection
   - Cleanup utilities
   - Dry-run support

6. **`app/api/crews/route.ts`**
   - GET /api/crews (list with filtering)
   - POST /api/crews (create with auto-generated crew_code)

7. **`app/api/crews/[id]/route.ts`**
   - GET /api/crews/:id (single)
   - PATCH /api/crews/:id (update)
   - DELETE /api/crews/:id (delete)

8. **`app/api/clients/[id]/crews/route.ts`**
   - GET /api/clients/:id/crews

9. **`lib/api/crews.ts`**
   - API helper functions
   - Client-side fetch wrappers

10. **`types/api.ts`** (if not exists)
    - ApiResponse<T> interface

### Files to Modify (4 existing files)

1. **`db/schema.ts`**
   - Add crew enums
   - Add crews table definition
   - Add JSONB config field
   - Add Zod schemas
   - Export types

2. **`types/index.ts`**
   - Update Crew interface
   - Add CrewConfig interface
   - Add NewCrewInput type
   - Update CrewType enum

3. **`db/seed.ts`**
   - Add crew seeding logic
   - Use provisionCrew() function
   - Add verification logging

4. **`db/migrate.ts`**
   - Add pgvector extension enablement
   - Add extension verification

### Dependencies to Install

```bash
npm install pgvector
```

---

## Data Flow

### Crew Creation Flow

```
POST /api/crews
  ↓
Validate request body (Zod)
  ↓
Verify client exists
  ↓
provisionCrew()
  ├─ Start transaction
  ├─ Generate unique crew_code (e.g., "ACME-001-SUP-001")
  ├─ Generate table names (if support crew)
  ├─ Create vector table
  ├─ Create histories table
  ├─ Build config JSONB
  ├─ Insert crew record with crew_code
  └─ Commit (or rollback on error)
  ↓
Return crew with config and crew_code
```

### Crew Deletion Flow

```
DELETE /api/crews/:id
  ↓
deprovisionCrew()
  ├─ Start transaction
  ├─ Get crew (to access config)
  ├─ Delete crew record
  ├─ Drop vector table
  ├─ Drop histories table
  └─ Commit
  ↓
Return success
```

---

## Naming Conventions

### Table Naming Pattern

**Format**: `{client_code}_{crew_type}_{table_type}_{sequence}`

**Examples**:
- `acme_001_support_vector_001`
- `acme_001_support_histories_001`
- `acme_001_support_vector_002` (second support crew)
- `techstart_001_support_vector_001`

**Normalization**:
- Client code: lowercase, hyphens → underscores
- Crew type: shortened (`customer_support` → `support`, `lead_generation` → `leadgen`)
- Sequence: 3-digit padding (`001`, `002`, etc.)

**Uniqueness**: Sequence number increments for each crew of same type for same client

**Safety**:
- Regex validation: `^[a-z0-9]+_[0-9]+_(support|leadgen)_(vector|histories)_[0-9]{3}$`
- Max length: 63 characters (PostgreSQL limit)

### Crew Code Naming Pattern

**Format**: `{client_code}-{crew_type_short}-{sequence}`

**Examples**:
- `ACME-001-SUP-001` (first support crew for ACME-001)
- `ACME-001-SUP-002` (second support crew for ACME-001)
- `ACME-001-LEAD-001` (first lead gen crew for ACME-001)
- `TECHSTART-001-SUP-001` (first support crew for TECHSTART-001)

**Type Abbreviations**:
- `SUP` → customer_support
- `LEAD` → lead_generation

**Uniqueness**: Sequence number increments per client and crew type combination

**Use Cases**:
- n8n webhook integration (crew identification)
- External API references
- Audit logs and tracking
- Human-readable crew identification

**Properties**:
- Globally unique across all crews
- Includes client context for multi-tenant isolation
- Auto-generated (cannot be manually set)
- Immutable (cannot be changed after creation)

---

## Error Handling

### Common Errors

| Error | Status | Handling |
|-------|--------|----------|
| Client not found | 404 | Verify client exists before provisioning |
| Validation failed | 400 | Return Zod validation errors |
| Duplicate crew_code | 409 | Should never happen (auto-generated), but catch and retry with new sequence |
| Table already exists | 409 | Should never happen (uniqueness check), but catch and rollback |
| pgvector not installed | 500 | Check extension in migration, return helpful error |
| Transaction rollback | 500 | Log error, cleanup tables, return generic error |
| Crew not found | 404 | Return error before attempting deletion |
| Partial cleanup failure | 200 | Log errors, continue cleanup, return success with warning |

### Transaction Rollback

All provisioning/deprovisioning wrapped in database transactions:
- On error during provisioning → rollback crew insert, drop created tables
- On error during deprovisioning → log error, continue cleanup attempt
- Use try/catch with proper error logging

---

## Future Considerations

### Phase 2+ (Not in Current Scope)

1. **Lead Generation Crew Tables**: Define schemas when requirements are specified
2. **Conversation Model Migration**: Migrate UI from Conversation model to histories tables
3. **Authentication**: Implement Better-Auth with role-based access control
   - Super admins: Full access to all crews
   - Client admins: Access to their client's crews only
4. **Soft Delete**: Add `deleted_at` column for crew recovery
5. **Table Archival**: Move data to archive before deletion
6. **Usage Metrics**: Track storage, query count per crew
7. **Backup/Restore**: Crew-specific backup utilities
8. **Monitoring**: Orphaned table alerts, provisioning failure alerts

### Notes on Conversation Model

- Current: `Conversation` model in `types/index.ts` used by `/app/(dashboard)/conversations/page.tsx`
- Future: Migrate to use dynamic histories tables instead of mock `dummyConversations`
- This migration is NOT part of current implementation (focus on infrastructure first)

---

## Success Criteria

**Phase 1 - Database Foundation**:
- [x] pgvector extension enabled
- [x] Crews table created with proper schema
- [x] TypeScript types updated and compile
- [x] Migrations run successfully

**Phase 2 - Utilities**:
- [x] Crew codes generated uniquely
- [x] Table names generated uniquely
- [x] Vector and histories tables created
- [x] Provisioning/deprovisioning functions work
- [x] Orphaned table detection works

**Phase 3 - API Routes**:
- [x] All 5 endpoints implemented
- [x] Validation and error handling work
- [x] Dynamic tables created on POST
- [x] Tables cleaned up on DELETE

**Phase 4 - Seed Data**:
- [x] 5 sample crews seeded
- [x] Crew codes auto-generated for all crews
- [x] Dynamic tables created for support crews
- [x] Config JSONB populated correctly

**Phase 5 - Testing**:
- [x] All API endpoints tested
- [x] Edge cases handled
- [x] No orphaned tables
- [x] Concurrent operations work

**Overall**: Production-ready crew management system with:
- Auto-generated unique crew codes (e.g., ACME-001-SUP-001)
- Automatic table provisioning for customer support crews
- Multi-tenant isolation and n8n integration ready

---

## Estimated Timeline

- **Phase 1 (Database Foundation)**: 2-3 hours
- **Phase 2 (Utilities)**: 3-4 hours
- **Phase 3 (API Routes)**: 2-3 hours
- **Phase 4 (Seed Data)**: 1 hour
- **Phase 5 (Testing)**: 2 hours

**Total**: 10-13 hours of focused development

---

## Notes

- Only customer support crews get dynamic tables (Lead Gen TBD later)
- Uses `client_code` foreign key (matches existing mock data pattern)
- `crew_code` is auto-generated and immutable (format: {CLIENT_CODE}-{TYPE}-{SEQ})
- `crew_code` used for n8n integration and external references
- No authentication in this phase (add with Better-Auth later)
- histories_table infrastructure built now, Conversation model migration later
- All operations wrapped in transactions for data integrity
- Safety checks prevent SQL injection and accidental table drops
- Cleanup utilities prevent accumulation of orphaned tables
