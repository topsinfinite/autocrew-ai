# Optimized Conversation Discovery System

**Status**: Proposed
**Priority**: High
**Created**: 2025-01-08
**Complexity**: Medium
**Configurable**: ✅ Yes (via environment variables)

## Quick Start

```bash
# .env.local configuration
CONVERSATION_DISCOVERY_CRON=*/5 * * * *  # Every 5 minutes (default)
ENABLE_BACKGROUND_JOBS=true              # Enable discovery (default: true)
```

**Common Schedules**:
- `*/2 * * * *` - Every 2 minutes (high traffic)
- `*/5 * * * *` - Every 5 minutes (default)
- `*/15 * * * *` - Every 15 minutes (medium traffic)
- `0 * * * *` - Every hour (low traffic)

---

## Problem Statement

The current conversation discovery system has severe performance issues at scale:

### Current Issues

1. **Full Table Scans on Every Request**
   ```sql
   -- Runs on EVERY /conversations page load
   SELECT DISTINCT session_id FROM {histories_table}
   -- At 10,000 conversations: 3-5 seconds
   ```

2. **Synchronous Discovery Blocking User Requests**
   - User must wait for discovery to complete before page loads
   - No timeout protection
   - Can cause 5-10+ second page loads

3. **No Incremental Processing**
   - Always scans entire history, even old processed sessions
   - No tracking of last discovery timestamp
   - Wasted computation on already-indexed conversations

4. **Inefficient Per-Session Queries**
   - Fetches entire transcript for metadata calculation
   - Multiple round trips to database
   - O(n) queries for n new sessions

### Impact at Scale

| Conversations | Current Latency | User Experience |
|--------------|----------------|-----------------|
| 100 | ~200ms | Acceptable |
| 1,000 | ~2s | Slow |
| 10,000 | ~5-8s | Unacceptable |
| 100,000+ | ~30s+ | Timeout/Crash |

---

## Proposed Solution: Multi-Strategy Optimization

### Strategy 1: Incremental Discovery (Timestamp-Based)

**Before (Full Scan)**:
```sql
SELECT DISTINCT session_id FROM histories_table
-- Scans ALL rows every time
```

**After (Incremental)**:
```sql
SELECT DISTINCT session_id
FROM histories_table
WHERE created_at > $1  -- Last discovery timestamp
-- Only scans NEW rows (uses created_at index)
```

**Performance Improvement**: 100x faster at scale
- 10,000 total conversations, 10 new → 100ms instead of 5s

---

### Strategy 2: Efficient Metadata Queries

**Before (Fetch Everything)**:
```sql
-- Fetches all messages for sentiment analysis
SELECT * FROM histories WHERE session_id = $1
-- Then processes in memory
```

**After (Aggregates First)**:
```sql
-- Get metadata with single efficient query
SELECT
  COUNT(*) as message_count,
  MIN(created_at) as first_at,
  MAX(created_at) as last_at
FROM histories
WHERE session_id = $1
-- Duration calculated without fetching all messages
```

**Performance Improvement**: 50x less data transferred
- Only fetch full transcript for NEW sessions, not all sessions

---

### Strategy 3: Background Processing

**Before (Synchronous)**:
```
User Request → Discovery (5s) → Render Page
Total: 5+ seconds
```

**After (Async)**:
```
User Request → Return Cached Data (50ms)
Background Job → Discovery → Update Cache
Total for user: 50ms
```

---

## Configuration

### Environment Variables

Add to `.env.local`:

```bash
# Background Job Configuration
# Conversation discovery cron schedule (cron syntax)
# Examples:
#   */5 * * * *  - Every 5 minutes (default)
#   */10 * * * * - Every 10 minutes
#   0 * * * *    - Every hour
#   0 */2 * * *  - Every 2 hours
#   0 0 * * *    - Daily at midnight
# Format: minute hour day month weekday
CONVERSATION_DISCOVERY_CRON=*/5 * * * *

# Enable/disable background jobs
# Set to 'false' to disable background discovery (useful for development)
ENABLE_BACKGROUND_JOBS=true
```

### Cron Schedule Syntax

Format: `minute hour day month weekday`

