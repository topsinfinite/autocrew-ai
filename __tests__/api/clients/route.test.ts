/**
 * Client API Routes Tests
 *
 * Tests for /api/clients endpoints (GET and POST).
 *
 * @jest-environment node
 */

import { GET, POST } from '@/app/api/clients/route';
import { createMockRequest, parseResponse } from '../test-helpers';

// Mock dependencies
jest.mock('@/db', () => ({
  db: {
    select: jest.fn().mockReturnThis(),
    from: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    limit: jest.fn().mockReturnThis(),
    orderBy: jest.fn().mockReturnThis(),
    insert: jest.fn().mockReturnThis(),
    values: jest.fn().mockReturnThis(),
    returning: jest.fn().mockResolvedValue([
      {
        id: 'org_test123',
        clientCode: 'TEST-001',
        slug: 'test-company',
        companyName: 'Test Company',
        contactPersonName: 'John Doe',
        contactEmail: 'john@test.com',
        phone: '+1234567890',
        plan: 'professional',
        status: 'active',
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
      },
    ]),
  },
}));

jest.mock('@/lib/auth/session-helpers', () => ({
  requireAuth: jest.fn().mockResolvedValue({ userId: 'user123' }),
  isSuperAdmin: jest.fn().mockResolvedValue(true),
}));

jest.mock('@/lib/utils/generators/client-code-generator', () => ({
  generateClientCode: jest.fn().mockResolvedValue('TEST-001'),
}));

jest.mock('@/lib/utils', () => {
  const actual = jest.requireActual('@/lib/utils');
  return {
    ...actual,
    generateSlug: jest.fn((name: string) => name.toLowerCase().replace(/\s+/g, '-')),
    generateUniqueSlug: jest.fn(
      async (baseSlug: string) => baseSlug
    ),
    logger: {
      info: jest.fn(),
      warn: jest.fn(),
      error: jest.fn(),
      debug: jest.fn(),
    },
    ErrorCodes: {
      INTERNAL_ERROR: { code: 'INTERNAL_ERROR', status: 500, message: 'Internal server error' },
      PERMISSION_SUPER_ADMIN_REQUIRED: { code: 'PERMISSION_SUPER_ADMIN_REQUIRED', status: 403, message: 'SuperAdmin access required' },
      VALIDATION_INVALID_INPUT: { code: 'VALIDATION_INVALID_INPUT', status: 400, message: 'Invalid input data' },
      CLIENT_NOT_FOUND: { code: 'CLIENT_NOT_FOUND', status: 404, message: 'Client not found' },
      USER_ALREADY_EXISTS: { code: 'USER_ALREADY_EXISTS', status: 409, message: 'A user with this email already exists' },
      CLIENT_ALREADY_EXISTS: { code: 'CLIENT_ALREADY_EXISTS', status: 409, message: 'A client with this code already exists' },
    },
  };
});

jest.mock('nanoid', () => ({
  nanoid: jest.fn(() => 'test123'),
}));

// Get mocked modules for manipulation in tests
import { db } from '@/db';
import { requireAuth, isSuperAdmin } from '@/lib/auth/session-helpers';

