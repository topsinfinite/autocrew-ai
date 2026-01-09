# Production Hardening: Error Handling & Transaction Safety Plan

## Executive Summary

This plan addresses critical production readiness gaps identified in the knowledge base implementation:
1. **Transaction Safety**: Ensuring atomic operations across multiple database updates
2. **Error Handling**: Production-grade structured logging and error recovery
3. **Security Hardening**: File content validation and filename sanitization
4. **Rate Limiting**: Protection against DoS attacks

**Estimated Implementation Time**: 2-3 days
**Risk Level**: Low (additive changes, no breaking modifications)
**Impact**: High (prevents data inconsistency and security vulnerabilities)

---

## Architecture Overview

### Current Issues

```
┌─────────────────────────────────────────────────────────┐
│ Current Flow (POST /api/knowledge-base)                 │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  1. Insert metadata (status='processing')  ✓            │
│  2. Send file to n8n (60s timeout)         ✓            │
│  3. Update metadata (status='indexed')     ⚠️ No TX     │
│  4. Update crew config                     ⚠️ No TX     │
│  5. Rollback on error                      ⚠️ Incomplete│
│                                                          │
│ Problems:                                                │
│ • Steps 3-4 not atomic (can partially fail)            │
│ • Rollback doesn't clean up n8n chunks                 │
│ • No structured error logging                          │
│ • File validation insufficient                         │
└─────────────────────────────────────────────────────────┘
```

### Target Architecture

```
┌─────────────────────────────────────────────────────────┐
│ Hardened Flow (POST /api/knowledge-base)                │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  1. Validate file content (magic numbers)  ✓            │
│  2. Check rate limit                       ✓            │
│  3. Sanitize filename                      ✓            │
│  4. Insert metadata (status='processing')  ✓            │
│  5. Send file to n8n (configurable timeout)✓            │
│  6. ┌──────────────────────────────────┐                │
│     │ BEGIN TRANSACTION                │                │
│     │  - Update metadata (indexed)     │                │
│     │  - Update crew config            │                │
│     │ COMMIT TRANSACTION               │                │
│     └──────────────────────────────────┘                │
│  7. Log success event                      ✓            │
│                                                          │
│ Error Recovery:                                         │
│ • Structured error logging with context                │
│ • Complete rollback (metadata + chunks)                │
│ • Rate limit tracking                                  │
└─────────────────────────────────────────────────────────┘
```

---

## Phase 1: Core Infrastructure

### 1.1 Structured Logger

**File**: `lib/utils/logger.ts`

```typescript
import { headers } from 'next/headers';

export enum LogLevel {
  DEBUG = 'debug',
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error',
}

export interface LogContext {
  userId?: string;
  crewId?: string;
  docId?: string;
  clientId?: string;
  filename?: string;
  fileSize?: number;
  operation?: string;
  duration?: number;
  [key: string]: any;
}

export interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  context: LogContext;
  error?: {
    name: string;
    message: string;
    stack?: string;
    code?: string;
  };
  requestId?: string;
}

class Logger {
  private isDevelopment = process.env.NODE_ENV === 'development';
  private isProduction = process.env.NODE_ENV === 'production';

  /**
   * Get request ID from headers for tracing
   */
  private async getRequestId(): Promise<string | undefined> {
    try {
      const headersList = await headers();
      return headersList.get('x-request-id') || undefined;
    } catch {
      return undefined;
    }
  }

  /**
   * Format log entry for output
   */
  private formatLog(entry: LogEntry): string {
    if (this.isDevelopment) {
      return JSON.stringify(entry, null, 2);
    }
    return JSON.stringify(entry);
  }

  /**
   * Send log to external service in production
   */
  private async sendToExternalLogger(entry: LogEntry): Promise<void> {
    if (!this.isProduction) return;

    // TODO: Integrate with your logging service
    // Examples:
    // - Sentry: Sentry.captureException(entry.error)
    // - Datadog: datadogLogs.logger.log(entry)
    // - CloudWatch: await cloudwatch.putLogEvents(entry)
    // - Custom endpoint: await fetch('/api/logs', { body: JSON.stringify(entry) })
  }

  /**
   * Core logging function
   */
  private async log(
    level: LogLevel,
    message: string,
    context: LogContext = {},
    error?: Error | unknown
  ): Promise<void> {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      context,
      requestId: await this.getRequestId(),
    };

    // Add error details if provided
    if (error) {
      if (error instanceof Error) {
        entry.error = {
          name: error.name,
          message: error.message,
          stack: this.isDevelopment ? error.stack : undefined,
          code: (error as any).code,
        };
      } else {
        entry.error = {
          name: 'Unknown',
          message: String(error),
        };
      }
    }

    // Console output
    const formattedLog = this.formatLog(entry);
    switch (level) {
      case LogLevel.ERROR:
        console.error(formattedLog);
        break;
      case LogLevel.WARN:
        console.warn(formattedLog);
        break;
      case LogLevel.INFO:
        console.info(formattedLog);
        break;
      case LogLevel.DEBUG:
        if (this.isDevelopment) {
          console.debug(formattedLog);
        }
        break;
    }

    // Send to external service (async, don't wait)
    this.sendToExternalLogger(entry).catch((err) => {
      console.error('Failed to send log to external service:', err);
    });
  }

  /**
   * Public API
   */
  async debug(message: string, context?: LogContext): Promise<void> {
    await this.log(LogLevel.DEBUG, message, context);
  }

  async info(message: string, context?: LogContext): Promise<void> {
    await this.log(LogLevel.INFO, message, context);
  }

  async warn(message: string, context?: LogContext, error?: Error): Promise<void> {
    await this.log(LogLevel.WARN, message, context, error);
  }

  async error(message: string, context?: LogContext, error?: Error | unknown): Promise<void> {
    await this.log(LogLevel.ERROR, message, context, error);
  }

  /**
   * Measure operation duration
   */
  async time<T>(
    operation: string,
    context: LogContext,
    fn: () => Promise<T>
  ): Promise<T> {
    const start = Date.now();
    try {
      const result = await fn();
      const duration = Date.now() - start;
      await this.info(`${operation} completed`, { ...context, duration });
      return result;
    } catch (error) {
      const duration = Date.now() - start;
      await this.error(`${operation} failed`, { ...context, duration }, error);
      throw error;
    }
  }
}

// Export singleton instance
export const logger = new Logger();

// Convenience function for error logging with context
export async function logError(
  message: string,
  error: Error | unknown,
  context?: LogContext
): Promise<void> {
  await logger.error(message, context, error);
}
```