| Field | Values | Special Characters |
|-------|--------|-------------------|
| Minute | 0-59 | `*` `/` `,` `-` |
| Hour | 0-23 | `*` `/` `,` `-` |
| Day of Month | 1-31 | `*` `/` `,` `-` |
| Month | 1-12 | `*` `/` `,` `-` |
| Day of Week | 0-6 (Sun-Sat) | `*` `/` `,` `-` |

**Common Examples**:

| Schedule | Cron Expression | Use Case |
|----------|----------------|----------|
| Every 5 minutes | `*/5 * * * *` | High-traffic apps (default) |
| Every 15 minutes | `*/15 * * * *` | Medium-traffic apps |
| Every hour | `0 * * * *` | Low-traffic apps |
| Every 2 hours | `0 */2 * * *` | Very low traffic |
| Every day at 2am | `0 2 * * *` | Nightly batch processing |
| Business hours only | `0 9-17 * * 1-5` | M-F 9am-5pm |

### Configuration by Environment

**Development**:
```bash
ENABLE_BACKGROUND_JOBS=false  # Don't run in dev
```

**Staging**:
```bash
CONVERSATION_DISCOVERY_CRON=*/15 * * * *  # Every 15 min
ENABLE_BACKGROUND_JOBS=true
```

**Production**:
```bash
CONVERSATION_DISCOVERY_CRON=*/5 * * * *  # Every 5 min
ENABLE_BACKGROUND_JOBS=true
```

**High Volume Production**:
```bash
CONVERSATION_DISCOVERY_CRON=*/2 * * * *  # Every 2 min (real-time feel)
ENABLE_BACKGROUND_JOBS=true
```

---

## Architecture Design

### Components

```
┌─────────────────────────────────────────────────────┐
│                  User Request Layer                  │
│  GET /conversations → Fast response (cached data)    │
└──────────────────┬──────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────┐
│              Conversation Service                    │
│  - getConversations() → Returns existing records     │
│  - triggerDiscovery() → Kicks off background job     │
└──────────────────┬──────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────┐
│           Background Discovery Worker                │
│  - Runs every 5 minutes (cron)                       │
│  - Incremental discovery per client                  │
│  - Batch processing (50 sessions at a time)          │
└──────────────────┬──────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────┐
│         Optimized Discovery Engine                   │
│  - Timestamp-based incremental scanning              │
│  - Efficient metadata aggregation                    │
│  - Graceful duplicate handling                       │
└─────────────────────────────────────────────────────┘
```

---

## Implementation Plan

### Phase 1: Foundation (Low Risk)

**Goal**: Add optimized discovery function alongside existing one

**Files to Create**:
- ✅ `lib/db/optimized-conversation-discovery.ts` (already created)

**Key Functions**:
```typescript
// Main entry point (optimized)
discoverConversationsOptimized(clientId: string)

// Per-crew discovery (incremental)
discoverCrewConversationsOptimized(
  crewId: string,
  historiesTableName: string,
  clientId: string
)

// Efficient helpers
getCrewDiscoveryState(crewId: string)
discoverNewSessionsIncremental(table: string, lastCheck: Date)
getSessionMetadataEfficient(table: string, sessionId: string)
```

**Database Changes**: None (uses existing indexes)

**Timeline**: Already implemented ✅

---

### Phase 2: Background Job Infrastructure

**Goal**: Move discovery off the request path

**Files to Create**:
```
lib/jobs/
├── conversation-discovery-job.ts    # Background job implementation
├── job-scheduler.ts                 # Cron scheduler
└── job-queue.ts                     # Simple in-memory queue
```

**Implementation**:

1. **Create Background Job**:
```typescript
// lib/jobs/conversation-discovery-job.ts
import { discoverConversationsOptimized } from '@/lib/db/optimized-conversation-discovery';

export async function runConversationDiscoveryJob() {
  console.log('[Job] Starting conversation discovery...');

  // Get all active clients
  const clients = await db.select().from(clients);

  for (const client of clients) {
    try {
      await discoverConversationsOptimized(client.clientCode);
    } catch (error) {
      console.error(`[Job] Failed for client ${client.clientCode}:`, error);
      // Continue with other clients
    }
  }

  console.log('[Job] Conversation discovery completed');
}
```

