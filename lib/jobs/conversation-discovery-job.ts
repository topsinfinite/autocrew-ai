import { discoverConversationsOptimized } from '@/lib/db/optimized-conversation-discovery';
import { logger } from '@/lib/utils';
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
  await logger.info('Starting conversation discovery job', {
    startedAt,
    operation: 'conversation_discovery_job',
  });

  let clientsProcessed = 0;
  let clientsFailed = 0;
  let totalNewConversations = 0;
  let totalSkippedConversations = 0;
  let totalErrors = 0;

  try {
    // Get all active clients
    const allClients = await db.select().from(clients);
    await logger.info('Clients fetched for discovery', {
      clientCount: allClients.length,
      operation: 'conversation_discovery_job',
    });

    if (allClients.length === 0) {
      await logger.info('No clients found - skipping discovery', {
        operation: 'conversation_discovery_job',
      });
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
        await logger.info('Processing client for discovery', {
          clientCode: client.clientCode,
          clientId: client.id,
          companyName: client.companyName,
          operation: 'conversation_discovery_job',
        });

        const result = await discoverConversationsOptimized(client.clientCode);

        totalNewConversations += result.totalNew;
        totalSkippedConversations += result.totalSkipped;
        totalErrors += result.totalErrors;
        clientsProcessed++;

        await logger.info('Client discovery completed successfully', {
          clientCode: client.clientCode,
          clientId: client.id,
          newConversations: result.totalNew,
          skippedConversations: result.totalSkipped,
          errors: result.totalErrors,
          operation: 'conversation_discovery_job',
        });
      } catch (error) {
        clientsFailed++;
        await logger.error('Client discovery failed', {
          clientCode: client.clientCode,
          clientId: client.id,
          operation: 'conversation_discovery_job',
        }, error);
        // Continue with other clients even if one fails
      }
    }

    const completedAt = new Date();
    const durationMs = completedAt.getTime() - startedAt.getTime();

    await logger.info('Conversation discovery job completed', {
      completedAt,
      durationMs,
      clientsProcessed,
      clientsFailed,
      totalNewConversations,
      totalSkippedConversations,
      totalErrors,
      operation: 'conversation_discovery_job',
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

    await logger.error('Critical error during discovery job', {
      durationMs,
      clientsProcessed,
      clientsFailed,
      operation: 'conversation_discovery_job',
    }, error);

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
  await logger.info('Manual discovery triggered for client', {
    clientCode,
    operation: 'manual_discovery_for_client',
  });

  try {
    const result = await discoverConversationsOptimized(clientCode);
    await logger.info('Manual discovery completed for client', {
      clientCode,
      newConversations: result.totalNew,
      skippedConversations: result.totalSkipped,
      errors: result.totalErrors,
      operation: 'manual_discovery_for_client',
    });
  } catch (error) {
    await logger.error('Manual discovery failed for client', {
      clientCode,
      operation: 'manual_discovery_for_client',
    }, error);
    throw error;
  }
}
