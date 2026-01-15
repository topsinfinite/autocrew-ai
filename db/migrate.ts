import { config } from 'dotenv';
import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import postgres from 'postgres';

// Load environment variables from .env.local (for local development)
// In production (Vercel), env vars are already set
config({ path: '.env.local' });

const runMigration = async () => {
  const connectionString = process.env.POSTGRES_URL;

  if (!connectionString) {
    console.error('POSTGRES_URL environment variable is not set');
    // Don't fail the build if no database URL - might be a preview deployment
    if (process.env.VERCEL) {
      console.log('Skipping migrations - no database URL configured for this environment');
      process.exit(0);
    }
    throw new Error('POSTGRES_URL environment variable is not set');
  }

  console.log('🔄 Running database migrations...');
  console.log(`   Environment: ${process.env.VERCEL ? 'Vercel' : 'Local'}`);

  const migrationClient = postgres(connectionString, {
    max: 1,
    // Add timeout for Vercel build
    connect_timeout: 30,
  });
  const db = drizzle(migrationClient);

  try {
    // Enable pgvector extension before running migrations
    console.log('   Enabling pgvector extension...');
    await migrationClient`CREATE EXTENSION IF NOT EXISTS vector`;
    console.log('   ✓ pgvector extension enabled');

    // Verify pgvector extension is installed
    const extensionCheck = await migrationClient`
      SELECT * FROM pg_extension WHERE extname = 'vector'
    `;

    if (extensionCheck.length === 0) {
      throw new Error('pgvector extension failed to install');
    }

    console.log('   ✓ pgvector extension verified');

    // Run migrations
    console.log('   Applying migrations...');
    await migrate(db, { migrationsFolder: './db/migrations' });
    console.log('✅ Migrations completed successfully');

    await migrationClient.end();
    process.exit(0);
  } catch (err: any) {
    // Check if it's just "no migrations to run" which is not an error
    if (err.message?.includes('No migrations to run')) {
      console.log('✅ Database is up to date - no new migrations');
      await migrationClient.end();
      process.exit(0);
    }
    throw err;
  }
};

runMigration().catch((err) => {
  console.error('❌ Migration failed:', err);
  process.exit(1);
});
