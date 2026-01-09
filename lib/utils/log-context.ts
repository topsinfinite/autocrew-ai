import type { LogContext } from './logger';
import type { NextRequest } from 'next/server';

/**
 * Sanitize PII (Personally Identifiable Information) from data
 * Masks emails and redacts sensitive fields
 */
export function sanitizePII<T = any>(data: T): T {
  if (!data || typeof data !== 'object') {
    return data;
  }

  // Fields that should be completely redacted
  const sensitiveFields = [
    'password',
    'token',
    'secret',
    'apiKey',
    'api_key',
    'accessToken',
    'access_token',
    'refreshToken',
    'refresh_token',
    'privateKey',
    'private_key',
    'creditCard',
    'credit_card',
    'ssn',
    'socialSecurity',
  ];

  // Fields that should be masked (e.g., emails)
  const maskFields = ['email', 'emailAddress', 'email_address'];

  const sanitize = (obj: any): any => {
    if (Array.isArray(obj)) {
      return obj.map(sanitize);
    }

    if (obj && typeof obj === 'object') {
      const sanitized: any = {};

      for (const [key, value] of Object.entries(obj)) {
        const lowerKey = key.toLowerCase();

        // Check if field should be redacted
        if (sensitiveFields.some((field) => lowerKey.includes(field.toLowerCase()))) {
          sanitized[key] = '[REDACTED]';
          continue;
        }

        // Check if field should be masked (emails)
        if (maskFields.some((field) => lowerKey.includes(field.toLowerCase()))) {
          if (typeof value === 'string') {
            sanitized[key] = maskEmail(value);
          } else {
            sanitized[key] = value;
          }
          continue;
        }

        // Recursively sanitize nested objects
        if (typeof value === 'object' && value !== null) {
          sanitized[key] = sanitize(value);
        } else {
          sanitized[key] = value;
        }
      }

      return sanitized;
    }

    return obj;
  };

  return sanitize(data);
}

/**
 * Mask email address (show first char and domain)
 * Example: john.doe@example.com -> j****@example.com
 */
export function maskEmail(email: string): string {
  if (!email || typeof email !== 'string') {
    return email;
  }

  const emailRegex = /^(.)[^@]*(@.+)$/;
  const match = email.match(emailRegex);

  if (match) {
    return `${match[1]}****${match[2]}`;
  }

  return email;
}

/**
 * Extract user context from Better Auth session
 */
export function extractUserContext(session: any): Pick<LogContext, 'userId' | 'organizationId'> {
  if (!session || !session.user) {
    return {};
  }

  return {
    userId: session.user.id,
    organizationId: session.user.activeOrganizationId,
  };
}

/**
 * Extract request context from Next.js request
 */
export function extractRequestContext(request: NextRequest): Pick<LogContext, 'path' | 'method' | 'requestId'> {
  return {
    path: request.nextUrl.pathname,
    method: request.method,
    requestId: request.headers.get('x-request-id') || undefined,
  };
}

/**
 * Format duration in human-readable format
 */
export function formatDuration(ms: number): string {
  if (ms < 1000) {
    return `${ms}ms`;
  }

  if (ms < 60000) {
    return `${(ms / 1000).toFixed(2)}s`;
  }

  const minutes = Math.floor(ms / 60000);
  const seconds = ((ms % 60000) / 1000).toFixed(0);
  return `${minutes}m ${seconds}s`;
}

/**
 * Create error context from Error object
 */
export function errorToContext(error: unknown): Record<string, any> {
  if (error instanceof Error) {
    return {
      errorName: error.name,
      errorMessage: error.message,
      errorCode: (error as any).code,
      errorStack: error.stack?.split('\n').slice(0, 5).join('\n'), // First 5 lines
    };
  }

  return {
    error: String(error),
  };
}

/**
 * Merge multiple context objects, sanitizing PII
 */
export function mergeContext(...contexts: (LogContext | undefined)[]): LogContext {
  const merged = contexts.reduce((acc, ctx) => {
    if (!ctx) return acc;
    return { ...acc, ...ctx };
  }, {} as LogContext);

  return sanitizePII(merged) as LogContext;
}
