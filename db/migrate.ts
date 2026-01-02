import { config } from 'dotenv';
import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import postgres from 'postgres';

// Load environment variables from .env.local
config({ path: '.env.local' });

const runMigration = async () => {
  const connectionString = process.env.POSTGRES_URL;

  if (!connectionString) {
    throw new Error('POSTGRES_URL environment variable is not set');
  }

  console.log('Connecting to database...');

  const migrationClient = postgres(connectionString, { max: 1 });
  const db = drizzle(migrationClient);

  // Enable pgvector extension before running migrations
  console.log('Enabling pgvector extension...');
  await migrationClient`CREATE EXTENSION IF NOT EXISTS vector`;
  console.log('✓ pgvector extension enabled');

  // Verify pgvector extension is installed
  const extensionCheck = await migrationClient`
    SELECT * FROM pg_extension WHERE extname = 'vector'
  `;

  if (extensionCheck.length === 0) {
    throw new Error('pgvector extension failed to install');
  }

  console.log('✓ pgvector extension verified');

  // Run migrations
  console.log('Running migrations...');
  await migrate(db, { migrationsFolder: './db/migrations' });
  console.log('✓ Migrations completed successfully');

  await migrationClient.end();
  process.exit(0);
};

runMigration().catch((err) => {
  console.error('Migration failed:', err);
  process.exit(1);
});
