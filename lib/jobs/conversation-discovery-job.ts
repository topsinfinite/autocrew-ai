import { discoverConversationsOptimized } from '@/lib/db/optimized-conversation-discovery';
import { db } from '@/db';
import { clients } from '@/db/schema';

/**
 * Background job for conversation discovery
 *
 * Runs periodically to discover new conversations from n8n history tables
 * for all active clients in the system.
 *
 * Performance Benefits:
 * - Runs asynchronously, not blocking user requests
 * - Uses optimized incremental discovery (timestamp-based)
 * - Processes all clients sequentially with error isolation
 *
 * Configuration:
 * - Frequency: Controlled by CONVERSATION_DISCOVERY_CRON in .env.local
 * - Enable/Disable: Controlled by ENABLE_BACKGROUND_JOBS in .env.local
 */

interface DiscoveryJobResult {
  startedAt: Date;
  completedAt: Date;
  durationMs: number;
  clientsProcessed: number;
  clientsFailed: number;
  totalNewConversations: number;
  totalSkippedConversations: number;
  totalErrors: number;
}

/**
 * Main background job function
 * Discovers new conversations for all active clients
 */
export async function runConversationDiscoveryJob(): Promise<DiscoveryJobResult> {
  const startedAt = new Date();
  console.log('[Discovery Job] Starting conversation discovery...', { startedAt });

  let clientsProcessed = 0;
  let clientsFailed = 0;
  let totalNewConversations = 0;
  let totalSkippedConversations = 0;
  let totalErrors = 0;

  try {
    // Get all active clients
    const allClients = await db.select().from(clients);
    console.log(`[Discovery Job] Found ${allClients.length} clients to process`);

    if (allClients.length === 0) {
      console.log('[Discovery Job] No clients found, skipping discovery');
      const completedAt = new Date();
      return {
        startedAt,
        completedAt,
        durationMs: completedAt.getTime() - startedAt.getTime(),
        clientsProcessed: 0,
        clientsFailed: 0,
        totalNewConversations: 0,
        totalSkippedConversations: 0,
        totalErrors: 0,
      };
    }

    // Process each client sequentially
    for (const client of allClients) {
      try {
        console.log(`[Discovery Job] Processing client: ${client.clientCode} (${client.companyName})`);

        const result = await discoverConversationsOptimized(client.clientCode);

        totalNewConversations += result.totalNew;
        totalSkippedConversations += result.totalSkipped;
        totalErrors += result.totalErrors;
        clientsProcessed++;

        console.log(`[Discovery Job] ✓ Client ${client.clientCode} completed:`, {
          new: result.totalNew,
          skipped: result.totalSkipped,
          errors: result.totalErrors,
        });
      } catch (error) {
        clientsFailed++;
        console.error(`[Discovery Job] ✗ Failed for client ${client.clientCode}:`, error);
        // Continue with other clients even if one fails
      }
    }

    const completedAt = new Date();
    const durationMs = completedAt.getTime() - startedAt.getTime();

    console.log('[Discovery Job] Conversation discovery completed', {
      completedAt,
      durationMs: `${durationMs}ms`,
      clientsProcessed,
      clientsFailed,
      totalNewConversations,
      totalSkippedConversations,
      totalErrors,
    });

    return {
      startedAt,
      completedAt,
      durationMs,
      clientsProcessed,
      clientsFailed,
      totalNewConversations,
      totalSkippedConversations,
      totalErrors,
    };
  } catch (error) {
    const completedAt = new Date();
    const durationMs = completedAt.getTime() - startedAt.getTime();

    console.error('[Discovery Job] Critical error during discovery:', error);

    return {
      startedAt,
      completedAt,
      durationMs,
      clientsProcessed,
      clientsFailed,
      totalNewConversations,
      totalSkippedConversations,
      totalErrors,
    };
  }
}

/**
 * Manually trigger discovery for a specific client
 * Useful for testing or on-demand discovery
 */
export async function runDiscoveryForClient(clientCode: string): Promise<void> {
  console.log(`[Discovery Job] Manual discovery triggered for client: ${clientCode}`);

  try {
    const result = await discoverConversationsOptimized(clientCode);
    console.log(`[Discovery Job] Manual discovery completed for ${clientCode}:`, result);
  } catch (error) {
    console.error(`[Discovery Job] Manual discovery failed for ${clientCode}:`, error);
    throw error;
  }
}
