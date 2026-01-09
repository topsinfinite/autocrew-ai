/**
 * Admin Create Client Admin API Routes Tests
 *
 * Tests for /api/admin/create-client-admin endpoint (POST).
 *
 * @jest-environment node
 */

import { POST } from '@/app/api/admin/create-client-admin/route';
import { createMockRequest, parseResponse } from '../../test-helpers';

// Mock dependencies
jest.mock('@/lib/auth', () => ({
  auth: {
    api: {
      requestPasswordReset: jest.fn().mockResolvedValue({ success: true }),
    },
  },
}));

jest.mock('@/lib/auth/session-helpers', () => ({
  isSuperAdmin: jest.fn().mockResolvedValue(true),
}));

jest.mock('@/db', () => ({
  db: {
    select: jest.fn().mockReturnThis(),
    from: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    limit: jest.fn(),
    insert: jest.fn().mockReturnThis(),
    values: jest.fn().mockReturnThis(),
    returning: jest.fn(),
  },
}));

jest.mock('nanoid', () => ({
  nanoid: jest.fn(() => 'test123'),
}));

jest.mock('@/lib/email/mailer', () => ({
  sendEmail: jest.fn().mockResolvedValue(true),
  generateMagicLinkEmail: jest.fn().mockReturnValue({
    subject: 'Welcome',
    html: '<html>Welcome</html>',
  }),
}));

import { auth } from '@/lib/auth';
import { isSuperAdmin } from '@/lib/auth/session-helpers';
import { db } from '@/db';

