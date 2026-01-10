/**
 * Client [id] API Routes Tests
 *
 * Tests for /api/clients/[id] endpoints (GET, PATCH, DELETE).
 *
 * @jest-environment node
 */

import { GET, PATCH, DELETE } from '@/app/api/clients/[id]/route';
import { createMockRequest, parseResponse } from '../../test-helpers';

// Mock dependencies
jest.mock('@/db', () => ({
  db: {
    select: jest.fn().mockReturnThis(),
    from: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    limit: jest.fn().mockReturnThis(),
    update: jest.fn().mockReturnThis(),
    set: jest.fn().mockReturnThis(),
    returning: jest.fn(),
    delete: jest.fn().mockReturnThis(),
  },
}));

jest.mock('@/lib/auth/session-helpers', () => ({
  requireAuth: jest.fn().mockResolvedValue({ userId: 'user123' }),
  isSuperAdmin: jest.fn().mockResolvedValue(true),
}));

jest.mock('@/lib/utils/crew', () => ({
  deprovisionCrew: jest.fn().mockResolvedValue(undefined),
}));

jest.mock('@/lib/utils', () => {
  const actual = jest.requireActual('@/lib/utils');
  return {
    ...actual,
    logger: {
      info: jest.fn(),
      warn: jest.fn(),
      error: jest.fn(),
      debug: jest.fn(),
    },
    ErrorCodes: {
      INTERNAL_ERROR: { code: 'INTERNAL_ERROR', status: 500, message: 'Internal server error' },
      PERMISSION_SUPER_ADMIN_REQUIRED: { code: 'PERMISSION_SUPER_ADMIN_REQUIRED', status: 403, message: 'SuperAdmin access required' },
      CLIENT_NOT_FOUND: { code: 'CLIENT_NOT_FOUND', status: 404, message: 'Client not found' },
    },
  };
});

import { db } from '@/db';
import { isSuperAdmin } from '@/lib/auth/session-helpers';

const mockClient = {
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
};

describe('GET /api/clients/[id]', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return client by id', async () => {
    const mockQuery = {
      select: jest.fn().mockReturnThis(),
      from: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      limit: jest.fn().mockResolvedValue([mockClient]),
    };

    (db.select as jest.Mock).mockReturnValue(mockQuery);

    const request = createMockRequest({
      url: 'http://localhost:3000/api/clients/org_test123',
    });
    const params = Promise.resolve({ id: 'org_test123' });

    const response = await GET(request, { params });
    const { status, body } = await parseResponse(response);

    expect(status).toBe(200);
    expect(body.success).toBe(true);
    expect(body.data.id).toBe(mockClient.id);
    expect(body.data.companyName).toBe(mockClient.companyName);
    expect(body.data.clientCode).toBe(mockClient.clientCode);
  });

  it('should return 404 if client not found', async () => {
    const mockQuery = {
      select: jest.fn().mockReturnThis(),
      from: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      limit: jest.fn().mockResolvedValue([]), // Empty array = not found
    };

    (db.select as jest.Mock).mockReturnValue(mockQuery);

    const request = createMockRequest({
      url: 'http://localhost:3000/api/clients/nonexistent',
    });
    const params = Promise.resolve({ id: 'nonexistent' });

    const response = await GET(request, { params });
    const { status, body } = await parseResponse(response);

    expect(status).toBe(404);
    expect(body.success).toBe(false);
    expect(body.error.message).toContain('not found');
  });

  it('should handle database errors', async () => {
    (db.select as jest.Mock).mockImplementation(() => {
      throw new Error('Database error');
    });

    const request = createMockRequest({
      url: 'http://localhost:3000/api/clients/org_test123',
    });
    const params = Promise.resolve({ id: 'org_test123' });

    const response = await GET(request, { params });
    const { status, body } = await parseResponse(response);

    expect(status).toBe(500);
    expect(body.success).toBe(false);
    expect(body.error.message).toBeDefined();
  });
});

