/**
 * Database Reset Script
 *
 * This script drops all tables, runs migrations, and seeds the database.
 * DANGEROUS: This will delete ALL data in the database.
 *
 * Usage:
 *   npm run db:reset
 *   tsx scripts/reset-db.ts
 */

import { config } from 'dotenv';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { sql } from 'drizzle-orm';
import { execSync } from 'child_process';

// Load environment variables
config({ path: '.env.local' });

const connectionString = process.env.POSTGRES_URL;

if (!connectionString) {
  console.error('❌ POSTGRES_URL environment variable is not set');
  process.exit(1);
}

async function resetDatabase() {
  console.log('\n🔄 Database Reset Script');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  // Ask for confirmation
  console.log('⚠️  WARNING: This will DELETE ALL DATA in the database!');
  console.log(`📍 Target: ${connectionString!.replace(/\/\/.*@/, '//*****@')}\n`);

  // In production, we'd want user confirmation, but for script we'll auto-confirm
  const shouldProceed = process.argv.includes('--confirm');

  if (!shouldProceed) {
    console.log('❌ Aborted. Use --confirm flag to proceed:');
    console.log('   npm run db:reset -- --confirm');
    console.log('   tsx scripts/reset-db.ts --confirm\n');
    process.exit(0);
  }

  const client = postgres(connectionString!, { max: 1 });
  const db = drizzle(client);

  try {
    // Step 1: Drop all tables
    console.log('🗑️  Step 1: Dropping all tables...');

    // Get all table names in public schema
    const tables = await client`
      SELECT tablename
      FROM pg_tables
      WHERE schemaname = 'public'
    `;

    if (tables.length === 0) {
      console.log('   ℹ️  No tables found');
    } else {
      console.log(`   Found ${tables.length} tables to drop`);

      // Drop tables (including dynamic crew tables)
      for (const { tablename } of tables) {
        await client.unsafe(`DROP TABLE IF EXISTS "${tablename}" CASCADE`);
        console.log(`   ✓ Dropped: ${tablename}`);
      }
    }

    // Step 2: Drop custom types (enums)
    console.log('\n🗑️  Step 2: Dropping custom types...');
    const types = await client`
      SELECT typname
      FROM pg_type
      WHERE typtype = 'e'
      AND typnamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public')
    `;

    for (const { typname } of types) {
      await client.unsafe(`DROP TYPE IF EXISTS "${typname}" CASCADE`);
      console.log(`   ✓ Dropped type: ${typname}`);
    }

    await client.end();

    // Step 3: Run migrations
    console.log('\n📦 Step 3: Running migrations...');
    execSync('npm run db:migrate', { stdio: 'inherit' });

    // Step 4: Seed database
    console.log('\n🌱 Step 4: Seeding database...');
    execSync('npm run db:seed', { stdio: 'inherit' });

    console.log('\n✅ Database reset complete!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    console.log('📝 Default credentials:');
    console.log('   Email: admin@autocrew.ai');
    console.log('   Password: Admin123!@#\n');
  } catch (error) {
    console.error('\n❌ Database reset failed:', error);
    process.exit(1);
  }
}

resetDatabase();