describe('POST /api/admin/create-client-admin', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (isSuperAdmin as jest.Mock).mockResolvedValue(true);
  });

  it('should create a new client admin with valid data', async () => {
    const requestData = {
      email: 'newadmin@client.com',
      name: 'New Admin',
      clientId: 'org_test123',
    };

    const mockClient = {
      id: 'org_test123',
      companyName: 'Test Client',
      clientCode: 'TEST-001',
    };

    const mockNewUser = {
      id: 'user_test123',
      email: requestData.email,
      name: requestData.name,
      role: 'client_admin',
      emailVerified: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Mock user existence check (no existing user)
    const mockSelectUser = {
      select: jest.fn().mockReturnThis(),
      from: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      limit: jest.fn().mockResolvedValue([]), // No existing user
    };

    // Mock client existence check
    const mockSelectClient = {
      select: jest.fn().mockReturnThis(),
      from: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      limit: jest.fn().mockResolvedValue([mockClient]),
    };

    // Mock user insert
    const mockInsertUser = {
      insert: jest.fn().mockReturnThis(),
      values: jest.fn().mockReturnThis(),
      returning: jest.fn().mockResolvedValue([mockNewUser]),
    };

    // Mock member insert
    const mockInsertMember = {
      insert: jest.fn().mockReturnThis(),
      values: jest.fn().mockReturnThis(),
      returning: jest.fn().mockResolvedValue([{ id: 'member_test123' }]),
    };

    let selectCallCount = 0;
    (db.select as jest.Mock).mockImplementation(() => {
      selectCallCount++;
      return selectCallCount === 1 ? mockSelectUser : mockSelectClient;
    });

    let insertCallCount = 0;
    (db.insert as jest.Mock).mockImplementation(() => {
      insertCallCount++;
      return insertCallCount === 1 ? mockInsertUser : mockInsertMember;
    });

    const request = createMockRequest({
      method: 'POST',
      url: 'http://localhost:3000/api/admin/create-client-admin',
      body: requestData,
    });

    const response = await POST(request);
    const { status, body } = await parseResponse(response);

    expect(status).toBe(201);
    expect(body.success).toBe(true);
    expect(body.data.email).toBe(requestData.email);
    expect(body.data.name).toBe(requestData.name);
    expect(body.data.role).toBe('client_admin');
    expect(body.data.clientId).toBe(requestData.clientId);
    expect(body.message).toContain('created successfully');

    // Verify invitation email was requested
    expect(auth.api.requestPasswordReset).toHaveBeenCalledWith({
      body: {
        email: requestData.email,
        redirectTo: '/reset-password',
      },
    });
  });

  it('should return 403 for non-SuperAdmin users', async () => {
    (isSuperAdmin as jest.Mock).mockResolvedValue(false);

    const request = createMockRequest({
      method: 'POST',
      url: 'http://localhost:3000/api/admin/create-client-admin',
      body: {
        email: 'newadmin@client.com',
        name: 'New Admin',
        clientId: 'org_test123',
      },
    });

    const response = await POST(request);
    const { status, body } = await parseResponse(response);

    expect(status).toBe(403);
    expect(body.success).toBe(false);
    expect(body.error).toContain('Forbidden');
  });

  it('should return 400 for invalid email', async () => {
    const request = createMockRequest({
      method: 'POST',
      url: 'http://localhost:3000/api/admin/create-client-admin',
      body: {
        email: 'invalid-email',
        name: 'New Admin',
        clientId: 'org_test123',
      },
    });

    const response = await POST(request);
    const { status, body } = await parseResponse(response);

    expect(status).toBe(400);
    expect(body.success).toBe(false);
    expect(body.error).toContain('Validation failed');
    expect(body.details).toBeDefined();
  });

  it('should return 400 for missing required fields', async () => {
    const request = createMockRequest({
      method: 'POST',
      url: 'http://localhost:3000/api/admin/create-client-admin',
      body: {
        email: 'newadmin@client.com',
        // Missing name and clientId
      },
    });

    const response = await POST(request);
    const { status, body } = await parseResponse(response);

    expect(status).toBe(400);
    expect(body.success).toBe(false);
    expect(body.error).toContain('Validation failed');
  });

  it('should return 409 if user with email already exists', async () => {
    const existingUser = {
      id: 'user_existing',
      email: 'existing@client.com',
      name: 'Existing User',
    };

    (db.select as jest.Mock).mockReturnValue({
      select: jest.fn().mockReturnThis(),
      from: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      limit: jest.fn().mockResolvedValue([existingUser]), // User exists
    });

    const request = createMockRequest({
      method: 'POST',
      url: 'http://localhost:3000/api/admin/create-client-admin',
      body: {
        email: 'existing@client.com',
        name: 'New Admin',
        clientId: 'org_test123',
      },
    });

    const response = await POST(request);
    const { status, body } = await parseResponse(response);

    expect(status).toBe(409);
    expect(body.success).toBe(false);
    expect(body.error).toContain('already exists');
  });

  it('should return 404 if client not found', async () => {
    // Mock user existence check (no existing user)
    const mockSelectUser = {
      select: jest.fn().mockReturnThis(),
      from: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      limit: jest.fn().mockResolvedValue([]),
    };

    // Mock client existence check (client not found)
    const mockSelectClient = {
      select: jest.fn().mockReturnThis(),
      from: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      limit: jest.fn().mockResolvedValue([]), // Client not found
    };

    let selectCallCount = 0;
    (db.select as jest.Mock).mockImplementation(() => {
      selectCallCount++;
      return selectCallCount === 1 ? mockSelectUser : mockSelectClient;
    });

    const request = createMockRequest({
      method: 'POST',
      url: 'http://localhost:3000/api/admin/create-client-admin',
      body: {
        email: 'newadmin@client.com',
        name: 'New Admin',
        clientId: 'org_nonexistent',
      },
    });

    const response = await POST(request);
    const { status, body } = await parseResponse(response);

    expect(status).toBe(404);
    expect(body.success).toBe(false);
    expect(body.error).toContain('Client not found');
  });

  it('should still succeed even if invitation email fails', async () => {
    const requestData = {
      email: 'newadmin@client.com',
      name: 'New Admin',
      clientId: 'org_test123',
    };

    const mockClient = {
      id: 'org_test123',
      companyName: 'Test Client',
    };

    const mockNewUser = {
      id: 'user_test123',
      email: requestData.email,
      name: requestData.name,
      role: 'client_admin',
      emailVerified: false,
    };

    // Setup mocks
    const mockSelectUser = {
      select: jest.fn().mockReturnThis(),
      from: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      limit: jest.fn().mockResolvedValue([]),
    };

    const mockSelectClient = {
      select: jest.fn().mockReturnThis(),
      from: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      limit: jest.fn().mockResolvedValue([mockClient]),
    };

    const mockInsertUser = {
      insert: jest.fn().mockReturnThis(),
      values: jest.fn().mockReturnThis(),
      returning: jest.fn().mockResolvedValue([mockNewUser]),
    };

    const mockInsertMember = {
      insert: jest.fn().mockReturnThis(),
      values: jest.fn().mockReturnThis(),
      returning: jest.fn().mockResolvedValue([{ id: 'member_test123' }]),
    };

    let selectCallCount = 0;
    (db.select as jest.Mock).mockImplementation(() => {
      selectCallCount++;
      return selectCallCount === 1 ? mockSelectUser : mockSelectClient;
    });

    let insertCallCount = 0;
    (db.insert as jest.Mock).mockImplementation(() => {
      insertCallCount++;
      return insertCallCount === 1 ? mockInsertUser : mockInsertMember;
    });

    // Mock email failure
    (auth.api.requestPasswordReset as jest.Mock).mockRejectedValue(
      new Error('Email service error')
    );

    const request = createMockRequest({
      method: 'POST',
      url: 'http://localhost:3000/api/admin/create-client-admin',
      body: requestData,
    });

    const response = await POST(request);
    const { status, body } = await parseResponse(response);

    // Should still succeed even though email failed
    expect(status).toBe(201);
    expect(body.success).toBe(true);
    expect(body.data.email).toBe(requestData.email);
  });

  it('should handle database errors gracefully', async () => {
    (db.select as jest.Mock).mockImplementation(() => {
      throw new Error('Database connection error');
    });

    const request = createMockRequest({
      method: 'POST',
      url: 'http://localhost:3000/api/admin/create-client-admin',
      body: {
        email: 'newadmin@client.com',
        name: 'New Admin',
        clientId: 'org_test123',
      },
    });

    const response = await POST(request);
    const { status, body } = await parseResponse(response);

    expect(status).toBe(500);
    expect(body.success).toBe(false);
    expect(body.error).toContain('Failed to create client admin');
  });
});