describe('PATCH /api/clients/[id]', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should update client with valid data', async () => {
    const updatedData = {
      companyName: 'Updated Company Name',
      status: 'inactive',
    };

    const updatedClient = {
      ...mockClient,
      ...updatedData,
      updatedAt: new Date(),
    };

    // Mock select query (check if exists)
    const mockSelectQuery = {
      select: jest.fn().mockReturnThis(),
      from: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      limit: jest.fn().mockResolvedValue([mockClient]),
    };

    // Mock update query
    const mockUpdateQuery = {
      update: jest.fn().mockReturnThis(),
      set: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      returning: jest.fn().mockResolvedValue([updatedClient]),
    };

    (db.select as jest.Mock).mockReturnValue(mockSelectQuery);
    (db.update as jest.Mock).mockReturnValue(mockUpdateQuery);

    const request = createMockRequest({
      method: 'PATCH',
      url: 'http://localhost:3000/api/clients/org_test123',
      body: updatedData,
    });
    const params = Promise.resolve({ id: 'org_test123' });

    const response = await PATCH(request, { params });
    const { status, body } = await parseResponse(response);

    expect(status).toBe(200);
    expect(body.success).toBe(true);
    expect(body.data.companyName).toBe(updatedData.companyName);
    expect(body.message).toContain('updated successfully');
  });

  it('should return 404 if client not found', async () => {
    const mockSelectQuery = {
      select: jest.fn().mockReturnThis(),
      from: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      limit: jest.fn().mockResolvedValue([]), // Not found
    };

    (db.select as jest.Mock).mockReturnValue(mockSelectQuery);

    const request = createMockRequest({
      method: 'PATCH',
      url: 'http://localhost:3000/api/clients/nonexistent',
      body: { companyName: 'New Name' },
    });
    const params = Promise.resolve({ id: 'nonexistent' });

    const response = await PATCH(request, { params });
    const { status, body } = await parseResponse(response);

    expect(status).toBe(404);
    expect(body.success).toBe(false);
    expect(body.error.message).toContain('not found');
  });

  it('should return 400 for invalid data', async () => {
    const mockSelectQuery = {
      select: jest.fn().mockReturnThis(),
      from: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      limit: jest.fn().mockResolvedValue([mockClient]),
    };

    (db.select as jest.Mock).mockReturnValue(mockSelectQuery);

    const request = createMockRequest({
      method: 'PATCH',
      url: 'http://localhost:3000/api/clients/org_test123',
      body: {
        contactEmail: 'invalid-email', // Invalid email format
      },
    });
    const params = Promise.resolve({ id: 'org_test123' });

    const response = await PATCH(request, { params });
    const { status, body } = await parseResponse(response);

    expect(status).toBeGreaterThanOrEqual(400);
    expect(body.success).toBe(false);
    expect(body.error.message).toBeDefined();
  });

  it('should handle database errors', async () => {
    const mockSelectQuery = {
      select: jest.fn().mockReturnThis(),
      from: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      limit: jest.fn().mockResolvedValue([mockClient]),
    };

    const mockUpdateQuery = {
      update: jest.fn().mockReturnThis(),
      set: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      returning: jest.fn().mockRejectedValue(new Error('Database error')),
    };

    (db.select as jest.Mock).mockReturnValue(mockSelectQuery);
    (db.update as jest.Mock).mockReturnValue(mockUpdateQuery);

    const request = createMockRequest({
      method: 'PATCH',
      url: 'http://localhost:3000/api/clients/org_test123',
      body: { companyName: 'New Name' },
    });
    const params = Promise.resolve({ id: 'org_test123' });

    const response = await PATCH(request, { params });
    const { status, body } = await parseResponse(response);

    expect(status).toBe(500);
    expect(body.success).toBe(false);
    expect(body.error.message).toBeDefined();
  });
});

