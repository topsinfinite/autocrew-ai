import { db } from '@/db';
import { crews } from '@/db/schema';
import { and, sql } from 'drizzle-orm';
import type { CrewType } from '@/types';

/**
 * Normalize client code for table naming
 * - Convert to lowercase
 * - Replace hyphens with underscores
 * Examples: "ACME-001" -> "acme_001", "TECHSTART-001" -> "techstart_001"
 */
export function normalizeClientCode(clientCode: string): string {
  return clientCode.toLowerCase().replace(/-/g, '_');
}

/**
 * Get short name for crew type in table names
 * customer_support -> support
 * lead_generation -> leadgen
 */
export function getCrewTypeShortName(crewType: CrewType): string {
  const shortNames: Record<CrewType, string> = {
    customer_support: 'support',
    lead_generation: 'leadgen',
  };

  return shortNames[crewType] || 'crew';
}

/**
 * Sanitize and validate table name
 * - Check max length (PostgreSQL limit: 63 characters)
 * - Validate pattern matches expected format
 * - Prevent SQL injection
 */
export function sanitizeTableName(tableName: string): string {
  // PostgreSQL table name max length is 63 characters
  if (tableName.length > 63) {
    throw new Error(`Table name exceeds PostgreSQL limit of 63 characters: ${tableName}`);
  }

  // Validate pattern: starts with __, then lowercase alphanumeric with underscores
  const validPattern = /^__[a-z0-9_]+$/;
  if (!validPattern.test(tableName)) {
    throw new Error(
      `Invalid table name format: ${tableName}. Must start with __ and contain only lowercase letters, numbers, and underscores.`
    );
  }

  // Additional safety check for expected format
  // Pattern: __{client_code}_{crew_type}_{table_type}_{sequence}
  const expectedPattern = /^__[a-z0-9]+_[0-9]+_(support|leadgen)_(vector|histories)_[0-9]{3}$/;
  if (!expectedPattern.test(tableName)) {
    throw new Error(
      `Table name doesn't match expected format: ${tableName}. ` +
        `Expected: __{client_code}_{crew_type}_{table_type}_{sequence}`
    );
  }

  return tableName;
}

/**
 * Check if a table exists in the database
 */
export async function tableExists(tableName: string): Promise<boolean> {
  const result = await db.execute(sql`
    SELECT EXISTS (
      SELECT FROM information_schema.tables
      WHERE table_schema = 'public'
      AND table_name = ${tableName}
    ) as exists
  `);

  return (result[0] as { exists: boolean }).exists;
}

/**
 * Generate unique table names for a crew
 * Format: __{client_code}_{crew_type}_{table_type}_{sequence}
 * Examples:
 * - "__acme_001_support_vector_001"
 * - "__acme_001_support_histories_001"
 * - "__acme_001_support_vector_002" (second crew)
 * - "__techstart_001_support_vector_001"
 *
 * @param clientCode - Client code (e.g., "ACME-001")
 * @param crewType - Crew type
 * @param tableType - Table type ("vector" | "histories")
 * @returns Sanitized, unique table name
 */
export async function generateCrewTableName(
  clientCode: string,
  crewType: CrewType,
  tableType: 'vector' | 'histories'
): Promise<string> {
  const normalizedClient = normalizeClientCode(clientCode);
  const typeShort = getCrewTypeShortName(crewType);
  const basePrefix = `__${normalizedClient}_${typeShort}_${tableType}`;

  // Find all existing crews with the same client and type to get the sequence
  const existingCrews = await db
    .select({ config: crews.config })
    .from(crews)
    .where(
      and(
        sql`${crews.clientId} = ${clientCode}`,
        sql`${crews.type} = ${crewType}`
      )
    );

  // Extract sequence numbers from existing table names
  const numbers = existingCrews
    .map((row) => {
      const config = row.config as { vectorTableName?: string; historiesTableName?: string };
      const tableName =
        tableType === 'vector' ? config.vectorTableName : config.historiesTableName;

      if (!tableName) return 0;

      // Extract sequence from table name: {prefix}_{NNN}
      const match = tableName.match(/_(\d+)$/);
      return match ? parseInt(match[1], 10) : 0;
    })
    .filter((num) => !isNaN(num) && num > 0);

  // Find the next available sequence number
  const maxNumber = numbers.length > 0 ? Math.max(...numbers) : 0;
  const nextNumber = maxNumber + 1;

  // Pad to 3 digits
  const paddedNumber = nextNumber.toString().padStart(3, '0');

  // Generate table name
  const tableName = `${basePrefix}_${paddedNumber}`;

  // Sanitize and validate
  return sanitizeTableName(tableName);
}
