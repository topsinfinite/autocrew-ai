import { db } from '@/db';
import type { PgTransaction } from 'drizzle-orm/pg-core';
import type { PostgresJsQueryResultHKT } from 'drizzle-orm/postgres-js';
import type * as schema from '@/db/schema';

export type Transaction = PgTransaction<
  PostgresJsQueryResultHKT,
  typeof schema,
  any
>;

export interface TransactionOptions {
  /**
   * Operation name for logging
   */
  operation: string;

  /**
   * Context for logging
   */
  context?: Record<string, any>;

  /**
   * Maximum retry attempts on serialization failure
   * Default: 3
   */
  maxRetries?: number;

  /**
   * Delay between retries in milliseconds
   * Default: 100
   */
  retryDelay?: number;
}

export interface TransactionResult<T> {
  success: boolean;
  data?: T;
  error?: Error;
  retries?: number;
}

/**
 * Execute a function within a database transaction with automatic retry
 * on serialization failures
 */
export async function withTransaction<T>(
  fn: (tx: Transaction) => Promise<T>,
  options: TransactionOptions
): Promise<TransactionResult<T>> {
  const { operation, context = {}, maxRetries = 3, retryDelay = 100 } = options;

  let lastError: Error | undefined;
  let attempt = 0;

  while (attempt <= maxRetries) {
    try {
      console.log(`[Transaction] ${operation}: Starting transaction`, {
        ...context,
        attempt: attempt + 1,
      });

      const result = await db.transaction(async (tx) => {
        return await fn(tx);
      });

      console.log(`[Transaction] ${operation}: Transaction committed`, {
        ...context,
        attempt: attempt + 1,
      });

      return {
        success: true,
        data: result,
        retries: attempt,
      };
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));

      // Check if this is a serialization failure (PostgreSQL error code 40001)
      const isSerializationError =
        (error as any)?.code === '40001' ||
        (error as any)?.cause?.code === '40001';

      if (isSerializationError && attempt < maxRetries) {
        console.warn(
          `[Transaction] ${operation}: Serialization failure, retrying`,
          {
            ...context,
            attempt: attempt + 1,
            maxRetries,
            error: lastError.message,
          }
        );

        // Exponential backoff
        await new Promise((resolve) =>
          setTimeout(resolve, retryDelay * Math.pow(2, attempt))
        );

        attempt++;
        continue;
      }

      // Non-retryable error or max retries reached
      console.error(
        `[Transaction] ${operation}: Transaction failed`,
        {
          ...context,
          attempt: attempt + 1,
          isSerializationError,
        },
        lastError
      );

      return {
        success: false,
        error: lastError,
        retries: attempt,
      };
    }
  }

  // Should never reach here, but TypeScript needs it
  return {
    success: false,
    error: lastError,
    retries: attempt,
  };
}

/**
 * Execute multiple operations in a single transaction
 * Useful for batch updates
 */
export async function executeBatch<T>(
  operations: Array<(tx: Transaction) => Promise<T>>,
  options: Omit<TransactionOptions, 'operation'> & { operation?: string }
): Promise<TransactionResult<T[]>> {
  return withTransaction(
    async (tx) => {
      const results: T[] = [];
      for (const operation of operations) {
        const result = await operation(tx);
        results.push(result);
      }
      return results;
    },
    {
      operation: options.operation || 'Batch Transaction',
      context: { ...options.context, operationCount: operations.length },
      maxRetries: options.maxRetries,
      retryDelay: options.retryDelay,
    }
  );
}
