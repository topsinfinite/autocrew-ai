import { db, client } from '@/db';
import { conversations, crews } from '@/db/schema';
import { eq, and, desc, gte, lte } from 'drizzle-orm';
import { logger } from '@/lib/utils';
import type { Conversation, ConversationMessage } from '@/types';
import {
  transformHistoriesToTranscript,
  analyzeSentiment,
  calculateDuration,
  extractCustomerEmail,
} from '@/lib/utils';

export interface GetConversationsParams {
  clientId?: string;
  crewId?: string;
  sentiment?: 'positive' | 'neutral' | 'negative';
  resolved?: boolean;
  fromDate?: Date;
  toDate?: Date;
  limit?: number;
  offset?: number;
}

/**
 * Get conversations (metadata only, no transcripts)
 */
export async function getConversations(
  params: GetConversationsParams = {}
): Promise<Conversation[]> {
  const {
    clientId,
    crewId,
    sentiment,
    resolved,
    fromDate,
    toDate,
    limit = 50,
    offset = 0,
  } = params;

  const conditions = [];
  if (clientId) conditions.push(eq(conversations.clientId, clientId));
  if (crewId) conditions.push(eq(conversations.crewId, crewId));
  if (sentiment) conditions.push(eq(conversations.sentiment, sentiment));
  if (resolved !== undefined) conditions.push(eq(conversations.resolved, resolved));
  if (fromDate) conditions.push(gte(conversations.createdAt, fromDate));
  if (toDate) conditions.push(lte(conversations.createdAt, toDate));

  const query = db
    .select()
    .from(conversations)
    .where(conditions.length > 0 ? and(...conditions) : undefined)
    .orderBy(desc(conversations.createdAt))
    .limit(limit)
    .offset(offset);

  const rows = await query;

  // Return with empty transcripts (for list view performance)
  return rows.map((row) => ({
    id: row.id,
    clientId: row.clientId,
    crewId: row.crewId,
    userId: '', // Deprecated field
    transcript: [],
    metadata: {
      customerName: row.customerName || undefined,
      customerEmail: row.customerEmail || undefined,
      sentiment: row.sentiment || undefined,
      resolved: row.resolved || false,
      duration: row.duration || undefined,
    },
    createdAt: row.createdAt,
  }));
}

/**
 * Get single conversation with full transcript
 * Uses the conversation record to find which histories table to query
 */
export async function getConversationById(id: string): Promise<Conversation | null> {
  // Step 1: Get conversation metadata
  const [conv] = await db
    .select()
    .from(conversations)
    .where(eq(conversations.id, id))
    .limit(1);

  if (!conv) return null;

  // Step 2: Get crew to find histories table name
  const [crew] = await db
    .select()
    .from(crews)
    .where(eq(crews.id, conv.crewId))
    .limit(1);

  if (!crew) return null;

  const config = crew.config as { historiesTableName?: string };
  const tableName = config.historiesTableName;

  // Step 3: Query the specific histories table for this conversation's transcript
  const transcript = tableName
    ? await queryHistoriesTable(tableName, conv.sessionId)
    : [];

  return {
    id: conv.id,
    clientId: conv.clientId,
    crewId: conv.crewId,
    userId: '',
    transcript,
    metadata: {
      customerName: conv.customerName || undefined,
      customerEmail: conv.customerEmail || undefined,
      sentiment: conv.sentiment || undefined,
      resolved: conv.resolved || false,
      duration: conv.duration || undefined,
    },
    createdAt: conv.createdAt,
  };
}

/**
 * Get all unique conversations for a client by querying ALL crew histories tables
 * This aggregates conversations across all crews for the client
 */