---

### 1.2 Rate Limiter

**File**: `lib/utils/rate-limiter.ts`

```typescript
import { headers } from 'next/headers';

export interface RateLimitConfig {
  /**
   * Maximum number of requests allowed
   */
  maxRequests: number;

  /**
   * Time window in milliseconds
   */
  windowMs: number;

  /**
   * Identifier key prefix (e.g., 'upload', 'api')
   */
  keyPrefix: string;
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetAt: Date;
  retryAfter?: number; // seconds
}

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

/**
 * In-memory rate limiter
 *
 * NOTE: This is a simple in-memory implementation.
 * For production with multiple instances, use:
 * - Redis (via @upstash/ratelimit or ioredis)
 * - Vercel KV
 * - CloudFlare Workers KV
 */
class RateLimiter {
  private store = new Map<string, RateLimitEntry>();
  private cleanupInterval: NodeJS.Timeout | null = null;

  constructor() {
    // Cleanup expired entries every 5 minutes
    this.cleanupInterval = setInterval(() => {
      this.cleanup();
    }, 5 * 60 * 1000);
  }

  /**
   * Remove expired entries from memory
   */
  private cleanup(): void {
    const now = Date.now();
    for (const [key, entry] of this.store.entries()) {
      if (now > entry.resetAt) {
        this.store.delete(key);
      }
    }
  }

  /**
   * Check if request is allowed under rate limit
   */
  async check(
    identifier: string,
    config: RateLimitConfig
  ): Promise<RateLimitResult> {
    const key = `${config.keyPrefix}:${identifier}`;
    const now = Date.now();

    const entry = this.store.get(key);

    // No existing entry or expired - allow request
    if (!entry || now > entry.resetAt) {
      const resetAt = now + config.windowMs;
      this.store.set(key, {
        count: 1,
        resetAt,
      });

      return {
        allowed: true,
        remaining: config.maxRequests - 1,
        resetAt: new Date(resetAt),
      };
    }

    // Check if limit exceeded
    if (entry.count >= config.maxRequests) {
      const retryAfter = Math.ceil((entry.resetAt - now) / 1000);
      return {
        allowed: false,
        remaining: 0,
        resetAt: new Date(entry.resetAt),
        retryAfter,
      };
    }

    // Increment counter
    entry.count++;

    return {
      allowed: true,
      remaining: config.maxRequests - entry.count,
      resetAt: new Date(entry.resetAt),
    };
  }

  /**
   * Reset rate limit for a specific identifier
   */
  async reset(identifier: string, keyPrefix: string): Promise<void> {
    const key = `${keyPrefix}:${identifier}`;
    this.store.delete(key);
  }

  /**
   * Get current rate limit status
   */
  async getStatus(
    identifier: string,
    config: RateLimitConfig
  ): Promise<RateLimitResult> {
    const key = `${config.keyPrefix}:${identifier}`;
    const now = Date.now();
    const entry = this.store.get(key);

    if (!entry || now > entry.resetAt) {
      return {
        allowed: true,
        remaining: config.maxRequests,
        resetAt: new Date(now + config.windowMs),
      };
    }

    return {
      allowed: entry.count < config.maxRequests,
      remaining: Math.max(0, config.maxRequests - entry.count),
      resetAt: new Date(entry.resetAt),
      retryAfter:
        entry.count >= config.maxRequests
          ? Math.ceil((entry.resetAt - now) / 1000)
          : undefined,
    };
  }

  /**
   * Cleanup on shutdown
   */
  destroy(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
      this.cleanupInterval = null;
    }
    this.store.clear();
  }
}

// Export singleton instance
export const rateLimiter = new RateLimiter();

// Preset configurations
export const RATE_LIMITS = {
  FILE_UPLOAD: {
    maxRequests: 10,
    windowMs: 60 * 60 * 1000, // 1 hour
    keyPrefix: 'upload',
  },
  API_GENERAL: {
    maxRequests: 100,
    windowMs: 60 * 1000, // 1 minute
    keyPrefix: 'api',
  },
  API_STRICT: {
    maxRequests: 30,
    windowMs: 60 * 1000, // 1 minute
    keyPrefix: 'api-strict',
  },
} as const;

/**
 * Convenience function for checking file upload rate limit
 */
export async function checkUploadRateLimit(userId: string): Promise<RateLimitResult> {
  return rateLimiter.check(userId, RATE_LIMITS.FILE_UPLOAD);
}
```

