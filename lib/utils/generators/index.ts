/**
 * Code generators barrel export
 *
 * Client-safe utilities for generating slugs.
 *
 * Note: Server-side code generators (client-code-generator, crew-code-generator)
 * are NOT exported here to prevent client-side bundling issues.
 * Import them directly:
 * - import { generateClientCode } from '@/lib/utils/generators/client-code-generator'
 * - import { generateCrewCode } from '@/lib/utils/generators/crew-code-generator'
 */

// Client-safe slug utilities (no database dependencies)
export * from './slug-generator';

// Server-side generators are NOT exported (require database access)
// Import directly: '@/lib/utils/generators/client-code-generator' or '@/lib/utils/generators/crew-code-generator'