2. **Add Cron Scheduler** (using `node-cron` or Vercel Cron):
```typescript
// lib/jobs/job-scheduler.ts
import cron from 'node-cron';
import { runConversationDiscoveryJob } from './conversation-discovery-job';

/**
 * Configurable cron schedule via environment variable
 * Default: Every 5 minutes (*/5 * * * *)
 *
 * Environment Variables:
 * - CONVERSATION_DISCOVERY_CRON: Cron schedule (default: */5 * * * *)
 * - ENABLE_BACKGROUND_JOBS: Enable/disable jobs (default: true)
 */
export function startJobScheduler() {
  // Check if background jobs are enabled
  const enableJobs = process.env.ENABLE_BACKGROUND_JOBS !== 'false';
  if (!enableJobs) {
    console.log('[Scheduler] Background jobs disabled via ENABLE_BACKGROUND_JOBS');
    return;
  }

  // Get cron schedule from environment or use default (every 5 minutes)
  const cronSchedule = process.env.CONVERSATION_DISCOVERY_CRON || '*/5 * * * *';

  // Validate cron expression
  if (!cron.validate(cronSchedule)) {
    console.error(
      `[Scheduler] Invalid cron schedule: ${cronSchedule}`,
      'Using default: */5 * * * *'
    );
    cronSchedule = '*/5 * * * *';
  }

  // Schedule the job
  cron.schedule(cronSchedule, async () => {
    console.log('[Scheduler] Running conversation discovery job');
    await runConversationDiscoveryJob();
  });

  console.log(`[Scheduler] Conversation discovery scheduled: ${cronSchedule}`);
  console.log('[Scheduler] Next run:', getNextRunTime(cronSchedule));
}

/**
 * Helper to display when the job will run next
 */
function getNextRunTime(cronSchedule: string): string {
  const schedule = cron.getTasks().values().next().value;
  // Simple formatting - in production use a cron parser library
  return 'Check logs for actual run time';
}
```

3. **Initialize in app startup**:
```typescript
// app/layout.tsx or middleware.ts
import { startJobScheduler } from '@/lib/jobs/job-scheduler';

if (process.env.NODE_ENV === 'production') {
  startJobScheduler();
}
```

**Timeline**: 2-3 hours

---

### Phase 3: Migration & Testing

**Goal**: Safely migrate from old to new system

**Migration Strategy**:

1. **Run Both Systems in Parallel** (1 week):
   - Keep old discovery in API route
   - Add new background job
   - Compare results, ensure consistency

2. **Add Feature Flag**:
```typescript
// app/api/conversations/route.ts
const USE_OPTIMIZED_DISCOVERY = process.env.USE_OPTIMIZED_DISCOVERY === 'true';

if (USE_OPTIMIZED_DISCOVERY) {
  // Don't run discovery on request
  // Return existing conversations immediately
} else {
  // Old behavior: run discovery synchronously
  await discoverConversations(clientId);
}
```

3. **Gradual Rollout**:
   - Week 1: Test with internal clients
   - Week 2: Enable for 25% of clients
   - Week 3: Enable for 75% of clients
   - Week 4: Enable for all clients, remove old code

