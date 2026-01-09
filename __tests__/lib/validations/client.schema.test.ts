/**
 * Client Validation Schema Tests
 *
 * Tests for client management validation schemas.
 */

import {
  createClientSchema,
  updateClientSchema,
} from '@/lib/validations/client.schema';

describe('createClientSchema', () => {
  const validClientData = {
    companyName: 'ACME Corporation',
    contactPersonName: 'John Doe',
    contactEmail: 'john@acme.com',
    phone: '+1234567890',
    plan: 'professional',
    status: 'trial',
  };

  it('should validate correct client data', () => {
    const result = createClientSchema.safeParse(validClientData);
    expect(result.success).toBe(true);
  });

  it('should reject company name shorter than 2 characters', () => {
    const data = {
      ...validClientData,
      companyName: 'A',
    };

    const result = createClientSchema.safeParse(data);
    expect(result.success).toBe(false);
  });

  it('should reject company name longer than 100 characters', () => {
    const data = {
      ...validClientData,
      companyName: 'A'.repeat(101),
    };

    const result = createClientSchema.safeParse(data);
    expect(result.success).toBe(false);
  });

  it('should reject invalid email', () => {
    const data = {
      ...validClientData,
      contactEmail: 'invalid-email',
    };

    const result = createClientSchema.safeParse(data);
    expect(result.success).toBe(false);
  });

  it('should validate valid plan values', () => {
    const plans = ['starter', 'professional', 'enterprise'];

    plans.forEach((plan) => {
      const data = { ...validClientData, plan };
      const result = createClientSchema.safeParse(data);
      expect(result.success).toBe(true);
    });
  });

  it('should reject invalid plan value', () => {
    const data = {
      ...validClientData,
      plan: 'invalid-plan',
    };

    const result = createClientSchema.safeParse(data);
    expect(result.success).toBe(false);
  });

  it('should validate valid status values', () => {
    const statuses = ['trial', 'active', 'inactive'];

    statuses.forEach((status) => {
      const data = { ...validClientData, status };
      const result = createClientSchema.safeParse(data);
      expect(result.success).toBe(true);
    });
  });

  it('should reject invalid status value', () => {
    const data = {
      ...validClientData,
      status: 'invalid-status',
    };

    const result = createClientSchema.safeParse(data);
    expect(result.success).toBe(false);
  });

  it('should accept optional phone field', () => {
    const data = {
      ...validClientData,
      phone: undefined,
    };

    const result = createClientSchema.safeParse(data);
    expect(result.success).toBe(true);
  });

  it('should accept null phone field', () => {
    const data = {
      ...validClientData,
      phone: null,
    };

    const result = createClientSchema.safeParse(data);
    expect(result.success).toBe(true);
  });

  it('should default status to trial when not provided', () => {
    const data = {
      companyName: 'ACME Corp',
      contactPersonName: 'John Doe',
      contactEmail: 'john@acme.com',
      phone: '+1234567890',
      plan: 'professional',
    };

    const result = createClientSchema.safeParse(data);
    if (result.success) {
      expect(result.data.status).toBe('trial');
    }
  });

  it('should reject phone number shorter than 10 characters', () => {
    const data = {
      ...validClientData,
      phone: '123',
    };

    const result = createClientSchema.safeParse(data);
    expect(result.success).toBe(false);
  });
});

describe('updateClientSchema', () => {
  it('should allow partial updates with id', () => {
    const data = {
      id: '123e4567-e89b-12d3-a456-426614174000',
      companyName: 'New Company Name',
    };

    const result = updateClientSchema.safeParse(data);
    expect(result.success).toBe(true);
  });

  it('should require id field', () => {
    const data = {
      companyName: 'New Company Name',
    };

    const result = updateClientSchema.safeParse(data);
    expect(result.success).toBe(false);
  });

  it('should reject invalid UUID for id', () => {
    const data = {
      id: 'not-a-uuid',
      companyName: 'New Company Name',
    };

    const result = updateClientSchema.safeParse(data);
    expect(result.success).toBe(false);
  });

  it('should validate each field if provided', () => {
    const data = {
      id: '123e4567-e89b-12d3-a456-426614174000',
      contactEmail: 'invalid-email',
    };

    const result = updateClientSchema.safeParse(data);
    expect(result.success).toBe(false);
  });

  it('should allow update with only id', () => {
    const data = {
      id: '123e4567-e89b-12d3-a456-426614174000',
    };
    const result = updateClientSchema.safeParse(data);
    expect(result.success).toBe(true);
  });

  it('should validate multiple fields', () => {
    const data = {
      id: '123e4567-e89b-12d3-a456-426614174000',
      companyName: 'Updated Company',
      contactEmail: 'updated@example.com',
      plan: 'enterprise',
    };

    const result = updateClientSchema.safeParse(data);
    expect(result.success).toBe(true);
  });
});