---

### 1.3 Enhanced File Validator

**File**: `lib/utils/file-validator-enhanced.ts`

```typescript
const ALLOWED_MIME_TYPES = [
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // DOCX
  'text/plain',
  'text/markdown',
  'text/csv',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // XLSX
] as const;

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export interface FileValidationResult {
  valid: boolean;
  error?: string;
  warnings?: string[];
}

/**
 * File signature (magic numbers) for content validation
 */
const FILE_SIGNATURES: Record<string, number[][]> = {
  'application/pdf': [
    [0x25, 0x50, 0x44, 0x46], // %PDF
  ],
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': [
    [0x50, 0x4b, 0x03, 0x04], // PK.. (ZIP format)
    [0x50, 0x4b, 0x05, 0x06], // PK.. (Empty ZIP)
    [0x50, 0x4b, 0x07, 0x08], // PK.. (Spanned ZIP)
  ],
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': [
    [0x50, 0x4b, 0x03, 0x04], // PK.. (ZIP format)
  ],
  'text/plain': [], // No magic number for plain text
  'text/markdown': [], // No magic number for markdown
  'text/csv': [], // No magic number for CSV
};

/**
 * Validate file content by checking magic numbers (file signatures)
 */
async function validateFileContent(file: File): Promise<boolean> {
  const signatures = FILE_SIGNATURES[file.type];

  // No signature check for text files
  if (!signatures || signatures.length === 0) {
    return true;
  }

  try {
    const buffer = await file.arrayBuffer();
    const bytes = new Uint8Array(buffer);

    // Check if file starts with any valid signature
    for (const signature of signatures) {
      let matches = true;
      for (let i = 0; i < signature.length; i++) {
        if (bytes[i] !== signature[i]) {
          matches = false;
          break;
        }
      }
      if (matches) {
        return true;
      }
    }

    return false;
  } catch (error) {
    console.error('Failed to validate file content:', error);
    return false;
  }
}

/**
 * Sanitize filename to prevent path traversal and special character issues
 */
export function sanitizeFilename(filename: string): string {
  // Get file extension first
  const lastDotIndex = filename.lastIndexOf('.');
  let name = filename;
  let extension = '';

  if (lastDotIndex > 0) {
    name = filename.slice(0, lastDotIndex);
    extension = filename.slice(lastDotIndex);
  }

  // Remove path traversal attempts
  name = name.replace(/\.\.+/g, '.');

  // Remove or replace special characters and control characters
  name = name.replace(/[<>:"/\\|?*\x00-\x1f]/g, '_');

  // Remove leading/trailing spaces and dots
  name = name.trim().replace(/^\.+|\.+$/g, '');

  // Prevent hidden files
  if (name.startsWith('.')) {
    name = '_' + name;
  }

  // Ensure name is not empty
  if (name.length === 0) {
    name = 'unnamed_file';
  }

  // Limit total length (255 is typical filesystem limit)
  const maxNameLength = 255 - extension.length;
  if (name.length > maxNameLength) {
    name = name.slice(0, maxNameLength);
  }

  return name + extension;
}

/**
 * Get file extension from filename
 */
export function getFileExtension(filename: string): string {
  const lastDotIndex = filename.lastIndexOf('.');
  if (lastDotIndex === -1 || lastDotIndex === filename.length - 1) {
    return '';
  }
  return filename.slice(lastDotIndex + 1).toLowerCase();
}

/**
 * Format file size in human-readable format
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}

/**
 * Enhanced file validation with content checks
 */
export async function validateFile(file: File): Promise<FileValidationResult> {
  const warnings: string[] = [];

  // Check if file exists
  if (!file) {
    return {
      valid: false,
      error: 'No file provided',
    };
  }

  // Validate file size
  if (file.size > MAX_FILE_SIZE) {
    const sizeMB = (file.size / (1024 * 1024)).toFixed(2);
    const maxSizeMB = (MAX_FILE_SIZE / (1024 * 1024)).toFixed(0);
    return {
      valid: false,
      error: `File size (${sizeMB} MB) exceeds maximum allowed size of ${maxSizeMB} MB`,
    };
  }

  // Check for empty files
  if (file.size === 0) {
    return {
      valid: false,
      error: 'File is empty',
    };
  }

  // Warn if file is very small (might be corrupted)
  if (file.size < 100) {
    warnings.push('File is very small and might be corrupted');
  }

  // Validate MIME type
  if (!ALLOWED_MIME_TYPES.includes(file.type as any)) {
    const fileExtension = getFileExtension(file.name);
    return {
      valid: false,
      error: `File type "${file.type || fileExtension}" is not supported. Allowed types: PDF, DOCX, TXT, MD, CSV, XLSX`,
    };
  }

  // Validate actual file content (magic numbers)
  const contentValid = await validateFileContent(file);
  if (!contentValid) {
    return {
      valid: false,
      error: `File content does not match its type (${file.type}). The file may be corrupted or have an incorrect extension.`,
    };
  }

  // Check filename for suspicious patterns
  const dangerousPatterns = [
    /\.\./,           // Path traversal
    /[<>:"|?*]/,      // Special characters
    /[\x00-\x1f]/,    // Control characters
    /\.exe$/i,        // Executable extensions
    /\.bat$/i,
    /\.cmd$/i,
    /\.sh$/i,
    /\.ps1$/i,
  ];

  for (const pattern of dangerousPatterns) {
    if (pattern.test(file.name)) {
      warnings.push('Filename contains suspicious patterns and will be sanitized');
      break;
    }
  }

  return {
    valid: true,
    warnings: warnings.length > 0 ? warnings : undefined,
  };
}

/**
 * Gets a user-friendly label for a MIME type
 */
export function getMimeTypeLabel(mimeType: string): string {
  const mimeTypeMap: Record<string, string> = {
    'application/pdf': 'PDF',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'DOCX',
    'text/plain': 'Text',
    'text/markdown': 'Markdown',
    'text/csv': 'CSV',
    'application/vnd.ms-excel': 'Excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'Excel',
  };

  return mimeTypeMap[mimeType] || mimeType;
}
```

