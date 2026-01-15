/**
 * Crew Table Utilities Tests
 *
 * Tests for crew table creation, validation, and deletion utilities.
 */

import { db } from '@/db';
import { sql } from 'drizzle-orm';

// Mock the database module
jest.mock('@/db', () => ({
  db: {
    execute: jest.fn(),
  },
}));

// Import after mocking
import {
  dropTable,
  createVectorTable,
  createHistoriesTable,
} from '@/lib/utils/crew/crew-table-creator';

import {
  normalizeClientCode,
  getCrewTypeShortName,
  sanitizeTableName,
} from '@/lib/utils/crew/crew-table-generator';

describe('normalizeClientCode', () => {
  it('should convert to lowercase', () => {
    expect(normalizeClientCode('ACME-001')).toBe('acme_001');
    expect(normalizeClientCode('TechStart-002')).toBe('techstart_002');
  });

  it('should replace hyphens with underscores', () => {
    expect(normalizeClientCode('my-client-123')).toBe('my_client_123');
    expect(normalizeClientCode('test-test-test')).toBe('test_test_test');
  });

  it('should handle already normalized codes', () => {
    expect(normalizeClientCode('acme_001')).toBe('acme_001');
  });

  it('should handle codes without hyphens', () => {
    expect(normalizeClientCode('ACME001')).toBe('acme001');
  });
});

describe('getCrewTypeShortName', () => {
  it('should return "support" for customer_support', () => {
    expect(getCrewTypeShortName('customer_support')).toBe('support');
  });

  it('should return "leadgen" for lead_generation', () => {
    expect(getCrewTypeShortName('lead_generation')).toBe('leadgen');
  });

  it('should return "crew" for unknown types', () => {
    // @ts-expect-error - Testing invalid type
    expect(getCrewTypeShortName('unknown_type')).toBe('crew');
  });
});

describe('sanitizeTableName', () => {
  it('should accept valid new format table names with __ prefix', () => {
    expect(sanitizeTableName('__acme_001_support_vector_001')).toBe(
      '__acme_001_support_vector_001'
    );
    expect(sanitizeTableName('__techstart_002_support_histories_003')).toBe(
      '__techstart_002_support_histories_003'
    );
  });

  it('should accept leadgen table names', () => {
    expect(sanitizeTableName('__acme_001_leadgen_vector_001')).toBe(
      '__acme_001_leadgen_vector_001'
    );
    expect(sanitizeTableName('__acme_001_leadgen_histories_001')).toBe(
      '__acme_001_leadgen_histories_001'
    );
  });

  it('should reject table names exceeding 63 characters', () => {
    const longName = '__' + 'a'.repeat(65);
    expect(() => sanitizeTableName(longName)).toThrow('exceeds PostgreSQL limit');
  });

  it('should reject table names without __ prefix', () => {
    expect(() => sanitizeTableName('acme_001_support_vector_001')).toThrow(
      'Must start with __'
    );
  });

  it('should reject table names with invalid characters', () => {
    expect(() => sanitizeTableName('__acme-001_support_vector_001')).toThrow(
      'Invalid table name format'
    );
    expect(() => sanitizeTableName('__ACME_001_support_vector_001')).toThrow(
      'Invalid table name format'
    );
  });

  it('should reject table names not matching expected pattern', () => {
    expect(() => sanitizeTableName('__random_table_name')).toThrow(
      "doesn't match expected format"
    );
  });
});