**Testing Checklist**:
- [ ] Verify new conversations are discovered
- [ ] Check discovery runs every 5 minutes
- [ ] Confirm no duplicate conversations
- [ ] Test with 0, 100, 1000, 10000 conversations
- [ ] Monitor memory usage during discovery
- [ ] Verify page load times improve
- [ ] Test error handling (table doesn't exist, etc.)

**Timeline**: 1 week

---

### Phase 4: Advanced Optimizations (Optional)

**Goal**: Further improvements for massive scale

**Optimization 4A: Database Materialized View**
```sql
-- Pre-compute conversation summaries
CREATE MATERIALIZED VIEW conversation_summaries AS
SELECT
  session_id,
  COUNT(*) as message_count,
  MIN(created_at) as started_at,
  MAX(created_at) as ended_at
FROM histories_table
GROUP BY session_id;

-- Refresh incrementally
REFRESH MATERIALIZED VIEW CONCURRENTLY conversation_summaries;
```

**Optimization 4B: Redis Cache Layer**
```typescript
// Cache discovery results for 5 minutes
const cacheKey = `conversations:${clientId}`;
const cached = await redis.get(cacheKey);
if (cached) return JSON.parse(cached);

const conversations = await getConversations({clientId});
await redis.setex(cacheKey, 300, JSON.stringify(conversations));
```

**Optimization 4C: Webhook-Based Discovery**

Instead of polling, have n8n notify us when conversation completes:

```typescript
// app/api/webhooks/conversation-complete/route.ts
export async function POST(request: NextRequest) {
  const { session_id, crew_code } = await request.json();

  // Immediately index this specific conversation
  await discoverSingleConversation(crew_code, session_id);

  return NextResponse.json({ success: true });
}
```

**Timeline**: 1-2 weeks (if needed)

---

## Performance Benchmarks (Expected)

| Scenario | Current | Optimized | Improvement |
|----------|---------|-----------|-------------|
| **Page Load (100 conversations)** | 200ms | 50ms | 4x faster |
| **Page Load (1,000 conversations)** | 2s | 50ms | 40x faster |
| **Page Load (10,000 conversations)** | 8s | 50ms | 160x faster |
| **Discovery (100 new)** | 2s | 200ms | 10x faster |
| **Discovery (10 new in 10,000 total)** | 8s | 100ms | 80x faster |

---

## Database Schema Changes

### Option A: No Schema Changes (Recommended for Phase 1-3)

Use existing data structures:
- Existing `created_at` index on histories tables ✅
- Existing `conversations` table ✅
- Track discovery state via `MAX(conversations.created_at)` ✅

### Option B: Add Discovery Tracking Table (Phase 4)

```sql
-- Track last discovery timestamp per crew
CREATE TABLE crew_discovery_state (
  crew_id UUID PRIMARY KEY REFERENCES crews(id),
  histories_table_name TEXT NOT NULL,
  last_discovered_at TIMESTAMP WITH TIME ZONE,
  last_session_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**Benefits**:
- Explicit tracking of discovery state
- Can query discovery health/status
- Easier debugging

**Trade-off**: Extra table to maintain

---

## Rollback Plan

If optimized discovery causes issues:

1. **Immediate**: Set `USE_OPTIMIZED_DISCOVERY=false`
2. **Fallback**: Old discovery function remains in codebase
3. **Data**: No schema changes, no migration needed
4. **Recovery Time**: < 1 minute (environment variable change)

---

## Monitoring & Observability

### Metrics to Track

```typescript
// lib/monitoring/discovery-metrics.ts
export const discoveryMetrics = {
  // Performance
  discoveryDurationMs: 0,
  sessionsScanned: 0,
  conversationsCreated: 0,

  // Health
  lastRunAt: new Date(),
  consecutiveFailures: 0,
  errorRate: 0,

  // Business
  totalConversations: 0,
  averageSessionsPerClient: 0,
};
```

### Alerts

- Discovery job hasn't run in 10 minutes
- Discovery taking > 30 seconds
- Error rate > 5%
- Consecutive failures > 3

---

## Security Considerations

1. **SQL Injection Prevention**: ✅ Already validated
   - Table name regex: `/^[a-z0-9_]+$/`
   - Parameterized queries

2. **Rate Limiting**:
   - Background job runs max every 5 minutes
   - Per-client processing limits

3. **Resource Limits**:
   - Batch size: 50 sessions per batch
   - Timeout: 30 seconds per crew
   - Memory: Stream results, don't load all in memory

---

## Success Criteria

### Phase 1 (Optimized Function)
- ✅ Function created
- ✅ Uses incremental scanning
- ✅ Graceful duplicate handling
- ✅ Comprehensive logging

### Phase 2 (Background Jobs)
- [ ] Discovery runs every 5 minutes
- [ ] No blocking user requests
- [ ] Page loads < 200ms consistently

### Phase 3 (Migration)
- [ ] Zero data loss during migration
- [ ] No duplicate conversations
- [ ] Page load time improved by 80%+
- [ ] Old code removed

### Phase 4 (Advanced - Optional)
- [ ] Redis caching active
- [ ] Webhook notifications working
- [ ] Handles 100,000+ conversations efficiently

---

## Dependencies

### Required Packages (Phase 2)

```json
{
  "dependencies": {
    "node-cron": "^3.0.3"  // For background job scheduling
  },
  "devDependencies": {
    "@types/node-cron": "^3.0.11"
  }
}
```

### Optional Packages (Phase 4)

```json
{
  "dependencies": {
    "ioredis": "^5.3.2",     // Redis client for caching
    "@vercel/kv": "^1.0.1"   // Vercel KV (Redis alternative)
  }
}
```

---

## File Structure (After Implementation)

```
lib/
├── db/
│   ├── conversations.ts                    # Original (deprecated)
│   ├── optimized-conversation-discovery.ts # New optimized version ✅
│   └── conversation-service.ts             # High-level API
├── jobs/
│   ├── conversation-discovery-job.ts       # Background worker
│   ├── job-scheduler.ts                    # Cron setup
│   └── job-queue.ts                        # Queue management
└── monitoring/
    └── discovery-metrics.ts                # Metrics & observability

app/api/
├── conversations/
│   └── route.ts                            # Updated to use optimized
└── webhooks/
    └── conversation-complete/
        └── route.ts                        # n8n webhook handler

specs/features/
└── optimized-conversation-discovery.md     # This document
```

---

## Timeline Summary

| Phase | Duration | Risk | Impact |
|-------|----------|------|--------|
| Phase 1: Optimized Function | ✅ Done | Low | Foundation |
| Phase 2: Background Jobs | 2-3 hours | Low | Major perf gain |
| Phase 3: Migration | 1 week | Medium | Production-ready |
| Phase 4: Advanced (Optional) | 1-2 weeks | Low | Ultra scale |

**Total Estimated Time**: 1-2 weeks for production-ready system

---

## Quick Configuration Reference

### Change Discovery Frequency

Edit `.env.local`:

```bash
# More frequent (every 2 minutes)
CONVERSATION_DISCOVERY_CRON=*/2 * * * *

# Less frequent (every 30 minutes)
CONVERSATION_DISCOVERY_CRON=*/30 * * * *

# Hourly
CONVERSATION_DISCOVERY_CRON=0 * * * *
```

Restart the server for changes to take effect.

### Temporarily Disable Discovery

```bash
# In .env.local
ENABLE_BACKGROUND_JOBS=false
```

Or set environment variable:
```bash
ENABLE_BACKGROUND_JOBS=false npm run dev
```

### Trigger Manual Discovery

For testing or one-off runs:

```typescript
// In server console or API endpoint
import { discoverConversationsOptimized } from '@/lib/db/optimized-conversation-discovery';

// Run discovery for a specific client
await discoverConversationsOptimized('ACME-001');
```

### Monitor Job Status

Check server logs for:
```
[Scheduler] Conversation discovery scheduled: */5 * * * *
[Scheduler] Running conversation discovery job
[Discovery Optimized] Starting for client ACME-001
[Discovery Optimized] Completed: 5 new, 0 skipped, 0 errors
```

---

## Troubleshooting

### Jobs Not Running

**Problem**: No log output showing job execution

**Solutions**:
1. Check `ENABLE_BACKGROUND_JOBS=true` in `.env.local`
2. Verify cron syntax: `*/5 * * * *` (valid)
3. Check server logs for `[Scheduler]` messages
4. Ensure `startJobScheduler()` is called in app initialization

### Invalid Cron Schedule

**Problem**: Error: `Invalid cron schedule`

**Solution**: Use cron validator or these common patterns:
- Every N minutes: `*/N * * * *`
- Specific minute: `N * * * *`
- Multiple times: `0,15,30,45 * * * *`

### Performance Issues

**Problem**: Discovery taking too long

**Solutions**:
1. Increase schedule interval (less frequent)
2. Check number of conversations per client
3. Review database query performance
4. Consider Phase 4 optimizations (Redis caching)

---

## Next Steps

1. **Review this plan** with team
2. **Approve Phase 2** implementation
3. **Configure environment**: Set cron schedule in `.env.local`
4. **Install dependencies**: `npm install node-cron @types/node-cron`
5. **Implement background job** (2-3 hours)
6. **Test in staging** (1-2 days)
7. **Gradual rollout** (1 week)

---

## References

- Current implementation: `lib/db/conversations.ts`
- Optimized implementation: `lib/db/optimized-conversation-discovery.ts` ✅
- Database schema: `db/schema.ts`
- Message transformer: `lib/utils/message-transformer.ts`

---

**Last Updated**: 2025-01-08
**Status**: Ready for Phase 2 Implementation