---

## Phase 2: Transaction Safety

### 2.1 Transaction Wrapper Utility

**File**: `lib/db/transaction-helpers.ts`

```typescript
import { db } from '@/db';
import { logger } from '@/lib/utils/logger';
import type { PgTransaction } from 'drizzle-orm/pg-core';
import type { PostgresJsQueryResultHKT } from 'drizzle-orm/postgres-js';

export type Transaction = PgTransaction<
  PostgresJsQueryResultHKT,
  Record<string, never>,
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
      await logger.debug(`${operation}: Starting transaction`, {
        ...context,
        attempt: attempt + 1,
      });

      const result = await db.transaction(async (tx) => {
        return await fn(tx);
      });

      await logger.info(`${operation}: Transaction committed`, {
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
        await logger.warn(
          `${operation}: Serialization failure, retrying`,
          {
            ...context,
            attempt: attempt + 1,
            maxRetries,
          },
          lastError
        );

        // Exponential backoff
        await new Promise((resolve) =>
          setTimeout(resolve, retryDelay * Math.pow(2, attempt))
        );

        attempt++;
        continue;
      }

      // Non-retryable error or max retries reached
      await logger.error(
        `${operation}: Transaction failed`,
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
```

---

### 2.2 Knowledge Base Service Layer

**File**: `lib/services/knowledge-base-service.ts`

```typescript
import { db } from '@/db';
import { knowledgeBaseDocuments, crews } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { withTransaction } from '@/lib/db/transaction-helpers';
import { deleteDocument } from '@/lib/db/knowledge-base';
import { logger } from '@/lib/utils/logger';
import type { CrewConfig } from '@/types';

export interface UpdateDocumentStatusParams {
  docId: string;
  status: 'indexed' | 'processing' | 'error';
  chunkCount?: number;
  error?: string;
}

export interface UpdateCrewActivationParams {
  crewId: string;
  currentConfig: CrewConfig;
}

/**
 * Atomically update document status and crew config
 * This is the critical operation that needs transaction safety
 */
export async function updateDocumentAndCrew(
  docId: string,
  crewId: string,
  chunkCount: number,
  currentConfig: CrewConfig,
  context: { userId: string; filename: string }
) {
  const result = await withTransaction(
    async (tx) => {
      // 1. Update metadata record with indexed status
      await tx
        .update(knowledgeBaseDocuments)
        .set({
          status: 'indexed',
          chunkCount,
          updatedAt: new Date(),
        })
        .where(eq(knowledgeBaseDocuments.docId, docId));

      // 2. Update crew config if first upload
      if (!currentConfig.activationState?.documentsUploaded) {
        const updatedConfig: CrewConfig = {
          ...currentConfig,
          activationState: {
            documentsUploaded: true,
            supportConfigured: !!currentConfig.metadata?.support_email,
            activationReady: false,
          },
        };

        await tx
          .update(crews)
          .set({
            config: updatedConfig,
            updatedAt: new Date(),
          })
          .where(eq(crews.id, crewId));

        return { updatedCrewConfig: true };
      }

      return { updatedCrewConfig: false };
    },
    {
      operation: 'Update Document and Crew',
      context: {
        docId,
        crewId,
        chunkCount,
        userId: context.userId,
        filename: context.filename,
      },
    }
  );

  if (!result.success) {
    throw new Error(
      `Failed to update document and crew: ${result.error?.message}`
    );
  }

  return result.data;
}

/**
 * Update document status to error
 */
export async function markDocumentAsError(
  docId: string,
  errorMessage: string,
  context: { userId: string; filename: string }
) {
  try {
    await db
      .update(knowledgeBaseDocuments)
      .set({
        status: 'error',
        updatedAt: new Date(),
      })
      .where(eq(knowledgeBaseDocuments.docId, docId));

    await logger.warn('Document marked as error', {
      docId,
      errorMessage,
      userId: context.userId,
      filename: context.filename,
    });
  } catch (error) {
    await logger.error(
      'Failed to mark document as error',
      {
        docId,
        errorMessage,
        userId: context.userId,
        filename: context.filename,
      },
      error
    );
    throw error;
  }
}

/**
 * Complete rollback: delete metadata and vector chunks
 */
export async function rollbackDocument(
  docId: string,
  vectorTableName: string | undefined,
  context: { userId: string; filename: string; crewId: string }
) {
  try {
    if (vectorTableName) {
      // Use the deleteDocument helper which deletes both
      await deleteDocument(docId, vectorTableName);
      await logger.info('Complete rollback successful', {
        docId,
        vectorTableName,
        userId: context.userId,
        filename: context.filename,
        crewId: context.crewId,
      });
    } else {
      // No vector table, just delete metadata
      await db
        .delete(knowledgeBaseDocuments)
        .where(eq(knowledgeBaseDocuments.docId, docId));

      await logger.info('Metadata rollback successful', {
        docId,
        userId: context.userId,
        filename: context.filename,
        crewId: context.crewId,
      });
    }
  } catch (error) {
    // Critical: rollback failed - needs manual intervention
    await logger.error(
      'CRITICAL: Rollback failed - manual cleanup required',
      {
        docId,
        vectorTableName,
        userId: context.userId,
        filename: context.filename,
        crewId: context.crewId,
      },
      error
    );
    throw error;
  }
}

/**
 * Create initial metadata record
 */
export async function createDocumentMetadata(params: {
  docId: string;
  clientId: string;
  crewId: string;
  filename: string;
  fileType: string;
  fileSize: number;
}) {
  await db.insert(knowledgeBaseDocuments).values({
    docId: params.docId,
    clientId: params.clientId,
    crewId: params.crewId,
    filename: params.filename,
    fileType: params.fileType,
    fileSize: params.fileSize,
    chunkCount: 0,
    status: 'processing',
  });

  await logger.info('Document metadata created', {
    docId: params.docId,
    filename: params.filename,
    fileSize: params.fileSize,
  });
}
```

