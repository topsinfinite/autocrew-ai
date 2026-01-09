/**
 * Standardized error code system for API responses
 * Maps error codes to HTTP status codes and user-friendly messages
 */

export interface ErrorCode {
  code: string;
  status: number;
  message: string;
}

/**
 * Standardized error codes for the application
 * Format: CATEGORY_SPECIFIC_ERROR
 */
export const ErrorCodes = {
  // ============================================
  // Authentication Errors (401)
  // ============================================
  AUTH_REQUIRED: {
    code: 'AUTH_REQUIRED',
    status: 401,
    message: 'Authentication required',
  },
  AUTH_INVALID_SESSION: {
    code: 'AUTH_INVALID_SESSION',
    status: 401,
    message: 'Invalid or expired session',
  },
  AUTH_INVALID_CREDENTIALS: {
    code: 'AUTH_INVALID_CREDENTIALS',
    status: 401,
    message: 'Invalid credentials',
  },
  AUTH_TOKEN_EXPIRED: {
    code: 'AUTH_TOKEN_EXPIRED',
    status: 401,
    message: 'Authentication token has expired',
  },

  // ============================================
  // Authorization/Permission Errors (403)
  // ============================================
  PERMISSION_DENIED: {
    code: 'PERMISSION_DENIED',
    status: 403,
    message: 'Permission denied',
  },
  PERMISSION_SUPER_ADMIN_REQUIRED: {
    code: 'PERMISSION_SUPER_ADMIN_REQUIRED',
    status: 403,
    message: 'SuperAdmin access required',
  },
  PERMISSION_CLIENT_MISMATCH: {
    code: 'PERMISSION_CLIENT_MISMATCH',
    status: 403,
    message: 'Access denied - You can only access resources from your organization',
  },
  PERMISSION_INSUFFICIENT_ROLE: {
    code: 'PERMISSION_INSUFFICIENT_ROLE',
    status: 403,
    message: 'Insufficient role permissions',
  },

  // ============================================
  // Validation Errors (400)
  // ============================================
  VALIDATION_FAILED: {
    code: 'VALIDATION_FAILED',
    status: 400,
    message: 'Validation failed',
  },
  VALIDATION_INVALID_INPUT: {
    code: 'VALIDATION_INVALID_INPUT',
    status: 400,
    message: 'Invalid input data',
  },
  VALIDATION_MISSING_FIELD: {
    code: 'VALIDATION_MISSING_FIELD',
    status: 400,
    message: 'Required field is missing',
  },
  VALIDATION_FILE_TOO_LARGE: {
    code: 'VALIDATION_FILE_TOO_LARGE',
    status: 400,
    message: 'File exceeds maximum size',
  },
  VALIDATION_FILE_TYPE_INVALID: {
    code: 'VALIDATION_FILE_TYPE_INVALID',
    status: 400,
    message: 'File type is not supported',
  },
  VALIDATION_INVALID_FORMAT: {
    code: 'VALIDATION_INVALID_FORMAT',
    status: 400,
    message: 'Invalid format',
  },

  // ============================================
  // Not Found Errors (404)
  // ============================================
  NOT_FOUND: {
    code: 'NOT_FOUND',
    status: 404,
    message: 'Resource not found',
  },
  CLIENT_NOT_FOUND: {
    code: 'CLIENT_NOT_FOUND',
    status: 404,
    message: 'Client not found',
  },
  CREW_NOT_FOUND: {
    code: 'CREW_NOT_FOUND',
    status: 404,
    message: 'Crew not found',
  },
  CONVERSATION_NOT_FOUND: {
    code: 'CONVERSATION_NOT_FOUND',
    status: 404,
    message: 'Conversation not found',
  },
  DOCUMENT_NOT_FOUND: {
    code: 'DOCUMENT_NOT_FOUND',
    status: 404,
    message: 'Document not found',
  },
  USER_NOT_FOUND: {
    code: 'USER_NOT_FOUND',
    status: 404,
    message: 'User not found',
  },

  // ============================================
  // Conflict Errors (409)
  // ============================================
  CONFLICT: {
    code: 'CONFLICT',
    status: 409,
    message: 'Resource already exists',
  },
  CLIENT_ALREADY_EXISTS: {
    code: 'CLIENT_ALREADY_EXISTS',
    status: 409,
    message: 'A client with this code already exists',
  },
  USER_ALREADY_EXISTS: {
    code: 'USER_ALREADY_EXISTS',
    status: 409,
    message: 'A user with this email already exists',
  },
  CREW_ALREADY_EXISTS: {
    code: 'CREW_ALREADY_EXISTS',
    status: 409,
    message: 'A crew with this code already exists',
  },

  // ============================================
  // Database Errors (500)
  // ============================================
  DB_ERROR: {
    code: 'DB_ERROR',
    status: 500,
    message: 'Database error',
  },
  DB_CONNECTION_FAILED: {
    code: 'DB_CONNECTION_FAILED',
    status: 500,
    message: 'Database connection failed',
  },
  DB_TRANSACTION_FAILED: {
    code: 'DB_TRANSACTION_FAILED',
    status: 500,
    message: 'Database transaction failed',
  },
  DB_CONSTRAINT_VIOLATION: {
    code: 'DB_CONSTRAINT_VIOLATION',
    status: 409,
    message: 'Database constraint violation',
  },
  DB_QUERY_FAILED: {
    code: 'DB_QUERY_FAILED',
    status: 500,
    message: 'Database query failed',
  },

  // ============================================
  // External Service Errors (502, 504)
  // ============================================
  EXTERNAL_SERVICE_ERROR: {
    code: 'EXTERNAL_SERVICE_ERROR',
    status: 502,
    message: 'External service error',
  },
  EXTERNAL_N8N_ERROR: {
    code: 'EXTERNAL_N8N_ERROR',
    status: 502,
    message: 'n8n service error',
  },
  EXTERNAL_N8N_TIMEOUT: {
    code: 'EXTERNAL_N8N_TIMEOUT',
    status: 504,
    message: 'n8n processing timeout',
  },
  EXTERNAL_EMAIL_ERROR: {
    code: 'EXTERNAL_EMAIL_ERROR',
    status: 502,
    message: 'Email service error',
  },

  // ============================================
  // Rate Limiting (429)
  // ============================================
  RATE_LIMIT_EXCEEDED: {
    code: 'RATE_LIMIT_EXCEEDED',
    status: 429,
    message: 'Rate limit exceeded - Please try again later',
  },
  UPLOAD_RATE_LIMIT_EXCEEDED: {
    code: 'UPLOAD_RATE_LIMIT_EXCEEDED',
    status: 429,
    message: 'Upload rate limit exceeded - Too many uploads',
  },

  // ============================================
  // Timeout Errors (408, 504)
  // ============================================
  TIMEOUT: {
    code: 'TIMEOUT',
    status: 408,
    message: 'Request timeout',
  },
  UPLOAD_TIMEOUT: {
    code: 'UPLOAD_TIMEOUT',
    status: 408,
    message: 'Upload timeout - File may be too large or complex',
  },

  // ============================================
  // Internal Server Errors (500)
  // ============================================
  INTERNAL_ERROR: {
    code: 'INTERNAL_ERROR',
    status: 500,
    message: 'Internal server error',
  },
  CONFIGURATION_ERROR: {
    code: 'CONFIGURATION_ERROR',
    status: 500,
    message: 'Server configuration error',
  },
  PROVISIONING_FAILED: {
    code: 'PROVISIONING_FAILED',
    status: 500,
    message: 'Resource provisioning failed',
  },
} as const;