export async function getConversationsByClient(clientId: string): Promise<Conversation[]> {
  // Step 1: Get all crews for this client
  const clientCrews = await db
    .select()
    .from(crews)
    .where(eq(crews.clientId, clientId));

  if (clientCrews.length === 0) return [];

  // Step 2: Get all existing conversation records for this client
  const existingConversations = await db
    .select()
    .from(conversations)
    .where(eq(conversations.clientId, clientId))
    .orderBy(desc(conversations.createdAt));

  return existingConversations.map((row) => ({
    id: row.id,
    clientId: row.clientId,
    crewId: row.crewId,
    userId: '',
    transcript: [], // Empty for list view
    metadata: {
      customerName: row.customerName || undefined,
      customerEmail: row.customerEmail || undefined,
      sentiment: row.sentiment || undefined,
      resolved: row.resolved || false,
      duration: row.duration || undefined,
    },
    createdAt: row.createdAt,
  }));
}

/**
 * Query dynamic histories table
 */
async function queryHistoriesTable(
  tableName: string,
  sessionId: string
): Promise<ConversationMessage[]> {
  try {
    // Validate table name (prevent SQL injection)
    if (!/^[a-z0-9_]+$/.test(tableName)) {
      throw new Error(`Invalid table name: ${tableName}`);
    }

    await logger.info('Querying histories table', {
      tableName,
      sessionId,
      operation: 'query_histories_table',
    });

    const result = await client.unsafe(
      `SELECT id, session_id, message, created_at
       FROM ${tableName}
       WHERE session_id = $1
       ORDER BY created_at ASC`,
      [sessionId]
    );

    await logger.info('Histories table query result', {
      tableName,
      sessionId,
      rowCount: result.length,
      operation: 'query_histories_table',
    });

    if (result.length === 0) {
      await logger.warn('No messages found in histories table', {
        tableName,
        sessionId,
        operation: 'query_histories_table',
      });
      return [];
    }

    const transcript = transformHistoriesToTranscript(result as any);
    await logger.info('Transcript transformed successfully', {
      tableName,
      sessionId,
      messageCount: transcript.length,
      operation: 'query_histories_table',
    });

    return transcript;
  } catch (error) {
    await logger.error('Failed to query histories table', {
      tableName,
      sessionId,
      operation: 'query_histories_table',
    }, error);
    return [];
  }
}

/**
 * Get conversations for a crew
 */
export async function getConversationsByCrew(crewId: string): Promise<Conversation[]> {
  return getConversations({ crewId });
}

/**
 * Scan ALL histories tables for a client and discover new conversations
 * Creates conversation records for any session_ids not yet indexed
 * This should be called periodically or when viewing conversations
 */