---

## Phase 3: Refactor API Routes

### 3.1 Enhanced POST Handler

**File**: `app/api/crews/[id]/knowledge-base/route.ts` (Updated POST function)

```typescript
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  let docId: string | null = null;
  let crew: any = null;
  const startTime = Date.now();

  try {
    // 1. Verify authentication
    const session = await requireAuth();
    const { id } = await params;

    await logger.info('Knowledge base upload started', {
      userId: session.user.id,
      crewId: id,
    });

    // 2. Check rate limit FIRST (before processing file)
    const rateLimit = await checkUploadRateLimit(session.user.id);
    if (!rateLimit.allowed) {
      await logger.warn('Upload rate limit exceeded', {
        userId: session.user.id,
        crewId: id,
        retryAfter: rateLimit.retryAfter,
      });

      return NextResponse.json(
        {
          success: false,
          error: 'Upload rate limit exceeded. Please try again later.',
          retryAfter: rateLimit.retryAfter,
        },
        {
          status: 429,
          headers: {
            'Retry-After': String(rateLimit.retryAfter || 60),
            'X-RateLimit-Remaining': String(rateLimit.remaining),
            'X-RateLimit-Reset': rateLimit.resetAt.toISOString(),
          },
        }
      );
    }

    // 3. Parse multipart form data
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json(
        {
          success: false,
          error: 'No file provided',
        },
        { status: 400 }
      );
    }

    // 4. Validate file (enhanced with content validation)
    const validation = await validateFile(file);
    if (!validation.valid) {
      await logger.warn('File validation failed', {
        userId: session.user.id,
        filename: file.name,
        error: validation.error,
      });

      return NextResponse.json(
        {
          success: false,
          error: validation.error,
        },
        { status: 400 }
      );
    }

    // Log warnings if any
    if (validation.warnings && validation.warnings.length > 0) {
      await logger.warn('File validation warnings', {
        userId: session.user.id,
        filename: file.name,
        warnings: validation.warnings,
      });
    }

    // 5. Sanitize filename
    const sanitizedFilename = sanitizeFilename(file.name);
    if (sanitizedFilename !== file.name) {
      await logger.info('Filename sanitized', {
        original: file.name,
        sanitized: sanitizedFilename,
      });
    }

    // 6. Fetch crew
    [crew] = await db.select().from(crews).where(eq(crews.id, id)).limit(1);
    if (!crew) {
      return NextResponse.json(
        {
          success: false,
          error: 'Crew not found',
        },
        { status: 404 }
      );
    }

    // 7. Verify crew type is customer_support
    if (crew.type !== 'customer_support') {
      return NextResponse.json(
        {
          success: false,
          error: 'Knowledge base is only available for customer support crews',
        },
        { status: 400 }
      );
    }

    // 8. Authorization check
    if (!(await isSuperAdmin())) {
      const userId = session.user.id;
      const membership = await db
        .select()
        .from(member)
        .innerJoin(clients, eq(member.organizationId, clients.id))
        .where(
          and(eq(member.userId, userId), eq(clients.clientCode, crew.clientId))
        )
        .limit(1);

      if (membership.length === 0) {
        return NextResponse.json(
          {
            success: false,
            error:
              'Forbidden - You can only upload documents to crews from your organization',
          },
          { status: 403 }
        );
      }
    }

    // 9. Generate docId and create metadata record
    docId = crypto.randomUUID();

    await createDocumentMetadata({
      docId,
      clientId: crew.clientId,
      crewId: crew.id,
      filename: sanitizedFilename,
      fileType: file.type,
      fileSize: file.size,
    });

    // 10. Construct FormData for n8n (with docId)
    const n8nFormData = new FormData();
    n8nFormData.append('crewCode', crew.crewCode);
    n8nFormData.append('docId', docId);
    n8nFormData.append('binary', file, sanitizedFilename);

    // 11. POST to n8n webhook
    const n8nApiKey = process.env.N8N_API_KEY;
    const n8nDocumentUploadWebhook = process.env.N8N_DOCUMENT_UPLOAD_WEBHOOK;
    const uploadTimeout = parseInt(
      process.env.N8N_UPLOAD_TIMEOUT || '120000',
      10
    );

    if (!n8nApiKey || !n8nDocumentUploadWebhook) {
      throw new Error('N8N configuration missing');
    }

    await logger.info('Sending file to n8n', {
      userId: session.user.id,
      crewId: id,
      docId,
      filename: sanitizedFilename,
      fileSize: file.size,
      timeout: uploadTimeout,
    });

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), uploadTimeout);

    try {
      const n8nResponse = await fetch(n8nDocumentUploadWebhook, {
        method: 'POST',
        headers: {
          'x-api-key': n8nApiKey,
        },
        body: n8nFormData,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      const n8nData: N8nUploadResponse = await n8nResponse.json();

      // 12. Handle n8n response
      if (n8nData.status === 'error' || !n8nResponse.ok) {
        // Mark as error in database
        await markDocumentAsError(docId, n8nData.message || 'N8N processing failed', {
          userId: session.user.id,
          filename: sanitizedFilename,
        });

        return NextResponse.json(
          {
            success: false,
            error: n8nData.message || 'Failed to process document',
            statusCode: n8nData.statusCode || n8nResponse.status,
          },
          { status: n8nData.statusCode || n8nResponse.status }
        );
      }

      // 13. Update metadata and crew config in transaction
      const chunkCount = n8nData.document?.chunk_count || 0;
      const currentConfig = crew.config as CrewConfig;

      await updateDocumentAndCrew(
        docId,
        crew.id,
        chunkCount,
        currentConfig,
        {
          userId: session.user.id,
          filename: sanitizedFilename,
        }
      );

      const duration = Date.now() - startTime;
      await logger.info('Document upload completed successfully', {
        userId: session.user.id,
        crewId: id,
        docId,
        filename: sanitizedFilename,
        fileSize: file.size,
        chunkCount,
        duration,
      });

      // 14. Return success response
      return NextResponse.json({
        success: true,
        data: {
          docId,
          filename: sanitizedFilename,
          originalFilename: file.name !== sanitizedFilename ? file.name : undefined,
          chunkCount,
          vectorTable: n8nData.metadata?.vector_table,
          status: n8nData.document?.status,
          embeddingsModel: n8nData.document?.embeddings_model,
          warnings: validation.warnings,
        },
        message: 'Document uploaded and processed successfully',
      });
    } catch (error) {
      clearTimeout(timeoutId);

      if (error instanceof Error && error.name === 'AbortError') {
        // Timeout error - mark as error in database
        if (docId) {
          await markDocumentAsError(
            docId,
            `Upload timeout after ${uploadTimeout / 1000}s`,
            {
              userId: session.user.id,
              filename: sanitizedFilename,
            }
          );
        }

        return NextResponse.json(
          {
            success: false,
            error: `Document processing timeout after ${uploadTimeout / 1000}s - file may be too large or complex`,
            suggestion: 'Try uploading a smaller file or splitting the document',
          },
          { status: 408 }
        );
      }

      throw error;
    }
  } catch (error) {
    const duration = Date.now() - startTime;

    await logError(
      'Knowledge base upload failed',
      error,
      {
        userId: session?.user?.id,
        crewId: id,
        docId,
        filename: file?.name,
        fileSize: file?.size,
        duration,
      }
    );

    // Complete rollback: delete metadata AND vector chunks if they exist
    if (docId && crew) {
      try {
        const crewConfig = crew.config as CrewConfig;
        await rollbackDocument(
          docId,
          crewConfig.vectorTableName,
          {
            userId: session?.user?.id || 'unknown',
            filename: file?.name || 'unknown',
            crewId: crew.id,
          }
        );
      } catch (rollbackError) {
        // Rollback failed - already logged in rollbackDocument
        // Continue to return error response
      }
    }

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to upload document',
        ...(process.env.NODE_ENV === 'development' && {
          details: error instanceof Error ? error.message : 'Unknown error',
        }),
      },
      { status: 500 }
    );
  }
}
```

