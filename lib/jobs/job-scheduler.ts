import cron, { type ScheduledTask } from 'node-cron';
import { runConversationDiscoveryJob } from './conversation-discovery-job';

/**
 * Job Scheduler for Background Tasks
 *
 * Manages scheduled background jobs using cron expressions.
 * Configured via environment variables in .env.local
 *
 * Configuration:
 * - CONVERSATION_DISCOVERY_CRON: Cron schedule (default: every 5 minutes)
 * - ENABLE_BACKGROUND_JOBS: Enable/disable jobs (default: true)
 *
 * Common Cron Schedules:
 * - Every 2 minutes (high traffic)
 * - Every 5 minutes (default, recommended)
 * - Every 15 minutes (medium traffic)
 * - Every hour (low traffic)
 * - Every 2 hours (very low traffic)
 * - Daily at 2am (batch processing)
 */

// Track active scheduled tasks
const scheduledTasks: ScheduledTask[] = [];

// Track job execution state
let isJobRunning = false;
let lastJobResult: {
  success: boolean;
  startedAt: Date;
  completedAt: Date;
  durationMs: number;
} | null = null;

/**
 * Start the job scheduler
 * Initializes all background jobs based on environment configuration
 */
export function startJobScheduler(): void {
  // Check if background jobs are enabled
  const enableJobs = process.env.ENABLE_BACKGROUND_JOBS !== 'false';

  if (!enableJobs) {
    console.log('[Scheduler] Background jobs disabled via ENABLE_BACKGROUND_JOBS=false');
    console.log('[Scheduler] Set ENABLE_BACKGROUND_JOBS=true in .env.local to enable');
    return;
  }

  // Get cron schedule from environment or use default (every 5 minutes)
  const cronSchedule = process.env.CONVERSATION_DISCOVERY_CRON || '*/5 * * * *';

  // Validate cron expression
  if (!cron.validate(cronSchedule)) {
    console.error(
      `[Scheduler] Invalid cron schedule: "${cronSchedule}"`,
      '\n[Scheduler] Using default: */5 * * * *',
      '\n[Scheduler] See docs/cron-syntax.md for valid formats'
    );
    scheduleConversationDiscovery('*/5 * * * *');
  } else {
    scheduleConversationDiscovery(cronSchedule);
  }

  console.log('[Scheduler] Job scheduler initialized successfully');
  console.log('[Scheduler] Active jobs:', scheduledTasks.length);
}

/**
 * Stop all scheduled jobs
 * Useful for graceful shutdown
 */
export function stopJobScheduler(): void {
  console.log(`[Scheduler] Stopping ${scheduledTasks.length} scheduled tasks...`);

  for (const task of scheduledTasks) {
    task.stop();
  }

  scheduledTasks.length = 0;
  console.log('[Scheduler] All scheduled tasks stopped');
}

/**
 * Schedule the conversation discovery job
 */
function scheduleConversationDiscovery(cronSchedule: string): void {
  console.log(`[Scheduler] Scheduling conversation discovery: ${cronSchedule}`);

  const task = cron.schedule(
    cronSchedule,
    async () => {
      // Prevent overlapping job executions
      if (isJobRunning) {
        console.warn('[Scheduler] Discovery job already running, skipping this execution');
        return;
      }

      isJobRunning = true;
      const startedAt = new Date();

      try {
        console.log('[Scheduler] ⏰ Triggering conversation discovery job');
        const result = await runConversationDiscoveryJob();

        lastJobResult = {
          success: true,
          startedAt: result.startedAt,
          completedAt: result.completedAt,
          durationMs: result.durationMs,
        };

        console.log('[Scheduler] ✓ Discovery job completed successfully', {
          durationMs: result.durationMs,
          newConversations: result.totalNewConversations,
        });
      } catch (error) {
        const completedAt = new Date();
        lastJobResult = {
          success: false,
          startedAt,
          completedAt,
          durationMs: completedAt.getTime() - startedAt.getTime(),
        };

        console.error('[Scheduler] ✗ Discovery job failed:', error);
      } finally {
        isJobRunning = false;
      }
    }
  );

  scheduledTasks.push(task);

  console.log('[Scheduler] Conversation discovery job scheduled');
  console.log(`[Scheduler] Schedule: ${cronSchedule} (${getNextRunDescription(cronSchedule)})`);
}

/**
 * Get human-readable description of next run time
 */
function getNextRunDescription(cronSchedule: string): string {
  const parts = cronSchedule.split(' ');

  // Parse common patterns
  if (cronSchedule.startsWith('*/')) {
    const minutes = parts[0].substring(2);
    return `Every ${minutes} minutes`;
  }

  if (cronSchedule === '0 * * * *') {
    return 'Every hour at :00';
  }

  if (cronSchedule === '0 */2 * * *') {
    return 'Every 2 hours at :00';
  }

  if (cronSchedule === '0 2 * * *') {
    return 'Daily at 2:00 AM UTC';
  }

  return 'See logs for execution time';
}

/**
 * Get scheduler status (useful for health checks)
 */
export function getSchedulerStatus(): {
  enabled: boolean;
  activeTasks: number;
  isJobRunning: boolean;
  lastJobResult: typeof lastJobResult;
  cronSchedule: string;
} {
  return {
    enabled: process.env.ENABLE_BACKGROUND_JOBS !== 'false',
    activeTasks: scheduledTasks.length,
    isJobRunning,
    lastJobResult,
    cronSchedule: process.env.CONVERSATION_DISCOVERY_CRON || '*/5 * * * *',
  };
}

/**
 * Manually trigger a job run (for testing)
 * Does not respect the isJobRunning lock
 */
export async function triggerManualRun(): Promise<void> {
  console.log('[Scheduler] Manual job trigger requested');

  try {
    const result = await runConversationDiscoveryJob();
    console.log('[Scheduler] Manual job completed:', result);
  } catch (error) {
    console.error('[Scheduler] Manual job failed:', error);
    throw error;
  }
}