export async function discoverConversations(clientId: string): Promise<void> {
  await logger.info('Starting conversation discovery for client', {
    clientId,
    operation: 'discover_conversations',
  });

  // Get all crews for this client
  const clientCrews = await db
    .select()
    .from(crews)
    .where(eq(crews.clientId, clientId));

  await logger.info('Crews fetched for discovery', {
    clientId,
    crewCount: clientCrews.length,
    operation: 'discover_conversations',
  });

  // Get existing conversation session_ids (query globally since session_id is unique across all clients)
  const existing = await db
    .select({ sessionId: conversations.sessionId })
    .from(conversations);

  const existingSessionIds = new Set(existing.map((e) => e.sessionId));
  await logger.info('Existing sessions loaded', {
    clientId,
    globalSessionCount: existingSessionIds.size,
    operation: 'discover_conversations',
  });

  // Also get client-specific count for logging
  const clientConversations = await db
    .select({ sessionId: conversations.sessionId })
    .from(conversations)
    .where(eq(conversations.clientId, clientId));
  await logger.info('Client-specific conversations loaded', {
    clientId,
    clientConversationCount: clientConversations.length,
    operation: 'discover_conversations',
  });

  // Scan each crew's histories table for new sessions
  for (const crew of clientCrews) {
    const config = crew.config as { historiesTableName?: string };
    if (!config.historiesTableName) {
      await logger.info('Crew has no histories table - skipping', {
        crewId: crew.id,
        crewCode: crew.crewCode,
        clientId,
        operation: 'discover_conversations',
      });
      continue;
    }

    await logger.info('Scanning histories table for crew', {
      crewId: crew.id,
      crewCode: crew.crewCode,
      historiesTableName: config.historiesTableName,
      clientId,
      operation: 'discover_conversations',
    });

    try {
      // Validate table name
      if (!/^[a-z0-9_]+$/.test(config.historiesTableName)) {
        await logger.error('Invalid histories table name detected', {
          historiesTableName: config.historiesTableName,
          crewId: crew.id,
          crewCode: crew.crewCode,
          clientId,
          operation: 'discover_conversations',
        });
        continue;
      }

      // Get all unique session_ids from this histories table
      const sessions = await client.unsafe(
        `SELECT DISTINCT session_id FROM ${config.historiesTableName}`
      );

      await logger.info('Sessions found in histories table', {
        sessionCount: sessions.length,
        historiesTableName: config.historiesTableName,
        crewId: crew.id,
        crewCode: crew.crewCode,
        clientId,
        operation: 'discover_conversations',
      });

      let newConversationsCount = 0;

      // Create conversation records for new sessions
      for (const { session_id } of sessions as any[]) {
        if (existingSessionIds.has(session_id)) {
          await logger.info('Session already exists - skipping', {
            sessionId: session_id,
            crewId: crew.id,
            clientId,
            operation: 'discover_conversations',
          });
          continue;
        }

        await logger.info('New session discovered - fetching transcript', {
          sessionId: session_id,
          crewId: crew.id,
          historiesTableName: config.historiesTableName,
          clientId,
          operation: 'discover_conversations',
        });

        // Fetch transcript to calculate metadata
        const transcript = await queryHistoriesTable(
          config.historiesTableName,
          session_id
        );

        if (transcript.length === 0) {
          await logger.warn('No transcript found for session - skipping', {
            sessionId: session_id,
            crewId: crew.id,
            clientId,
            operation: 'discover_conversations',
          });
          continue;
        }

        await logger.info('Creating conversation record for session', {
          sessionId: session_id,
          messageCount: transcript.length,
          crewId: crew.id,
          clientId,
          operation: 'discover_conversations',
        });

        // Calculate metadata
        const sentiment = analyzeSentiment(transcript);
        const duration = calculateDuration(transcript);
        const customerEmail = extractCustomerEmail(transcript);

        // Create conversation record (with duplicate handling)
        try {
          await db.insert(conversations).values({
            sessionId: session_id,
            clientId,
            crewId: crew.id,
            customerEmail,
            sentiment,
            duration,
            resolved: false,
          });

          newConversationsCount++;
          existingSessionIds.add(session_id);
          await logger.info('Conversation record created successfully', {
            sessionId: session_id,
            crewId: crew.id,
            clientId,
            operation: 'discover_conversations',
          });
        } catch (insertError: any) {
          // Handle duplicate session_id gracefully (unique constraint violation)
          if (insertError?.cause?.code === '23505') {
            await logger.info('Duplicate session detected during insert - skipping', {
              sessionId: session_id,
              crewId: crew.id,
              clientId,
              operation: 'discover_conversations',
            });
            existingSessionIds.add(session_id);
            continue;
          }
          // Re-throw other errors
          throw insertError;
        }
      }

      await logger.info('Completed crew history table scan', {
        historiesTableName: config.historiesTableName,
        crewId: crew.id,
        crewCode: crew.crewCode,
        newConversationsCount,
        clientId,
        operation: 'discover_conversations',
      });
    } catch (error) {
      await logger.error('Failed to scan crew history table', {
        historiesTableName: config.historiesTableName,
        crewId: crew.id,
        crewCode: crew.crewCode,
        clientId,
        operation: 'discover_conversations',
      }, error);
    }
  }

  await logger.info('Conversation discovery completed for client', {
    clientId,
    operation: 'discover_conversations',
  });
}