describe('dropTable', () => {
  const mockExecute = db.execute as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    // Suppress console.log and console.error during tests
    jest.spyOn(console, 'log').mockImplementation(() => {});
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('new format tables (with __ prefix)', () => {
    it('should drop vector table with __ prefix', async () => {
      mockExecute.mockResolvedValueOnce([]);

      await dropTable('__acme_001_support_vector_001');

      expect(mockExecute).toHaveBeenCalledTimes(1);
      expect(console.log).toHaveBeenCalledWith(
        '✓ Dropped table: __acme_001_support_vector_001'
      );
    });

    it('should drop histories table with __ prefix', async () => {
      mockExecute.mockResolvedValueOnce([]);

      await dropTable('__acme_001_support_histories_001');

      expect(mockExecute).toHaveBeenCalledTimes(1);
      expect(console.log).toHaveBeenCalledWith(
        '✓ Dropped table: __acme_001_support_histories_001'
      );
    });
  });

  describe('old format tables (without __ prefix)', () => {
    it('should drop vector table without prefix', async () => {
      mockExecute.mockResolvedValueOnce([]);

      await dropTable('acme_001_support_vector_001');

      expect(mockExecute).toHaveBeenCalledTimes(1);
      expect(console.log).toHaveBeenCalledWith(
        '✓ Dropped table: acme_001_support_vector_001'
      );
    });

    it('should drop histories table without prefix', async () => {
      mockExecute.mockResolvedValueOnce([]);

      await dropTable('acme_001_support_histories_001');

      expect(mockExecute).toHaveBeenCalledTimes(1);
      expect(console.log).toHaveBeenCalledWith(
        '✓ Dropped table: acme_001_support_histories_001'
      );
    });

    it('should drop old format leadgen tables', async () => {
      mockExecute.mockResolvedValueOnce([]);

      await dropTable('techstart_001_leadgen_vector_002');

      expect(mockExecute).toHaveBeenCalledTimes(1);
    });
  });

  describe('validation and safety checks', () => {
    it('should reject null or undefined table names', async () => {
      await dropTable(null as unknown as string);
      await dropTable(undefined as unknown as string);

      expect(mockExecute).not.toHaveBeenCalled();
      expect(console.error).toHaveBeenCalledWith('Invalid table name: null');
      expect(console.error).toHaveBeenCalledWith('Invalid table name: undefined');
    });

    it('should reject empty string', async () => {
      await dropTable('');

      expect(mockExecute).not.toHaveBeenCalled();
      expect(console.error).toHaveBeenCalledWith('Invalid table name: ');
    });

    it('should reject tables without vector or histories identifier', async () => {
      await dropTable('__acme_001_support_data_001');

      expect(mockExecute).not.toHaveBeenCalled();
      expect(console.error).toHaveBeenCalledWith(
        'Refusing to drop non-crew table: __acme_001_support_data_001'
      );
    });

    it('should reject system tables', async () => {
      await dropTable('users');
      await dropTable('clients');
      await dropTable('crews');

      expect(mockExecute).not.toHaveBeenCalled();
    });

    it('should reject table names with invalid characters', async () => {
      await dropTable('__acme-001_support_vector_001'); // hyphen
      await dropTable('__ACME_001_support_vector_001'); // uppercase

      expect(mockExecute).not.toHaveBeenCalled();
      expect(console.error).toHaveBeenCalledWith(
        'Invalid characters in table name: __acme-001_support_vector_001'
      );
    });

    it('should reject table names exceeding 63 characters', async () => {
      const longTableName = '__' + 'a'.repeat(55) + '_vector_001'; // 68 chars total

      await dropTable(longTableName);

      expect(mockExecute).not.toHaveBeenCalled();
      expect(console.error).toHaveBeenCalledWith(
        expect.stringContaining('exceeds PostgreSQL limit')
      );
    });
  });

  describe('error handling', () => {
    it('should handle database errors gracefully', async () => {
      mockExecute.mockRejectedValueOnce(new Error('Database connection failed'));

      await dropTable('__acme_001_support_vector_001');

      expect(console.error).toHaveBeenCalledWith(
        'Failed to drop table __acme_001_support_vector_001:',
        expect.any(Error)
      );
    });

    it('should not throw on database errors', async () => {
      mockExecute.mockRejectedValueOnce(new Error('Database error'));

      await expect(
        dropTable('__acme_001_support_vector_001')
      ).resolves.not.toThrow();
    });
  });
});

describe('createVectorTable', () => {
  const mockExecute = db.execute as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, 'log').mockImplementation(() => {});
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should create vector table with correct schema', async () => {
    mockExecute.mockResolvedValue([]);

    await createVectorTable('__acme_001_support_vector_001');

    // Should call execute 3 times: create table, create HNSW index, create GIN index
    expect(mockExecute).toHaveBeenCalledTimes(3);
    expect(console.log).toHaveBeenCalledWith(
      '✓ Created vector table: __acme_001_support_vector_001'
    );
  });

  it('should reject invalid table names', async () => {
    await expect(createVectorTable('invalid_table')).rejects.toThrow();
  });
});

describe('createHistoriesTable', () => {
  const mockExecute = db.execute as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, 'log').mockImplementation(() => {});
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should create histories table with correct schema', async () => {
    mockExecute.mockResolvedValue([]);

    await createHistoriesTable('__acme_001_support_histories_001');

    // Should call execute 3 times: create table, create session_id index, create created_at index
    expect(mockExecute).toHaveBeenCalledTimes(3);
    expect(console.log).toHaveBeenCalledWith(
      '✓ Created histories table: __acme_001_support_histories_001'
    );
  });

  it('should reject invalid table names', async () => {
    await expect(createHistoriesTable('invalid_table')).rejects.toThrow();
  });
});
