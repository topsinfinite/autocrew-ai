# Conversation Loading System - Implementation Plan

## Overview

Implement a hybrid architecture that combines a conversations index table with dynamic histories tables to load and display conversation data from crew histories tables instead of mock data.

**Estimated Time**: ~5 hours

---

## Phase 1: Database Schema (30 min)

### Tasks

- [ ] Add sentiment enum to `db/schema.ts`
- [ ] Add conversations table schema with proper foreign keys and indexes
- [ ] Create Zod validation schemas for conversations
- [ ] Export TypeScript types (`ConversationRow`, `NewConversation`)
- [ ] Run migration generator: `npm run db:generate`
- [ ] Run migration: `npm run db:migrate`
- [ ] Verify schema in database

### File Changes

**File**: `db/schema.ts` (after line 100)

```typescript
// Add sentiment enum
export const sentimentEnum = pgEnum('sentiment', ['positive', 'neutral', 'negative']);

// Conversations table (indexes histories tables by sessionId)
export const conversations = pgTable(
  'conversations',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    sessionId: text('session_id').notNull().unique(),
    clientId: text('client_id').notNull().references(() => clients.clientCode, { onDelete: 'cascade' }),
    crewId: uuid('crew_id').notNull().references(() => crews.id, { onDelete: 'cascade' }),
    customerName: text('customer_name'),
    customerEmail: text('customer_email'),
    sentiment: sentimentEnum('sentiment'),
    resolved: boolean('resolved').default(false),
    duration: integer('duration'),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => ({
    sessionIdIdx: index('conversation_session_id_idx').on(table.sessionId),
    clientIdIdx: index('conversation_client_id_idx').on(table.clientId),
    crewIdIdx: index('conversation_crew_id_idx').on(table.crewId),
    createdAtIdx: index('conversation_created_at_idx').on(table.createdAt),
    sentimentIdx: index('conversation_sentiment_idx').on(table.sentiment),
  })
);
```

---

## Phase 2: Message Transformation Layer (45 min)

### Tasks

- [ ] Create `lib/utils/message-transformer.ts`
- [ ] Implement `transformN8nMessage()` function
- [ ] Implement `transformHistoriesToTranscript()` function
- [ ] Implement `calculateDuration()` function
- [ ] Implement `analyzeSentiment()` function (keyword-based)
- [ ] Implement `extractCustomerEmail()` function
- [ ] Add TypeScript interfaces for n8n message format

### File Changes

**New File**: `lib/utils/message-transformer.ts`

Key functions:
- Transform n8n format to `ConversationMessage`
- Aggregate messages by session into transcript
- Calculate conversation metadata (duration, sentiment)
- Extract customer information from transcript

---

## Phase 3: Database Query Layer (60 min)

### Tasks

- [ ] Create `lib/db/conversations.ts`
- [ ] Implement `getConversations()` - list with filtering
- [ ] Implement `getConversationById()` - single with full transcript
- [ ] Implement `getConversationsByClient()` - aggregate all client conversations
- [ ] Implement `queryHistoriesTable()` - query dynamic table
- [ ] Implement `discoverConversations()` - scan histories tables for new sessions
- [ ] Implement `getConversationsByCrew()` - filter by crew
- [ ] Add SQL injection prevention (table name validation)

### File Changes

**New File**: `lib/db/conversations.ts`

Key functions:
- Query conversations table for metadata
- Query dynamic histories tables for transcripts
- Auto-discovery of new conversations
- Multi-crew aggregation per client

---

## Phase 4: API Routes (45 min)

### Tasks

- [ ] Create `app/api/conversations/route.ts` with GET endpoint
- [ ] Add authorization checks (client admin vs super admin)
- [ ] Implement `discoverConversations()` call before query
- [ ] Create `app/api/conversations/[id]/route.ts` with GET endpoint
- [ ] Add authorization check for single conversation access
- [ ] Create `app/api/crews/[id]/conversations/route.ts` with GET endpoint
- [ ] Handle Next.js 15 async params pattern
- [ ] Add proper error responses (403, 404, 500)

### File Changes

**New Files**:
1. `app/api/conversations/route.ts`
2. `app/api/conversations/[id]/route.ts`
3. `app/api/crews/[id]/conversations/route.ts`

### Authorization Logic

**Client Admins**:
- Must provide `userClientId` (from auth context)
- Can ONLY query their own `clientId`
- Return 403 if attempting to access other clients

**Super Admins**:
- Can query any `clientId` or all conversations
- No filtering restrictions

---

## Phase 5: API Helper Layer (20 min)

### Tasks

- [ ] Create `lib/api/conversations.ts`
- [ ] Implement `getConversations()` client-side helper
- [ ] Implement `getConversationById()` client-side helper
- [ ] Add TODO comments for Better Auth integration
- [ ] Handle error responses properly

### File Changes

**New File**: `lib/api/conversations.ts`

Client-side API wrappers that will eventually integrate with Better Auth context.

---

## Phase 6: UI Updates (45 min)

### Tasks

- [ ] Update `app/(dashboard)/conversations/page.tsx`
  - [ ] Remove `dummyConversations` import
  - [ ] Add `getConversations` API import
  - [ ] Add loading state
  - [ ] Add error state
  - [ ] Fetch data in useEffect
  - [ ] Pass `selectedClient?.clientCode` to API
- [ ] Update `app/(dashboard)/dashboard/page.tsx`
  - [ ] Replace mock data with API call
  - [ ] Add loading/error states
  - [ ] Show recent conversations from API
