# Conversation Loading System - Requirements

## Problem Statement

Conversations are currently loaded from mock data (`lib/dummy-data.ts`) instead of the dynamic histories tables that are created during crew provisioning. The histories tables exist in the database but there's no integration to query them, transform the data, and display it in the UI.

## User Requirements

### Core Functionality

1. **Data Source**: Load conversations from dynamic histories tables created during crew onboarding
2. **Message Format Transformation**: Convert n8n message format to application format
   - Input: `{"type": "human", "content": "...", "additional_kwargs": {}, "response_metadata": {}}`
   - Output: `{role: "user", content: "...", timestamp: Date}`
   - Mapping: `type: "human"` → `role: "user"`, `type: "ai"` → `role: "assistant"`

3. **Data Organization**: One row per message grouped by `session_id`
4. **Conversation Identification**: Use `session_id` as the unique conversation identifier

### Architecture Requirements

1. **Hybrid Architecture**:
   - Conversations table: Indexes sessions across ALL crew histories tables per client
   - Stores metadata: customer info, sentiment, duration, resolution status
   - Dynamic histories tables: Store actual message transcripts (one row per message)

2. **Multi-Crew Aggregation**:
   - For each client, query ALL their crews' histories tables
   - Aggregate conversations by `session_id`
   - Auto-discovery: Scan histories tables to find new conversations

3. **Replace Mock Data**: Completely remove mock data imports and use database queries

### Authorization Requirements

1. **Client Admins**:
   - Can ONLY see their organization's conversations
   - Filter by `clientId` automatically
   - Return 403 error if attempting to access other clients' data

2. **Super Admins**:
   - Can see ALL conversations across all clients
   - Can filter by specific client or view all

### Data Flow

1. **Discovery Process**:
   - When fetching conversations, first run discovery for the client
   - Scan ALL crew histories tables for new `session_id`s
   - Create conversation index records for newly discovered sessions
   - Calculate metadata (sentiment, duration, customer email)

2. **Query Process**:
   - Fetch conversation metadata from conversations table
   - For full transcript, lookup crew's `historiesTableName` from config
   - Query the specific histories table by `session_id`
   - Transform n8n messages to application format
   - Return combined data

## Technical Constraints

1. **Database**:
   - PostgreSQL with Drizzle ORM
   - Histories tables use JSONB for message storage
   - Table names follow pattern: `{client}_{type}_histories_{seq}`
   - SQL injection prevention via table name validation

2. **Performance**:
   - List views return metadata only (empty transcripts)
   - Full transcripts loaded only when viewing individual conversation
   - Lazy indexing: Conversations indexed on first access

3. **Error Handling**:
   - Crew has no `historiesTableName` → Return empty transcript
   - Histories table doesn't exist → Catch error, return empty transcript
   - Invalid table name → Validate with regex, throw error
   - Unauthorized access → Return 403 error

## Out of Scope

- Unit and E2E testing
- Webhook implementation (included as optional phase)
- Better Auth integration (will be added later, using query params for now)
- Real-time conversation updates
- Conversation deletion/archiving
- Message editing
- Conversation assignment/routing
- Analytics/reporting features