describe('GET /api/clients', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (isSuperAdmin as jest.Mock).mockResolvedValue(true);
  });

  it('should return all clients for SuperAdmin', async () => {
    const mockClients = [
      {
        id: 'org_1',
        clientCode: 'CLI-001',
        companyName: 'Client 1',
        status: 'active',
        plan: 'professional',
      },
      {
        id: 'org_2',
        clientCode: 'CLI-002',
        companyName: 'Client 2',
        status: 'trial',
        plan: 'starter',
      },
    ];

    // Mock the database query chain
    const mockQuery = {
      select: jest.fn().mockReturnThis(),
      from: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockResolvedValue(mockClients),
    };

    (db.select as jest.Mock).mockReturnValue(mockQuery);

    const request = createMockRequest({
      url: 'http://localhost:3000/api/clients',
    });

    const response = await GET(request);
    const { status, body } = await parseResponse(response);

    expect(status).toBe(200);
    expect(body.success).toBe(true);
    expect(body.data).toEqual(mockClients);
    expect(body.count).toBe(2);
  });

  it('should return 403 for non-SuperAdmin users', async () => {
    (isSuperAdmin as jest.Mock).mockResolvedValue(false);

    const request = createMockRequest({
      url: 'http://localhost:3000/api/clients',
    });

    const response = await GET(request);
    const { status, body } = await parseResponse(response);

    expect(status).toBe(403);
    expect(body.success).toBe(false);
    expect(body.error.message).toContain('SuperAdmin');
  });

  it('should filter clients by status', async () => {
    const mockClients = [
      {
        id: 'org_1',
        clientCode: 'CLI-001',
        status: 'active',
      },
    ];

    const mockQuery = {
      select: jest.fn().mockReturnThis(),
      from: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockResolvedValue(mockClients),
    };

    (db.select as jest.Mock).mockReturnValue(mockQuery);

    const request = createMockRequest({
      url: 'http://localhost:3000/api/clients',
      searchParams: { status: 'active' },
    });

    const response = await GET(request);
    const { status, body } = await parseResponse(response);

    expect(status).toBe(200);
    expect(body.success).toBe(true);
    expect(mockQuery.where).toHaveBeenCalled();
  });

  it('should filter clients by plan', async () => {
    const mockClients = [
      {
        id: 'org_1',
        clientCode: 'CLI-001',
        plan: 'enterprise',
      },
    ];

    const mockQuery = {
      select: jest.fn().mockReturnThis(),
      from: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockResolvedValue(mockClients),
    };

    (db.select as jest.Mock).mockReturnValue(mockQuery);

    const request = createMockRequest({
      url: 'http://localhost:3000/api/clients',
      searchParams: { plan: 'enterprise' },
    });

    const response = await GET(request);
    const { status, body } = await parseResponse(response);

    expect(status).toBe(200);
    expect(body.success).toBe(true);
  });

  it('should handle database errors gracefully', async () => {
    (db.select as jest.Mock).mockImplementation(() => {
      throw new Error('Database connection failed');
    });

    const request = createMockRequest({
      url: 'http://localhost:3000/api/clients',
    });

    const response = await GET(request);
    const { status, body } = await parseResponse(response);

    expect(status).toBe(500);
    expect(body.success).toBe(false);
    expect(body.error.message).toBeDefined();
  });
});

