import { db } from '@/db';
import { clients } from '@/db/schema';
import { like, sql } from 'drizzle-orm';

/**
 * Extract prefix from company name
 * Algorithm:
 * 1. Remove common suffixes (Inc, Ltd, Corp, LLC, etc.)
 * 2. Remove special characters and extra spaces
 * 3. Take first word
 * 4. Limit to 10 characters
 * 5. Convert to uppercase
 */
export function extractPrefix(companyName: string): string {
  // Remove common company suffixes
  let cleanName = companyName
    .replace(/\b(Inc|Ltd|Corp|LLC|Limited|Corporation|Company|Co|Solutions|Services)\b\.?/gi, '')
    .trim();

  // Remove special characters and extra spaces
  cleanName = cleanName.replace(/[^a-zA-Z0-9\s]/g, '').replace(/\s+/g, ' ').trim();

  // Take first word and limit to 10 characters
  const firstWord = cleanName.split(' ')[0] || 'CLIENT';
  const prefix = firstWord.substring(0, 10).toUpperCase();

  return prefix || 'CLIENT';
}

/**
 * Check if a client code is available
 */
export async function isClientCodeAvailable(clientCode: string): Promise<boolean> {
  const existing = await db
    .select({ clientCode: clients.clientCode })
    .from(clients)
    .where(sql`${clients.clientCode} = ${clientCode}`)
    .limit(1);

  return existing.length === 0;
}

/**
 * Generate a unique client code for a company
 * Format: {PREFIX}-{NNN}
 * Example: "ACME-001", "TECHSTART-002"
 */
export async function generateClientCode(companyName: string): Promise<string> {
  const prefix = extractPrefix(companyName);

  // Find all existing codes with the same prefix
  const existingCodes = await db
    .select({ clientCode: clients.clientCode })
    .from(clients)
    .where(like(clients.clientCode, `${prefix}-%`));

  // Extract numbers from existing codes
  const numbers = existingCodes
    .map((row) => {
      const match = row.clientCode.match(/-(\d+)$/);
      return match ? parseInt(match[1], 10) : 0;
    })
    .filter((num) => !isNaN(num));

  // Find the next available number
  const maxNumber = numbers.length > 0 ? Math.max(...numbers) : 0;
  const nextNumber = maxNumber + 1;

  // Pad to 3 digits
  const paddedNumber = nextNumber.toString().padStart(3, '0');

  // Return formatted client code
  return `${prefix}-${paddedNumber}`;
}
