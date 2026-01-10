/**
 * API Route Test Helpers
 *
 * Utilities for testing Next.js API routes with mocked dependencies.
 *
 * @jest-environment node
 */

import { NextRequest } from 'next/server';

/**
 * Create a mock NextRequest for testing
 */
export function createMockRequest({
  method = 'GET',
  url = 'http://localhost:3000/api/test',
  body = null,
  searchParams = {},
}: {
  method?: string;
  url?: string;
  body?: any;
  searchParams?: Record<string, string>;
} = {}): NextRequest {
  const urlWithParams = new URL(url);
  Object.entries(searchParams).forEach(([key, value]) => {
    urlWithParams.searchParams.set(key, value);
  });

  const request = new NextRequest(urlWithParams, {
    method,
    body: body ? JSON.stringify(body) : null,
    headers: body
      ? {
          'Content-Type': 'application/json',
        }
      : undefined,
  });

  return request;
}

/**
 * Mock database module with jest
 */
export function mockDatabase() {
  return {
    select: jest.fn().mockReturnThis(),
    from: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    limit: jest.fn().mockReturnThis(),
    orderBy: jest.fn().mockReturnThis(),
    insert: jest.fn().mockReturnThis(),
    values: jest.fn().mockReturnThis(),
    returning: jest.fn().mockReturnThis(),
    update: jest.fn().mockReturnThis(),
    set: jest.fn().mockReturnThis(),
    delete: jest.fn().mockReturnThis(),
  };
}

/**
 * Parse NextResponse for testing
 */
export async function parseResponse(response: Response) {
  const json = await response.json();
  return {
    status: response.status,
    body: json,
  };
}

/**
 * Mock auth helpers
 */
export const mockAuthHelpers = {
  requireAuth: jest.fn(),
  isSuperAdmin: jest.fn(),
  getSession: jest.fn(),
};

/**
 * Mock ErrorCodes for API route tests
 * Must match the structure in lib/errors/error-codes.ts
 */
export const mockErrorCodes = {
  INTERNAL_ERROR: {
    code: 'INTERNAL_ERROR',
    status: 500,
    message: 'Internal server error',
  },
  PERMISSION_SUPER_ADMIN_REQUIRED: {
    code: 'PERMISSION_SUPER_ADMIN_REQUIRED',
    status: 403,
    message: 'SuperAdmin access required',
  },
  VALIDATION_INVALID_INPUT: {
    code: 'VALIDATION_INVALID_INPUT',
    status: 400,
    message: 'Invalid input data',
  },
  CLIENT_NOT_FOUND: {
    code: 'CLIENT_NOT_FOUND',
    status: 404,
    message: 'Client not found',
  },
  USER_ALREADY_EXISTS: {
    code: 'USER_ALREADY_EXISTS',
    status: 409,
    message: 'A user with this email already exists',
  },
  CLIENT_ALREADY_EXISTS: {
    code: 'CLIENT_ALREADY_EXISTS',
    status: 409,
    message: 'A client with this code already exists',
  },
};