- [ ] Update `app/(dashboard)/analytics/page.tsx` (if needed)
  - [ ] Replace mock data with API call

### File Changes

**Modified Files**:
1. `app/(dashboard)/conversations/page.tsx`
2. `app/(dashboard)/dashboard/page.tsx`

---

## Phase 7: Seed Data (30 min)

### Tasks

- [ ] Update `db/seed.ts` to import conversations table
- [ ] Add conversation seed data matching provisioned crews
- [ ] Insert conversation index records
- [ ] Insert matching messages into histories tables using `client.unsafe()`
- [ ] Use proper n8n message format in seed data
- [ ] Link conversations to correct `crewId` and `clientId`
- [ ] Run seed script: `npm run db:seed`
- [ ] Verify conversations table populated
- [ ] Verify histories tables have messages

### Seed Data Structure

```typescript
{
  sessionId: 'session_acme_001',
  clientId: 'ACME-001',
  crewId: provisionedCrews[0].crew.id,
  customerName: 'John Smith',
  customerEmail: 'john@example.com',
  sentiment: 'positive',
  resolved: true,
  duration: 300,
}
```

### Histories Table Messages

```sql
INSERT INTO {historiesTableName} (session_id, message, created_at) VALUES
  ($1, $2, NOW() - INTERVAL '5 minutes'),
  ($1, $3, NOW())
```

With n8n format:
```json
{
  "type": "human",
  "content": "Hello, I need help",
  "additional_kwargs": {},
  "response_metadata": {}
}
```

---

## Phase 8: Webhook Endpoint (Optional - 30 min)

### Tasks

- [ ] Create `app/api/webhooks/n8n/route.ts`
- [ ] Implement POST endpoint
- [ ] Validate required fields (crewId, sessionId, transcript)
- [ ] Fetch crew and verify existence
- [ ] Calculate metadata from transcript
- [ ] Insert conversation record
- [ ] Return conversation ID
- [ ] Add error handling

### File Changes

**New File**: `app/api/webhooks/n8n/route.ts`

For n8n to notify the app when new conversations are created.

---

## Testing Checklist

After implementation, verify:

### Database

- [ ] Migration runs successfully
- [ ] Conversations table exists with correct schema
- [ ] Foreign keys work (cascade delete)
- [ ] Indexes created properly

### Data Layer

- [ ] Can query conversations by clientId
- [ ] Can query conversations by crewId
- [ ] Can fetch single conversation with full transcript
- [ ] Dynamic histories table queries work correctly
- [ ] Message transformation handles n8n format properly
- [ ] Sentiment analysis produces valid values
- [ ] Duration calculation is accurate
- [ ] `discoverConversations()` finds new sessions

### API Routes

- [ ] GET `/api/conversations` returns filtered list
- [ ] GET `/api/conversations/:id` returns single conversation
- [ ] GET `/api/crews/:id/conversations` returns crew conversations
- [ ] Authorization: Client admins can ONLY see their conversations
- [ ] Authorization: Super admins can see ALL conversations
- [ ] Authorization: 403 errors for unauthorized access

### UI

- [ ] Conversations page loads from API (not mock data)
- [ ] Dashboard shows recent conversations from API
- [ ] Loading states display correctly
- [ ] Error states display correctly
- [ ] Empty states show when no conversations exist
- [ ] Multi-tenant filtering works correctly

### Edge Cases

- [ ] Crew with no `historiesTableName` returns empty transcript
- [ ] Non-existent histories table returns empty transcript
- [ ] Invalid table name throws validation error
- [ ] Client admin without clientId returns 403
- [ ] Cross-client access attempt returns 403

---

## Critical Files Summary

### New Files (8)

1. `lib/utils/message-transformer.ts` - n8n message transformation
2. `lib/db/conversations.ts` - Database query layer
3. `app/api/conversations/route.ts` - List conversations API
4. `app/api/conversations/[id]/route.ts` - Get conversation API
5. `app/api/crews/[id]/conversations/route.ts` - Crew conversations API
6. `lib/api/conversations.ts` - Client-side helpers
7. `app/api/webhooks/n8n/route.ts` - Webhook endpoint (optional)
8. `/specs/features/conversation-loading-system/` - This spec folder

### Modified Files (4)

1. `db/schema.ts` - Add conversations table
2. `app/(dashboard)/conversations/page.tsx` - Use API instead of mock
3. `app/(dashboard)/dashboard/page.tsx` - Use API instead of mock
4. `db/seed.ts` - Add conversation seed data

---

## Key Architecture Points

1. **Conversations table = Index**: Stores metadata and points to which crew's histories table contains each session
2. **Multi-crew aggregation**: `discoverConversations()` scans ALL crew histories tables for a client
3. **Auto-discovery**: When fetching conversations, first discover new sessions from histories tables
4. **session_id as ID**: Each unique session_id represents one conversation
5. **Lazy indexing**: Conversations are indexed when first accessed, not immediately when created
6. **Access Control**: Client admins restricted to their clientId, super admins unrestricted

---

## Future Enhancements

After this implementation:

- [ ] Integrate with Better Auth for proper session-based authorization
- [ ] Add conversation update/delete endpoints
- [ ] Implement conversation resolution workflow
- [ ] Add conversation search/filtering UI
- [ ] Add pagination for large conversation lists
- [ ] Add real-time updates via WebSockets
- [ ] Replace keyword-based sentiment with AI analysis
- [ ] Add conversation assignment/routing
- [ ] Add conversation analytics dashboard
