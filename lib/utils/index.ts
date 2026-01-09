/**
 * Utility functions barrel export
 *
 * Shared utility functions organized by category:
 * - cn: Tailwind className utility (from lib/utils/cn.ts)
 * - Generators: Code generation, identifiers, slugs
 * - Transformers: Data transformation and formatting
 * - Validators: File and input validation
 *
 * Note: Server-side utilities (crew, database) are NOT exported here to prevent client-side bundling issues.
 * Import them directly:
 * - import { provisionCrew } from '@/lib/utils/crew'
 * - import { cleanupOrphanedTables } from '@/lib/utils/database'
 *
 * Usage: import { cn, generateSlug, validateFile } from '@/lib/utils'
 */

// Tailwind className utility
export * from './cn';

// Code generators
export * from './generators';

// Data transformers
export * from './transformers';

// Validators
export * from './validators';

// Server-side utilities are NOT exported here to prevent client-side bundling issues
// Import them directly:
// - import { provisionCrew, deprovisionCrew } from '@/lib/utils/crew'
// - import { cleanupOrphanedTables, findOrphanedTables } from '@/lib/utils/database'