---

## Phase 4: Testing Strategy

### 4.1 Unit Tests

**File**: `__tests__/lib/utils/file-validator-enhanced.test.ts`

```typescript
import { describe, it, expect } from '@jest/globals';
import {
  validateFile,
  sanitizeFilename,
  getFileExtension,
} from '@/lib/utils/file-validator-enhanced';

describe('File Validator Enhanced', () => {
  describe('sanitizeFilename', () => {
    it('should remove path traversal attempts', () => {
      expect(sanitizeFilename('../../../etc/passwd')).toBe('_etc_passwd');
    });

    it('should replace special characters', () => {
      expect(sanitizeFilename('file<>:|?.txt')).toBe('file_____.txt');
    });

    it('should handle hidden files', () => {
      expect(sanitizeFilename('.hidden')).toBe('_.hidden');
    });

    it('should preserve valid filenames', () => {
      expect(sanitizeFilename('document.pdf')).toBe('document.pdf');
    });

    it('should handle empty names', () => {
      expect(sanitizeFilename('')).toBe('unnamed_file');
    });
  });

  describe('validateFile', () => {
    it('should reject files over size limit', async () => {
      const largeFile = new File(['x'.repeat(11 * 1024 * 1024)], 'large.pdf', {
        type: 'application/pdf',
      });

      const result = await validateFile(largeFile);
      expect(result.valid).toBe(false);
      expect(result.error).toContain('exceeds maximum');
    });

    it('should reject empty files', async () => {
      const emptyFile = new File([], 'empty.pdf', {
        type: 'application/pdf',
      });

      const result = await validateFile(emptyFile);
      expect(result.valid).toBe(false);
      expect(result.error).toBe('File is empty');
    });

    it('should reject unsupported file types', async () => {
      const exeFile = new File(['fake content'], 'malware.exe', {
        type: 'application/x-msdownload',
      });

      const result = await validateFile(exeFile);
      expect(result.valid).toBe(false);
      expect(result.error).toContain('not supported');
    });
  });
});
```

