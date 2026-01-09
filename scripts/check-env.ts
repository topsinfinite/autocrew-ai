/**
 * Environment Variables Validation Script
 *
 * This script validates that all required environment variables are set
 * and have valid values using Zod schemas.
 *
 * Usage:
 *   npm run check-env
 *   tsx scripts/check-env.ts
 */

import { config } from 'dotenv';
import { z } from 'zod';

// Load environment variables
config({ path: '.env.local' });

// Define validation schema
const envSchema = z.object({
  // Database
  POSTGRES_URL: z.string()
    .url()
    .startsWith('postgresql://', 'POSTGRES_URL must start with postgresql://'),

  // Better Auth
  BETTER_AUTH_SECRET: z.string()
    .min(32, 'BETTER_AUTH_SECRET must be at least 32 characters'),
  BETTER_AUTH_URL: z.string()
    .url()
    .or(z.literal('http://localhost:3000')),

  // Application
  NEXT_PUBLIC_APP_URL: z.string()
    .url()
    .or(z.literal('http://localhost:3000')),

  // n8n Integration (optional in development)
  N8N_API_KEY: z.string().optional(),
  N8N_DOCUMENT_UPLOAD_WEBHOOK: z.string().url().optional(),

  // Email (optional in development)
  EMAIL_FROM: z.string().email().optional(),
  EMAIL_SERVER_HOST: z.string().optional(),
  EMAIL_SERVER_PORT: z.coerce.number().optional(),
  EMAIL_SERVER_USER: z.string().optional(),
  EMAIL_SERVER_PASSWORD: z.string().optional(),
});

// Type inference
type EnvVars = z.infer<typeof envSchema>;

function checkEnvironmentVariables() {
  console.log('\n🔍 Environment Variables Check');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  try {
    const result = envSchema.safeParse(process.env);

    if (!result.success) {
      console.log('❌ Environment validation failed!\n');

      // Group errors by field
      const errors = result.error.issues;
      const groupedErrors: Record<string, string[]> = {};

      for (const error of errors) {
        const field = error.path.join('.');
        if (!groupedErrors[field]) {
          groupedErrors[field] = [];
        }
        groupedErrors[field].push(error.message);
      }

      // Display errors
      for (const [field, messages] of Object.entries(groupedErrors)) {
        console.log(`❌ ${field}:`);
        for (const message of messages) {
          console.log(`   ${message}`);
        }
        console.log();
      }

      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
      console.log('📝 Example .env.local file:\n');
      console.log('# Database');
      console.log('POSTGRES_URL=postgresql://user:password@host:port/database\n');
      console.log('# Better Auth');
      console.log('BETTER_AUTH_SECRET=your-secret-key-here-min-32-chars');
      console.log('BETTER_AUTH_URL=http://localhost:3000\n');
      console.log('# Application');
      console.log('NEXT_PUBLIC_APP_URL=http://localhost:3000\n');
      console.log('# n8n Integration (optional)');
      console.log('N8N_API_KEY=your-n8n-api-key');
      console.log('N8N_DOCUMENT_UPLOAD_WEBHOOK=https://your-n8n-instance.com/webhook/document-upload\n');
      console.log('# Email (optional)');
      console.log('EMAIL_FROM=noreply@yourdomain.com');
      console.log('EMAIL_SERVER_HOST=smtp.example.com');
      console.log('EMAIL_SERVER_PORT=587');
      console.log('EMAIL_SERVER_USER=your-smtp-user');
      console.log('EMAIL_SERVER_PASSWORD=your-smtp-password\n');

      process.exit(1);
    }

    // Success - show summary
    console.log('✅ All required environment variables are valid!\n');

    // Display which optional variables are set
    const env = result.data;

    console.log('📋 Configuration Summary:');
    console.log(`   Database: ${maskConnectionString(env.POSTGRES_URL)}`);
    console.log(`   Auth URL: ${env.BETTER_AUTH_URL}`);
    console.log(`   App URL: ${env.NEXT_PUBLIC_APP_URL}`);

    if (env.N8N_API_KEY && env.N8N_DOCUMENT_UPLOAD_WEBHOOK) {
      console.log(`   n8n Integration: ✅ Configured`);
    } else {
      console.log(`   n8n Integration: ⚠️  Not configured (optional)`);
    }

    if (env.EMAIL_FROM && env.EMAIL_SERVER_HOST) {
      console.log(`   Email: ✅ Configured (${env.EMAIL_FROM})`);
    } else {
      console.log(`   Email: ⚠️  Not configured (optional)`);
    }

    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  } catch (error) {
    console.error('❌ Unexpected error:', error);
    process.exit(1);
  }
}

/**
 * Mask sensitive parts of connection string
 */
function maskConnectionString(url: string): string {
  try {
    const parsed = new URL(url);
    if (parsed.password) {
      parsed.password = '*****';
    }
    if (parsed.username) {
      parsed.username = '*****';
    }
    return parsed.toString();
  } catch {
    return 'Invalid URL';
  }
}

checkEnvironmentVariables();
