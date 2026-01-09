/**
 * Next.js Instrumentation Hook
 *
 * This file is automatically called when the server starts.
 * Use it to initialize background jobs and other server-side services.
 *
 * Documentation: https://nextjs.org/docs/app/building-your-application/optimizing/instrumentation
 */

export async function register() {
  // Only run on the server side
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    console.log('[Instrumentation] Server initialization starting...');

    // Import and start the job scheduler
    const { startJobScheduler } = await import('@/lib/jobs/job-scheduler');

    try {
      startJobScheduler();
      console.log('[Instrumentation] ✓ Background jobs initialized');
    } catch (error) {
      console.error('[Instrumentation] ✗ Failed to initialize background jobs:', error);
      // Don't throw - allow the server to start even if jobs fail
    }

    console.log('[Instrumentation] Server initialization complete');
  }
}
