import { NextResponse } from 'next/server';
import type { ErrorCode } from '@/lib/errors/error-codes';

/**
 * Standard API response format for successful operations
 */
export interface SuccessResponse<T = any> {
  success: true;
  data: T;
  message?: string;
  requestId?: string;
}

/**
 * Standard API response format for errors
 */
export interface ErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: unknown;
    requestId?: string;
  };
}

/**
 * Paginated response metadata
 */
export interface PaginationMeta {
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

/**
 * Paginated response format
 */
export interface PaginatedResponse<T = any> {
  success: true;
  data: T[];
  pagination: PaginationMeta;
  requestId?: string;
}

/**
 * Create a successful API response
 *
 * @param data - The data to return
 * @param message - Optional success message
 * @param requestId - Optional request ID for tracing
 * @returns NextResponse with success format
 *
 * @example
 * return successResponse({ user: { id: '123', name: 'John' } });
 * return successResponse(clients, 'Clients fetched successfully');
 */
export function successResponse<T = any>(
  data: T,
  message?: string,
  requestId?: string | null
): NextResponse<SuccessResponse<T>> {
  const response: SuccessResponse<T> = {
    success: true,
    data,
  };

  if (message) {
    response.message = message;
  }

  if (requestId) {
    response.requestId = requestId;
  }

  return NextResponse.json(response);
}

/**
 * Create a paginated API response
 *
 * @param data - Array of items
 * @param pagination - Pagination metadata
 * @param requestId - Optional request ID for tracing
 * @returns NextResponse with paginated format
 *
 * @example
 * return paginatedResponse(
 *   clients,
 *   { page: 1, pageSize: 10, totalCount: 45, totalPages: 5, hasNextPage: true, hasPreviousPage: false }
 * );
 */
export function paginatedResponse<T = any>(
  data: T[],
  pagination: PaginationMeta,
  requestId?: string | null
): NextResponse<PaginatedResponse<T>> {
  const response: PaginatedResponse<T> = {
    success: true,
    data,
    pagination,
  };

  if (requestId) {
    response.requestId = requestId;
  }

  return NextResponse.json(response);
}

/**
 * Create an error API response
 *
 * @param errorCode - Standardized error code
 * @param details - Additional error details (only included in development)
 * @param requestId - Optional request ID for tracing
 * @returns NextResponse with error format and appropriate HTTP status
 *
 * @example
 * return errorResponse(ErrorCodes.AUTH_REQUIRED, null, requestId);
 * return errorResponse(ErrorCodes.VALIDATION_FAILED, validationErrors, requestId);
 */
export function errorResponse(
  errorCode: ErrorCode,
  details?: unknown,
  requestId?: string | null
): NextResponse<ErrorResponse> {
  const isDevelopment = process.env.NODE_ENV === 'development';

  const response: ErrorResponse = {
    success: false,
    error: {
      code: errorCode.code,
      message: errorCode.message,
    },
  };

  // Include details only in development mode
  if (isDevelopment && details) {
    // Sanitize error details
    if (details instanceof Error) {
      response.error.details = {
        name: details.name,
        message: details.message,
        stack: details.stack?.split('\n').slice(0, 10), // First 10 lines
        cause: details.cause,
      };
    } else {
      response.error.details = details;
    }
  }

  if (requestId) {
    response.error.requestId = requestId;
  }

  return NextResponse.json(response, {
    status: errorCode.status,
  });
}

/**
 * Create an error response with custom headers (e.g., for rate limiting)
 *
 * @param errorCode - Standardized error code
 * @param headers - Custom headers to include
 * @param details - Additional error details (only included in development)
 * @param requestId - Optional request ID for tracing
 * @returns NextResponse with error format and custom headers
 *
 * @example
 * return errorResponseWithHeaders(
 *   ErrorCodes.RATE_LIMIT_EXCEEDED,
 *   {
 *     'Retry-After': '60',
 *     'X-RateLimit-Remaining': '0',
 *     'X-RateLimit-Reset': resetDate.toISOString(),
 *   },
 *   null,
 *   requestId
 * );
 */
export function errorResponseWithHeaders(
  errorCode: ErrorCode,
  headers: Record<string, string>,
  details?: unknown,
  requestId?: string | null
): NextResponse<ErrorResponse> {
  const isDevelopment = process.env.NODE_ENV === 'development';

  const response: ErrorResponse = {
    success: false,
    error: {
      code: errorCode.code,
      message: errorCode.message,
    },
  };

  if (isDevelopment && details) {
    if (details instanceof Error) {
      response.error.details = {
        name: details.name,
        message: details.message,
        stack: details.stack?.split('\n').slice(0, 10),
        cause: details.cause,
      };
    } else {
      response.error.details = details;
    }
  }

  if (requestId) {
    response.error.requestId = requestId;
  }

  return NextResponse.json(response, {
    status: errorCode.status,
    headers,
  });
}

/**
 * Helper to calculate pagination metadata
 *
 * @param page - Current page number (1-indexed)
 * @param pageSize - Number of items per page
 * @param totalCount - Total number of items
 * @returns Pagination metadata
 *
 * @example
 * const pagination = calculatePagination(1, 10, 45);
 * // { page: 1, pageSize: 10, totalCount: 45, totalPages: 5, hasNextPage: true, hasPreviousPage: false }
 */
export function calculatePagination(
  page: number,
  pageSize: number,
  totalCount: number
): PaginationMeta {
  const totalPages = Math.ceil(totalCount / pageSize);

  return {
    page,
    pageSize,
    totalCount,
    totalPages,
    hasNextPage: page < totalPages,
    hasPreviousPage: page > 1,
  };
}