describe('DELETE /api/clients/[id]', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (isSuperAdmin as jest.Mock).mockResolvedValue(true);
  });

  it('should delete client and all related data for SuperAdmin', async () => {
    const mockCrews = [
      { id: 'crew1', name: 'Crew 1', crewCode: 'CRW-001' },
      { id: 'crew2', name: 'Crew 2', crewCode: 'CRW-002' },
    ];

    const mockConversations = [
      { id: 'conv1' },
      { id: 'conv2' },
    ];

    const mockMembers = [
      { userId: 'user1', organizationId: 'org_test123' },
      { userId: 'user2', organizationId: 'org_test123' },
    ];

    // Mock select client
    const mockSelectClient = {
      select: jest.fn().mockReturnThis(),
      from: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      limit: jest.fn().mockResolvedValue([mockClient]),
    };

    // Mock select crews
    const mockSelectCrews = {
      select: jest.fn().mockReturnThis(),
      from: jest.fn().mockReturnThis(),
      where: jest.fn().mockResolvedValue(mockCrews), // Return crews directly from where
      limit: jest.fn(),
    };

    // Mock delete conversations
    const mockDeleteConversations = {
      delete: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      returning: jest.fn().mockResolvedValue(mockConversations),
    };

    // Mock select members
    const mockSelectMembers = {
      select: jest.fn().mockReturnThis(),
      from: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
    };
    mockSelectMembers.where.mockResolvedValueOnce(mockMembers);
    mockSelectMembers.where.mockResolvedValueOnce(mockMembers); // For membership check

    // Mock delete client
    const mockDeleteClient = {
      delete: jest.fn().mockReturnThis(),
      where: jest.fn().mockResolvedValue(undefined),
    };

    let callCount = 0;
    (db.select as jest.Mock).mockImplementation(() => {
      callCount++;
      if (callCount === 1) return mockSelectClient; // Check client exists
      if (callCount === 2) return mockSelectCrews; // Get crews
      if (callCount === 3) return mockSelectMembers; // Get members
      return mockSelectMembers; // Get memberships for orphan check
    });

    (db.delete as jest.Mock).mockImplementation((table: any) => {
      // Check if it's conversations or client
      return mockDeleteConversations;
    });

    const request = createMockRequest({
      method: 'DELETE',
      url: 'http://localhost:3000/api/clients/org_test123',
    });
    const params = Promise.resolve({ id: 'org_test123' });

    const response = await DELETE(request, { params });
    const { status, body } = await parseResponse(response);

    expect(status).toBe(200);
    expect(body.success).toBe(true);
    expect(body.message).toContain('deleted successfully');
    expect(body.data.deletedCrews).toBe(2);
    expect(body.data.deletedConversations).toBe(2);
  });

  it('should return 403 for non-SuperAdmin users', async () => {
    (isSuperAdmin as jest.Mock).mockResolvedValue(false);

    const request = createMockRequest({
      method: 'DELETE',
      url: 'http://localhost:3000/api/clients/org_test123',
    });
    const params = Promise.resolve({ id: 'org_test123' });

    const response = await DELETE(request, { params });
    const { status, body } = await parseResponse(response);

    expect(status).toBe(403);
    expect(body.success).toBe(false);
    expect(body.error.message).toContain('SuperAdmin');
  });

  it('should return 404 if client not found', async () => {
    const mockSelectQuery = {
      select: jest.fn().mockReturnThis(),
      from: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      limit: jest.fn().mockResolvedValue([]), // Not found
    };

    (db.select as jest.Mock).mockReturnValue(mockSelectQuery);

    const request = createMockRequest({
      method: 'DELETE',
      url: 'http://localhost:3000/api/clients/nonexistent',
    });
    const params = Promise.resolve({ id: 'nonexistent' });

    const response = await DELETE(request, { params });
    const { status, body } = await parseResponse(response);

    expect(status).toBe(404);
    expect(body.success).toBe(false);
    expect(body.error.message).toContain('not found');
  });

  it('should handle database errors gracefully', async () => {
    (db.select as jest.Mock).mockImplementation(() => {
      throw new Error('Database error');
    });

    const request = createMockRequest({
      method: 'DELETE',
      url: 'http://localhost:3000/api/clients/org_test123',
    });
    const params = Promise.resolve({ id: 'org_test123' });

    const response = await DELETE(request, { params });
    const { status, body } = await parseResponse(response);

    expect(status).toBe(500);
    expect(body.success).toBe(false);
    expect(body.error.message).toBeDefined();
  });
});