---

### 4.2 Integration Tests

**File**: `__tests__/api/knowledge-base/upload.test.ts`

```typescript
import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import { POST } from '@/app/api/crews/[id]/knowledge-base/route';
import { db } from '@/db';
import { knowledgeBaseDocuments } from '@/db/schema';
import { eq } from 'drizzle-orm';

describe('POST /api/crews/[id]/knowledge-base', () => {
  let testCrewId: string;
  let testUserId: string;

  beforeEach(async () => {
    // Setup test data
    // Create test crew, user, etc.
  });

  afterEach(async () => {
    // Cleanup test data
  });

  it('should successfully upload a valid PDF file', async () => {
    const formData = new FormData();
    const pdfContent = '%PDF-1.4\n...'; // Valid PDF content
    const file = new File([pdfContent], 'test.pdf', {
      type: 'application/pdf',
    });
    formData.append('file', file);

    const request = new Request('http://localhost:3000/api/test', {
      method: 'POST',
      body: formData,
    });

    const params = Promise.resolve({ id: testCrewId });
    const response = await POST(request, { params });

    expect(response.status).toBe(200);

    const data = await response.json();
    expect(data.success).toBe(true);
    expect(data.data.docId).toBeDefined();

    // Verify database record
    const [doc] = await db
      .select()
      .from(knowledgeBaseDocuments)
      .where(eq(knowledgeBaseDocuments.docId, data.data.docId))
      .limit(1);

    expect(doc).toBeDefined();
    expect(doc.status).toBe('indexed');
  });

  it('should reject files over size limit', async () => {
    const formData = new FormData();
    const largeContent = 'x'.repeat(11 * 1024 * 1024);
    const file = new File([largeContent], 'large.pdf', {
      type: 'application/pdf',
    });
    formData.append('file', file);

    const request = new Request('http://localhost:3000/api/test', {
      method: 'POST',
      body: formData,
    });

    const params = Promise.resolve({ id: testCrewId });
    const response = await POST(request, { params });

    expect(response.status).toBe(400);

    const data = await response.json();
    expect(data.success).toBe(false);
    expect(data.error).toContain('exceeds maximum');
  });

  it('should rollback on n8n failure', async () => {
    // Mock n8n to fail
    // ... test implementation

    // Verify no orphaned records
    const docs = await db
      .select()
      .from(knowledgeBaseDocuments)
      .where(eq(knowledgeBaseDocuments.crewId, testCrewId));

    expect(docs.length).toBe(0);
  });

  it('should enforce rate limits', async () => {
    // Upload 10 files quickly
    // ... test implementation

    // 11th upload should fail
    const response = await POST(request, { params });
    expect(response.status).toBe(429);
  });
});
```

---

## Phase 5: Environment Configuration

### 5.1 Environment Variables

**File**: `.env.example` (add these)

```bash
# N8N Configuration
N8N_API_KEY=your-api-key-here
N8N_DOCUMENT_UPLOAD_WEBHOOK=https://your-n8n-instance.com/webhook/upload
N8N_UPLOAD_TIMEOUT=120000  # 2 minutes in milliseconds

# Rate Limiting
RATE_LIMIT_ENABLED=true
UPLOAD_RATE_LIMIT_MAX=10
UPLOAD_RATE_LIMIT_WINDOW_MS=3600000  # 1 hour

# Logging
LOG_LEVEL=info  # debug, info, warn, error
ENABLE_EXTERNAL_LOGGING=false
SENTRY_DSN=  # Optional: for Sentry integration

# File Upload
MAX_FILE_SIZE_MB=10
ALLOWED_FILE_TYPES=pdf,docx,txt,md,csv,xlsx
```

---

### 5.2 Validated Environment Config

**File**: `lib/config/env.ts`

