import { db } from '@/db';
import { crews } from '@/db/schema';
import { and, sql } from 'drizzle-orm';
import type { CrewType } from '@/types';

/**
 * Get short abbreviation for crew type
 * customer_support -> SUP
 * lead_generation -> LEAD
 */
export function getCrewTypeAbbreviation(crewType: CrewType): string {
  const abbreviations: Record<CrewType, string> = {
    customer_support: 'SUP',
    lead_generation: 'LEAD',
  };

  return abbreviations[crewType] || 'CREW';
}

/**
 * Check if a crew code is available
 */
export async function isCrewCodeAvailable(crewCode: string): Promise<boolean> {
  const existing = await db
    .select({ crewCode: crews.crewCode })
    .from(crews)
    .where(sql`${crews.crewCode} = ${crewCode}`)
    .limit(1);

  return existing.length === 0;
}

/**
 * Generate a unique crew code for a client and crew type
 * Format: {CLIENT_CODE}-{TYPE_SHORT}-{NNN}
 * Examples:
 * - "ACME-001-SUP-001" (first support crew for ACME-001)
 * - "ACME-001-SUP-002" (second support crew for ACME-001)
 * - "ACME-001-LEAD-001" (first lead gen crew for ACME-001)
 * - "TECHSTART-001-SUP-001" (first support crew for TECHSTART-001)
 */
export async function generateCrewCode(
  clientCode: string,
  crewType: CrewType
): Promise<string> {
  const typeAbbr = getCrewTypeAbbreviation(crewType);
  const prefix = `${clientCode}-${typeAbbr}`;

  // Find all existing crew codes with the same client and type prefix
  const existingCodes = await db
    .select({ crewCode: crews.crewCode })
    .from(crews)
    .where(
      and(
        sql`${crews.clientId} = ${clientCode}`,
        sql`${crews.type} = ${crewType}`
      )
    );

  // Extract sequence numbers from existing codes
  const numbers = existingCodes
    .map((row) => {
      // Pattern: {CLIENT_CODE}-{TYPE}-{NNN}
      const match = row.crewCode.match(/-(\d+)$/);
      return match ? parseInt(match[1], 10) : 0;
    })
    .filter((num) => !isNaN(num));

  // Find the next available sequence number
  const maxNumber = numbers.length > 0 ? Math.max(...numbers) : 0;
  const nextNumber = maxNumber + 1;

  // Pad to 3 digits
  const paddedNumber = nextNumber.toString().padStart(3, '0');

  // Return formatted crew code
  return `${prefix}-${paddedNumber}`;
}
