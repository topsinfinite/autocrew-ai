// Runtime environment detection
const isServer = typeof window === 'undefined';

export enum LogLevel {
  DEBUG = 'debug',
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error',
}

export interface LogContext {
  userId?: string | null;
  crewId?: string | null;
  docId?: string | null;
  clientId?: string | null;
  organizationId?: string | null;
  filename?: string | null;
  fileSize?: number | null;
  operation?: string | null;
  duration?: number | null;
  requestId?: string | null;
  path?: string | null;
  method?: string | null;
  statusCode?: number | null;
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
  environment: string;
}

class Logger {
  private isDevelopment = process.env.NODE_ENV === 'development';
  private isProduction = process.env.NODE_ENV === 'production';
  private logLevel: LogLevel;
  private logToFile = isServer && process.env.LOG_TO_FILE === 'true';
  private logFilePath = process.env.LOG_FILE_PATH || './logs';

  constructor() {
    // Set log level from environment or default to INFO
    const envLogLevel = process.env.LOG_LEVEL?.toLowerCase() as LogLevel;
    this.logLevel = envLogLevel || LogLevel.INFO;
  }

  /**
   * Get request ID from headers for tracing (server-side only)
   */
  private async getRequestId(): Promise<string | undefined> {
    // Only attempt to get headers on the server
    if (!isServer) {
      return undefined;
    }

    try {
      // Dynamic import to avoid bundling on client
      const { headers } = await import('next/headers');
      const headersList = await headers();
      return headersList.get('x-request-id') || undefined;
    } catch {
      // Not in request context (e.g., background job) or failed to load
      return undefined;
    }
  }

  /**
   * Check if log level should be logged
   */
  private shouldLog(level: LogLevel): boolean {
    const levels = [LogLevel.DEBUG, LogLevel.INFO, LogLevel.WARN, LogLevel.ERROR];
    const currentLevelIndex = levels.indexOf(this.logLevel);
    const messageLevelIndex = levels.indexOf(level);
    return messageLevelIndex >= currentLevelIndex;
  }

  /**
   * Format log entry for output
   */
  private formatLog(entry: LogEntry): string {
    // Pretty print in development
    if (this.isDevelopment && process.env.LOG_PRETTY_PRINT !== 'false') {
      return JSON.stringify(entry, null, 2);
    }
    // Compact JSON in production
    return JSON.stringify(entry);
  }

  /**
   * Write log to file (server-side only)
   */
  private async writeToFile(entry: LogEntry): Promise<void> {
    // Only write to file on server
    if (!isServer || !this.logToFile) {
      return;
    }

    try {
      const fs = await import('fs/promises');
      const path = await import('path');

      // Create logs directory if it doesn't exist
      await fs.mkdir(this.logFilePath, { recursive: true });

      // Create filename based on date and log level
      const date = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
      const filename = path.join(this.logFilePath, `${date}-${entry.level}.log`);

      // Append log entry
      await fs.appendFile(filename, this.formatLog(entry) + '\n');
    } catch (error) {
      // Don't throw, just log to console
      console.error('Failed to write log to file:', error);
    }
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
    // Check if we should log this level
    if (!this.shouldLog(level)) {
      return;
    }

    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      context,
      requestId: await this.getRequestId(),
      environment: process.env.NODE_ENV || 'development',
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
        console.debug(formattedLog);
        break;
    }

    // Write to file (async, don't wait) - server-side only
    if (isServer) {
      this.writeToFile(entry).catch((err) => {
        console.error('Failed to write log to file:', err);
      });
    }
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