```typescript
import { z } from 'zod';

const envSchema = z.object({
  // N8N
  N8N_API_KEY: z.string().min(1, 'N8N_API_KEY is required'),
  N8N_DOCUMENT_UPLOAD_WEBHOOK: z
    .string()
    .url('N8N_DOCUMENT_UPLOAD_WEBHOOK must be a valid URL'),
  N8N_UPLOAD_TIMEOUT: z
    .string()
    .regex(/^\d+$/)
    .transform(Number)
    .default('120000'),

  // Rate Limiting
  RATE_LIMIT_ENABLED: z
    .string()
    .transform((val) => val === 'true')
    .default('true'),
  UPLOAD_RATE_LIMIT_MAX: z
    .string()
    .regex(/^\d+$/)
    .transform(Number)
    .default('10'),
  UPLOAD_RATE_LIMIT_WINDOW_MS: z
    .string()
    .regex(/^\d+$/)
    .transform(Number)
    .default('3600000'),

  // Logging
  LOG_LEVEL: z
    .enum(['debug', 'info', 'warn', 'error'])
    .default('info'),
  ENABLE_EXTERNAL_LOGGING: z
    .string()
    .transform((val) => val === 'true')
    .default('false'),

  // Database
  POSTGRES_URL: z.string().min(1, 'POSTGRES_URL is required'),
});

export type Env = z.infer<typeof envSchema>;

function validateEnv(): Env {
  try {
    return envSchema.parse({
      N8N_API_KEY: process.env.N8N_API_KEY,
      N8N_DOCUMENT_UPLOAD_WEBHOOK: process.env.N8N_DOCUMENT_UPLOAD_WEBHOOK,
      N8N_UPLOAD_TIMEOUT: process.env.N8N_UPLOAD_TIMEOUT,
      RATE_LIMIT_ENABLED: process.env.RATE_LIMIT_ENABLED,
      UPLOAD_RATE_LIMIT_MAX: process.env.UPLOAD_RATE_LIMIT_MAX,
      UPLOAD_RATE_LIMIT_WINDOW_MS: process.env.UPLOAD_RATE_LIMIT_WINDOW_MS,
      LOG_LEVEL: process.env.LOG_LEVEL,
      ENABLE_EXTERNAL_LOGGING: process.env.ENABLE_EXTERNAL_LOGGING,
      POSTGRES_URL: process.env.POSTGRES_URL,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      const issues = error.errors.map((e) => `  - ${e.path.join('.')}: ${e.message}`).join('\n');
      throw new Error(`Environment validation failed:\n${issues}`);
    }
    throw error;
  }
}

// Validate on import (fail fast at startup)
export const env = validateEnv();
```

---

## Phase 6: Monitoring & Observability

### 6.1 Health Check Endpoint

**File**: `app/api/health/route.ts`

```typescript
import { NextResponse } from 'next/server';
import { db } from '@/db';
import { sql } from 'drizzle-orm';

export async function GET() {
  try {
    // Check database connection
    await db.execute(sql`SELECT 1`);

    return NextResponse.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      services: {
        database: 'up',
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        services: {
          database: 'down',
        },
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 503 }
    );
  }
}
```

---

## Implementation Checklist

### Phase 1: Core Infrastructure (Day 1)
- [ ] Create `lib/utils/logger.ts`
- [ ] Create `lib/utils/rate-limiter.ts`
- [ ] Create `lib/utils/file-validator-enhanced.ts`
- [ ] Update `.env.example` and `.env.local`
- [ ] Create `lib/config/env.ts` and validate environment

### Phase 2: Transaction Safety (Day 1-2)
- [ ] Create `lib/db/transaction-helpers.ts`
- [ ] Create `lib/services/knowledge-base-service.ts`
- [ ] Update `lib/db/knowledge-base.ts` (fix deleteDocument order)

### Phase 3: Refactor API Routes (Day 2)
- [ ] Update POST handler in `app/api/crews/[id]/knowledge-base/route.ts`
- [ ] Test rate limiting
- [ ] Test file validation
- [ ] Test transaction rollback

### Phase 4: Testing (Day 2-3)
- [ ] Write unit tests for file validator
- [ ] Write unit tests for rate limiter
- [ ] Write integration tests for upload endpoint
- [ ] Write tests for transaction scenarios

### Phase 5: Monitoring (Day 3)
- [ ] Create health check endpoint
- [ ] Set up error tracking (Sentry/similar)
- [ ] Test structured logging output
- [ ] Create alerts for critical errors

### Phase 6: Documentation & Deployment
- [ ] Update API documentation
- [ ] Create runbook for common issues
- [ ] Deploy to staging
- [ ] Monitor logs for 24 hours
- [ ] Deploy to production

---

## Rollback Plan

If issues are discovered after deployment:

1. **Immediate Rollback**: Revert to previous version
2. **Rate Limiter Issues**: Disable via `RATE_LIMIT_ENABLED=false`
3. **Transaction Issues**: Reduce `maxRetries` to 0 to fail fast
4. **File Validation Issues**: Temporarily disable content validation

---

## Success Metrics

### Performance
- Transaction success rate > 99.9%
- Average upload time < 30s
- Rollback success rate > 99%

### Security
- Zero malicious file uploads detected
- Rate limit effectiveness > 95%
- No path traversal attempts succeed

### Reliability
- Zero orphaned database records
- Zero data inconsistencies
- All errors properly logged and tracked

---

## Future Enhancements

1. **Distributed Rate Limiting**: Replace in-memory with Redis
2. **Async Processing**: Move n8n upload to background queue
3. **Progress Tracking**: WebSocket updates for long uploads
4. **Retry Queue**: Automatic retry for failed uploads
5. **Metrics Dashboard**: Real-time upload statistics

---

## Conclusion

This plan transforms the knowledge base implementation from "functionally correct" to "production-grade" by adding:
- ✅ **Transaction safety** with automatic retry
- ✅ **Complete rollback** on failures
- ✅ **Structured logging** for debugging
- ✅ **Rate limiting** to prevent abuse
- ✅ **Enhanced file validation** for security
- ✅ **Comprehensive testing** for confidence

**Estimated effort**: 2-3 developer days
**Risk**: Low (additive changes only)
**Impact**: High (prevents data loss and security issues)
