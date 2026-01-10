import { db } from '@/db';
import { crews } from '@/db/schema';
import { sql } from 'drizzle-orm';
import { dropTable } from '../crew/crew-table-creator';

/**
 * Orphaned table information
 */
export interface OrphanedTable {
  tableName: string;
  tableType: 'vector' | 'histories';
  reason: string;
}

/**
 * Find all crew-related tables that are not registered in any crew config
 *
 * A table is considered orphaned if:
 * 1. It matches the crew table naming pattern
 * 2. It's not listed in any crew's config.vectorTableName or config.historiesTableName
 *
 * Pattern: __{client_code}_{crew_type}_{table_type}_{sequence}
 * Examples: __acme_001_support_vector_001, __acme_001_support_histories_001
 *
 * @returns Array of orphaned table information
 */
export async function findOrphanedTables(): Promise<OrphanedTable[]> {
  console.log('\n🔍 Scanning for orphaned tables...');

  try {
    // Step 1: Get all tables matching the crew table pattern
    const result = await db.execute(sql`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
      AND table_name ~ '^__[a-z0-9]+_[0-9]+_(support|leadgen)_(vector|histories)_[0-9]{3}$'
      ORDER BY table_name
    `);

    const allCrewTables = result as unknown as { table_name: string }[];
    console.log(`  Found ${allCrewTables.length} tables matching crew pattern`);

    if (allCrewTables.length === 0) {
      console.log('  ✓ No crew tables found');
      return [];
    }

    // Step 2: Get all registered table names from crew configs
    const allCrews = await db.select({ config: crews.config }).from(crews);

    const registeredTables = new Set<string>();
    for (const crew of allCrews) {
      const config = crew.config as { vectorTableName?: string; historiesTableName?: string };
      if (config.vectorTableName) {
        registeredTables.add(config.vectorTableName);
      }
      if (config.historiesTableName) {
        registeredTables.add(config.historiesTableName);
      }
    }

    console.log(`  Found ${registeredTables.size} registered tables in ${allCrews.length} crews`);

    // Step 3: Find orphaned tables
    const orphanedTables: OrphanedTable[] = [];

    for (const { table_name } of allCrewTables) {
      if (!registeredTables.has(table_name)) {
        // Determine table type from name
        const tableType = table_name.includes('_vector_') ? 'vector' : 'histories';

        orphanedTables.push({
          tableName: table_name,
          tableType,
          reason: 'Not registered in any crew config',
        });
      }
    }

    if (orphanedTables.length === 0) {
      console.log('  ✓ No orphaned tables found');
    } else {
      console.log(`  ⚠️  Found ${orphanedTables.length} orphaned tables:`);
      for (const table of orphanedTables) {
        console.log(`     - ${table.tableName} (${table.tableType})`);
      }
    }

    return orphanedTables;
  } catch (error) {
    console.error('✗ Failed to scan for orphaned tables:', error);
    throw error;
  }
}

/**
 * Cleanup orphaned tables
 *
 * @param dryRun - If true, only report what would be deleted without actually deleting
 * @returns Array of cleaned up table names
 */
export async function cleanupOrphanedTables(dryRun: boolean = true): Promise<string[]> {
  console.log(`\n🧹 Cleanup orphaned tables (dry-run: ${dryRun ? 'ON' : 'OFF'})...`);

  const orphanedTables = await findOrphanedTables();

  if (orphanedTables.length === 0) {
    console.log('  ✓ Nothing to clean up');
    return [];
  }

  const cleanedTables: string[] = [];

  if (dryRun) {
    console.log('\n  DRY RUN - Would delete the following tables:');
    for (const table of orphanedTables) {
      console.log(`    - ${table.tableName}`);
      cleanedTables.push(table.tableName);
    }
    console.log('\n  Run with dryRun=false to actually delete these tables');
  } else {
    console.log('\n  Deleting orphaned tables...');
    for (const table of orphanedTables) {
      try {
        await dropTable(table.tableName);
        cleanedTables.push(table.tableName);
      } catch (error) {
        console.error(`    ✗ Failed to drop ${table.tableName}:`, error);
        // Continue with other tables even if one fails
      }
    }

    console.log(`\n  ✓ Cleaned up ${cleanedTables.length} orphaned tables`);
  }

  return cleanedTables;
}

/**
 * Get statistics about crew tables
 */
export async function getCrewTableStats(): Promise<{
  totalCrewTables: number;
  registeredTables: number;
  orphanedTables: number;
  vectorTables: number;
  historiesTables: number;
}> {
  const orphaned = await findOrphanedTables();

  // Get all crew tables
  const result = await db.execute(sql`
    SELECT table_name
    FROM information_schema.tables
    WHERE table_schema = 'public'
    AND table_name ~ '^__[a-z0-9]+_[0-9]+_(support|leadgen)_(vector|histories)_[0-9]{3}$'
  `);

  const allCrewTables = result as unknown as { table_name: string }[];

  const vectorTables = allCrewTables.filter((t) => t.table_name.includes('_vector_')).length;
  const historiesTables = allCrewTables.filter((t) => t.table_name.includes('_histories_')).length;

  return {
    totalCrewTables: allCrewTables.length,
    registeredTables: allCrewTables.length - orphaned.length,
    orphanedTables: orphaned.length,
    vectorTables,
    historiesTables,
  };
}