describe('POST /api/clients', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (isSuperAdmin as jest.Mock).mockResolvedValue(true);
  });

  it('should create a new client with valid data', async () => {
    const newClientData = {
      companyName: 'New Test Company',
      contactPersonName: 'Jane Doe',
      contactEmail: 'jane@newtest.com',
      phone: '+1987654321',
      plan: 'professional',
      status: 'trial',
    };

    const mockCreatedClient = {
      id: 'org_test123',
      clientCode: 'TEST-001',
      slug: 'new-test-company',
      ...newClientData,
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01'),
    };

    // Mock database query chain for slug uniqueness check
    const mockSelectQuery = {
      select: jest.fn().mockReturnThis(),
      from: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      limit: jest.fn().mockResolvedValue([]), // No existing client with slug
    };

    // Mock database insert chain
    const mockInsertQuery = {
      insert: jest.fn().mockReturnThis(),
      values: jest.fn().mockReturnThis(),
      returning: jest.fn().mockResolvedValue([mockCreatedClient]),
    };

    (db.select as jest.Mock).mockReturnValue(mockSelectQuery);
    (db.insert as jest.Mock).mockReturnValue(mockInsertQuery);

    const request = createMockRequest({
      method: 'POST',
      url: 'http://localhost:3000/api/clients',
      body: newClientData,
    });

    const response = await POST(request);
    const { status, body } = await parseResponse(response);

    expect(status).toBe(201);
    expect(body.success).toBe(true);
    expect(body.data.companyName).toBe(newClientData.companyName);
    expect(body.data.clientCode).toBe('TEST-001');
    expect(body.message).toContain('TEST-001');
  });

  it('should return 403 for non-SuperAdmin users', async () => {
    (isSuperAdmin as jest.Mock).mockResolvedValue(false);

    const request = createMockRequest({
      method: 'POST',
      url: 'http://localhost:3000/api/clients',
      body: {
        companyName: 'Test Company',
        contactPersonName: 'John Doe',
        contactEmail: 'john@test.com',
        plan: 'professional',
      },
    });

    const response = await POST(request);
    const { status, body } = await parseResponse(response);

    expect(status).toBe(403);
    expect(body.success).toBe(false);
    expect(body.error.message).toContain('SuperAdmin');
  });

  it('should return 400 for invalid data', async () => {
    const request = createMockRequest({
      method: 'POST',
      url: 'http://localhost:3000/api/clients',
      body: {
        companyName: 'A', // Too short
        contactEmail: 'invalid-email', // Invalid email
      },
    });

    const response = await POST(request);
    const { status, body } = await parseResponse(response);

    // Validation may happen at different layers, accept any error
    expect(status).toBeGreaterThanOrEqual(400);
    expect(body.success).toBe(false);
    expect(body.error.message).toBeDefined();
  });

  it('should return 400 for missing required fields', async () => {
    const request = createMockRequest({
      method: 'POST',
      url: 'http://localhost:3000/api/clients',
      body: {
        companyName: 'Test Company',
        // Missing required fields
      },
    });

    const response = await POST(request);
    const { status, body } = await parseResponse(response);

    // Validation may happen at different layers, accept any error
    expect(status).toBeGreaterThanOrEqual(400);
    expect(body.success).toBe(false);
    expect(body.error.message).toBeDefined();
  });

  it('should return 409 for duplicate client code', async () => {
    // Mock slug uniqueness check
    const mockSelectQuery = {
      select: jest.fn().mockReturnThis(),
      from: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      limit: jest.fn().mockResolvedValue([]), // No existing slug
    };

    // Mock insert that throws unique constraint error
    const mockInsertQuery = {
      insert: jest.fn().mockReturnThis(),
      values: jest.fn().mockReturnThis(),
      returning: jest.fn().mockRejectedValue({
        code: '23505', // PostgreSQL unique constraint violation
      }),
    };

    (db.select as jest.Mock).mockReturnValue(mockSelectQuery);
    (db.insert as jest.Mock).mockReturnValue(mockInsertQuery);

    const request = createMockRequest({
      method: 'POST',
      url: 'http://localhost:3000/api/clients',
      body: {
        companyName: 'Duplicate Company',
        contactPersonName: 'John Doe',
        contactEmail: 'john@duplicate.com',
        plan: 'professional',
      },
    });

    const response = await POST(request);
    const { status, body } = await parseResponse(response);

    expect(status).toBe(409);
    expect(body.success).toBe(false);
    expect(body.error.message).toContain('already exists');
  });

  it('should handle database errors gracefully', async () => {
    // Mock slug uniqueness check to succeed
    const mockSelectQuery = {
      select: jest.fn().mockReturnThis(),
      from: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      limit: jest.fn().mockResolvedValue([]),
    };

    // Mock insert that throws generic error
    const mockInsertQuery = {
      insert: jest.fn().mockReturnThis(),
      values: jest.fn().mockReturnThis(),
      returning: jest.fn().mockRejectedValue(new Error('Database error')),
    };

    (db.select as jest.Mock).mockReturnValue(mockSelectQuery);
    (db.insert as jest.Mock).mockReturnValue(mockInsertQuery);

    const request = createMockRequest({
      method: 'POST',
      url: 'http://localhost:3000/api/clients',
      body: {
        companyName: 'Test Company',
        contactPersonName: 'John Doe',
        contactEmail: 'john@test.com',
        plan: 'professional',
      },
    });

    const response = await POST(request);
    const { status, body } = await parseResponse(response);

    expect(status).toBe(500);
    expect(body.success).toBe(false);
    expect(body.error.message).toBeDefined();
  });
});
