/**
 * Cleanup Orphaned Tables Script
 *
 * This script finds and optionally deletes crew-related tables
 * that are not registered in any crew's config.
 *
 * Usage:
 *   npm run db:cleanup          # Dry run (shows what would be deleted)
 *   npm run db:cleanup -- --confirm  # Actually delete tables
 */

import { config } from 'dotenv';
import {
  findOrphanedTables,
  cleanupOrphanedTables,
  getCrewTableStats,
} from '../lib/utils/database/cleanup-orphaned-tables';

// Load environment variables
config({ path: '.env.local' });

async function main() {
  console.log('\n🧹 Orphaned Tables Cleanup Script');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  try {
    // Check for confirmation flag
    const shouldDelete = process.argv.includes('--confirm');

    if (!shouldDelete) {
      console.log('ℹ️  Running in DRY RUN mode (no tables will be deleted)');
      console.log('   Use --confirm flag to actually delete tables\n');
    }

    // Get statistics
    const stats = await getCrewTableStats();

    console.log('📊 Crew Tables Statistics:');
    console.log(`   Total crew tables: ${stats.totalCrewTables}`);
    console.log(`   Registered tables: ${stats.registeredTables}`);
    console.log(`   Orphaned tables: ${stats.orphanedTables}`);
    console.log(`   Vector tables: ${stats.vectorTables}`);
    console.log(`   Histories tables: ${stats.historiesTables}\n`);

    if (stats.orphanedTables === 0) {
      console.log('✅ No orphaned tables found!\n');
      return;
    }

    // Find orphaned tables
    console.log('🔍 Scanning for orphaned tables...\n');
    const orphaned = await findOrphanedTables();

    if (orphaned.length === 0) {
      console.log('✅ No orphaned tables found!\n');
      return;
    }

    // Cleanup
    console.log(`\n📝 Found ${orphaned.length} orphaned table(s):`);
    for (const table of orphaned) {
      console.log(`   - ${table.tableName} (${table.tableType})`);
      console.log(`     Reason: ${table.reason}`);
    }
    console.log();

    if (shouldDelete) {
      console.log('⚠️  Proceeding with deletion...\n');
      const cleaned = await cleanupOrphanedTables(false);
      console.log(`\n✅ Successfully cleaned up ${cleaned.length} table(s)!`);
    } else {
      console.log('💡 To delete these tables, run:');
      console.log('   npm run db:cleanup -- --confirm');
      console.log('   tsx scripts/cleanup-orphaned-tables.ts --confirm');
    }

    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  } catch (error) {
    console.error('\n❌ Cleanup failed:', error);
    process.exit(1);
  }
}

main();
