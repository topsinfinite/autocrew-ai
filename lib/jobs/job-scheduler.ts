import cron, { type ScheduledTask } from 'node-cron';
import { logger } from '@/lib/utils';
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
export async function startJobScheduler(): Promise<void> {
  // Check if background jobs are enabled
  const enableJobs = process.env.ENABLE_BACKGROUND_JOBS !== 'false';

  if (!enableJobs) {
    await logger.info('Background jobs disabled', {
      enabled: false,
      operation: 'start_job_scheduler',
    });
    return;
  }

  // Get cron schedule from environment or use default (every 5 minutes)
  const cronSchedule = process.env.CONVERSATION_DISCOVERY_CRON || '*/5 * * * *';

  // Validate cron expression
  if (!cron.validate(cronSchedule)) {
    await logger.error('Invalid cron schedule - using default', {
      providedSchedule: cronSchedule,
      defaultSchedule: '*/5 * * * *',
      operation: 'start_job_scheduler',
    });
    await scheduleConversationDiscovery('*/5 * * * *');
  } else {
    await scheduleConversationDiscovery(cronSchedule);
  }

  await logger.info('Job scheduler initialized successfully', {
    activeTasks: scheduledTasks.length,
    cronSchedule,
    operation: 'start_job_scheduler',
  });
}

/**
 * Stop all scheduled jobs
 * Useful for graceful shutdown
 */
export async function stopJobScheduler(): Promise<void> {
  await logger.info('Stopping scheduled tasks', {
    taskCount: scheduledTasks.length,
    operation: 'stop_job_scheduler',
  });

  for (const task of scheduledTasks) {
    task.stop();
  }

  scheduledTasks.length = 0;
  await logger.info('All scheduled tasks stopped successfully', {
    operation: 'stop_job_scheduler',
  });
}

/**
 * Schedule the conversation discovery job
 */
async function scheduleConversationDiscovery(cronSchedule: string): Promise<void> {
  await logger.info('Scheduling conversation discovery job', {
    cronSchedule,
    operation: 'schedule_conversation_discovery',
  });

  const task = cron.schedule(
    cronSchedule,
    async () => {
      // Prevent overlapping job executions
      if (isJobRunning) {
        await logger.warn('Discovery job already running - skipping execution', {
          operation: 'conversation_discovery_cron',
        });
        return;
      }

      isJobRunning = true;
      const startedAt = new Date();

      try {
        await logger.info('Triggering scheduled conversation discovery job', {
          operation: 'conversation_discovery_cron',
        });
        const result = await runConversationDiscoveryJob();

        lastJobResult = {
          success: true,
          startedAt: result.startedAt,
          completedAt: result.completedAt,
          durationMs: result.durationMs,
        };

        await logger.info('Discovery job completed successfully', {
          durationMs: result.durationMs,
          newConversations: result.totalNewConversations,
          operation: 'conversation_discovery_cron',
        });
      } catch (error) {
        const completedAt = new Date();
        lastJobResult = {
          success: false,
          startedAt,
          completedAt,
          durationMs: completedAt.getTime() - startedAt.getTime(),
        };

        await logger.error('Discovery job failed', {
          durationMs: lastJobResult.durationMs,
          operation: 'conversation_discovery_cron',
        }, error);
      } finally {
        isJobRunning = false;
      }
    }
  );

  scheduledTasks.push(task);

  const scheduleDescription = getNextRunDescription(cronSchedule);
  await logger.info('Conversation discovery job scheduled successfully', {
    cronSchedule,
    scheduleDescription,
    operation: 'schedule_conversation_discovery',
  });
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
  await logger.info('Manual job trigger requested', {
    operation: 'trigger_manual_discovery',
  });

  try {
    const result = await runConversationDiscoveryJob();
    await logger.info('Manual job completed successfully', {
      durationMs: result.durationMs,
      newConversations: result.totalNewConversations,
      operation: 'trigger_manual_discovery',
    });
  } catch (error) {
    await logger.error('Manual job failed', {
      operation: 'trigger_manual_discovery',
    }, error);
    throw error;
  }
}