/**
 * Type for error code keys
 */
export type ErrorCodeKey = keyof typeof ErrorCodes;

/**
 * Get error code by key
 */
export function getErrorCode(key: ErrorCodeKey): ErrorCode {
  return ErrorCodes[key];
}

/**
 * Check if an error code exists
 */
export function isValidErrorCode(code: string): boolean {
  return Object.values(ErrorCodes).some((ec) => ec.code === code);
}

/**
 * Map PostgreSQL error codes to application error codes
 */
export function mapDatabaseError(dbError: any): ErrorCode {
  const pgCode = dbError.code || dbError.cause?.code;

  switch (pgCode) {
    case '23505': // unique_violation
      return ErrorCodes.DB_CONSTRAINT_VIOLATION;
    case '23503': // foreign_key_violation
      return ErrorCodes.DB_CONSTRAINT_VIOLATION;
    case '23502': // not_null_violation
      return ErrorCodes.VALIDATION_MISSING_FIELD;
    case '40001': // serialization_failure
      return ErrorCodes.DB_TRANSACTION_FAILED;
    case '08000': // connection_exception
    case '08003': // connection_does_not_exist
    case '08006': // connection_failure
      return ErrorCodes.DB_CONNECTION_FAILED;
    case '42P01': // undefined_table
      return ErrorCodes.DB_ERROR;
    default:
      return ErrorCodes.DB_ERROR;
  }
}
