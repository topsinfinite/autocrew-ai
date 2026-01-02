import { config } from 'dotenv';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { clients, crews, conversations } from './schema';
import * as schema from './schema';
import { provisionCrew } from '../lib/utils/crew-provisioning';
import { sql } from 'drizzle-orm';

// Load environment variables from .env.local
config({ path: '.env.local' });

// Create database connection
const connectionString = process.env.POSTGRES_URL!;
const client = postgres(connectionString, {
  max: 10,
  idle_timeout: 20,
  connect_timeout: 10,
});
const db = drizzle(client, { schema });

const seed = async () => {
  console.log('Starting database seeding...\n');

  try {
    // Clear existing data (crews first due to foreign key)
    console.log('→ Clearing existing crews...');
    // Get all crews to clean up their tables
    const existingCrews = await db.select().from(crews);
    console.log(`  Found ${existingCrews.length} existing crews`);

    // Drop all crew-related tables first
    for (const crew of existingCrews) {
      const config = crew.config as { vectorTableName?: string; historiesTableName?: string };
      if (config.vectorTableName) {
        try {
          await client.unsafe(`DROP TABLE IF EXISTS ${config.vectorTableName} CASCADE`);
          console.log(`  ✓ Dropped table: ${config.vectorTableName}`);
        } catch (error) {
          console.log(`  ⚠ Failed to drop ${config.vectorTableName}`);
        }
      }
      if (config.historiesTableName) {
        try {
          await client.unsafe(`DROP TABLE IF EXISTS ${config.historiesTableName} CASCADE`);
          console.log(`  ✓ Dropped table: ${config.historiesTableName}`);
        } catch (error) {
          console.log(`  ⚠ Failed to drop ${config.historiesTableName}`);
        }
      }
    }

    // Now delete crew records
    await db.delete(crews);
    console.log(`  ✓ Cleared ${existingCrews.length} crews\n`);

    // Clear existing clients
    console.log('→ Clearing existing clients...');
    await db.delete(clients);
    console.log('  ✓ Cleared clients\n');

    // Insert mock clients with new schema
    console.log('Inserting mock clients...');

    const mockClientsData = [
      {
        companyName: 'Acme Corp',
        clientCode: 'ACME-001',
        contactPersonName: 'John Smith',
        contactEmail: 'contact@acmecorp.com',
        phone: '+1-555-0101',
        address: '123 Business Ave',
        city: 'San Francisco',
        country: 'USA',
        plan: 'enterprise' as const,
        status: 'active' as const,
        createdAt: new Date('2024-01-15'),
        updatedAt: new Date('2024-12-28'),
      },
      {
        companyName: 'TechStart',
        clientCode: 'TECHSTART-001',
        contactPersonName: 'Sarah Johnson',
        contactEmail: 'hello@techstart.io',
        phone: '+1-555-0102',
        address: '456 Innovation Blvd',
        city: 'Austin',
        country: 'USA',
        plan: 'professional' as const,
        status: 'active' as const,
        createdAt: new Date('2024-03-22'),
        updatedAt: new Date('2024-12-20'),
      },
      {
        companyName: 'RetailCo Ltd',
        clientCode: 'RETAILCO-001',
        contactPersonName: 'Mike Chen',
        contactEmail: 'info@retailco.com',
        phone: null,
        address: null,
        city: null,
        country: null,
        plan: 'starter' as const,
        status: 'trial' as const,
        createdAt: new Date('2024-11-10'),
        updatedAt: new Date('2024-12-29'),
      },
      {
        companyName: 'FinanceHub Solutions',
        clientCode: 'FINANCEHUB-001',
        contactPersonName: 'Lisa Williams',
        contactEmail: 'support@financehub.com',
        phone: '+1-555-0104',
        address: '789 Finance Street',
        city: 'New York',
        country: 'USA',
        plan: 'professional' as const,
        status: 'active' as const,
        createdAt: new Date('2024-06-08'),
        updatedAt: new Date('2024-12-15'),
      },
      {
        companyName: 'HealthTech',
        clientCode: 'HEALTHTECH-001',
        contactPersonName: 'David Brown',
        contactEmail: 'admin@healthtech.com',
        phone: '+1-555-0105',
        address: '321 Medical Plaza',
        city: 'Boston',
        country: 'USA',
        plan: 'enterprise' as const,
        status: 'active' as const,
        createdAt: new Date('2024-02-20'),
        updatedAt: new Date('2024-12-27'),
      },
    ];

    await db.insert(clients).values(mockClientsData);

    console.log(`  ✓ Successfully seeded ${mockClientsData.length} clients\n`);

    // Verify the seeded clients
    const seededClients = await db.select().from(clients);
    console.log('Seeded clients:');
    seededClients.forEach((client) => {
      console.log(`  - ${client.companyName} (${client.clientCode}) - ${client.status}`);
    });

    // ========================================
    // Seed Crews
    // ========================================
    console.log('\n→ Seeding crews with dynamic tables...\n');

    const crewsData = [
      // ACME-001: 2 support crews + 1 lead gen crew
      {
        name: 'ACME Customer Support Crew',
        clientId: 'ACME-001',
        type: 'customer_support' as const,
        webhookUrl: 'https://n8n.example.com/webhook/acme-support-1',
        status: 'active' as const,
      },
      {
        name: 'ACME Premium Support Crew',
        clientId: 'ACME-001',
        type: 'customer_support' as const,
        webhookUrl: 'https://n8n.example.com/webhook/acme-support-2',
        status: 'active' as const,
      },
      {
        name: 'ACME Lead Generation Crew',
        clientId: 'ACME-001',
        type: 'lead_generation' as const,
        webhookUrl: 'https://n8n.example.com/webhook/acme-leadgen-1',
        status: 'active' as const,
      },
      // TECHSTART-001: 1 support crew
      {
        name: 'TechStart Support Crew',
        clientId: 'TECHSTART-001',
        type: 'customer_support' as const,
        webhookUrl: 'https://n8n.example.com/webhook/techstart-support-1',
        status: 'active' as const,
      },
      // HEALTHTECH-001: 1 support crew
      {
        name: 'HealthTech Patient Support Crew',
        clientId: 'HEALTHTECH-001',
        type: 'customer_support' as const,
        webhookUrl: 'https://n8n.example.com/webhook/healthtech-support-1',
        status: 'active' as const,
      },
    ];

    const provisionedCrews = [];

    for (const crewData of crewsData) {
      console.log(`Provisioning: ${crewData.name}...`);
      try {
        const result = await provisionCrew(crewData);
        provisionedCrews.push(result);

        console.log(`  ✓ Crew Code: ${result.crew.crewCode}`);
        if (result.tablesCreated.vectorTable) {
          console.log(`  ✓ Vector Table: ${result.tablesCreated.vectorTable}`);
        }
        if (result.tablesCreated.historiesTable) {
          console.log(`  ✓ Histories Table: ${result.tablesCreated.historiesTable}`);
        }
        console.log('');
      } catch (error) {
        console.error(`  ✗ Failed to provision ${crewData.name}:`, error);
        throw error;
      }
    }

    console.log(`✓ Successfully seeded ${provisionedCrews.length} crews\n`);

    // Verify the seeded crews
    const seededCrews = await db.select().from(crews);
    console.log('Seeded crews:');
    seededCrews.forEach((crew) => {
      const config = crew.config as { vectorTableName?: string; historiesTableName?: string };
      console.log(`  - ${crew.name}`);
      console.log(`    Code: ${crew.crewCode}`);
      console.log(`    Type: ${crew.type}`);
      console.log(`    Client: ${crew.clientId}`);
      if (config.vectorTableName) {
        console.log(`    Vector Table: ${config.vectorTableName}`);
      }
      if (config.historiesTableName) {
        console.log(`    Histories Table: ${config.historiesTableName}`);
      }
    });

    // ========================================
    // Seed Conversations
    // ========================================
    console.log('\n→ Seeding conversations...\n');

    const conversationSeeds = [
      // ACME-001 conversations
      {
        sessionId: 'session_acme_001',
        clientId: 'ACME-001',
        crewId: provisionedCrews[0].crew.id, // First ACME crew
        customerName: 'John Smith',
        customerEmail: 'john@example.com',
        sentiment: 'positive' as const,
        resolved: true,
        duration: 300,
      },
      {
        sessionId: 'session_acme_002',
        clientId: 'ACME-001',
        crewId: provisionedCrews[0].crew.id,
        customerName: 'Jane Doe',
        customerEmail: 'jane@example.com',
        sentiment: 'neutral' as const,
        resolved: false,
        duration: 180,
      },
      // TECHSTART-001 conversations
      {
        sessionId: 'session_techstart_001',
        clientId: 'TECHSTART-001',
        crewId: provisionedCrews[3].crew.id, // TechStart crew
        customerName: 'Bob Wilson',
        customerEmail: 'bob@techcorp.com',
        sentiment: 'positive' as const,
        resolved: true,
        duration: 240,
      },
      // HEALTHTECH-001 conversations
      {
        sessionId: 'session_healthtech_001',
        clientId: 'HEALTHTECH-001',
        crewId: provisionedCrews[4].crew.id, // HealthTech crew
        customerName: 'Sarah Johnson',
        customerEmail: 'sarah@healthmail.com',
        sentiment: 'negative' as const,
        resolved: false,
        duration: 420,
      },
    ];

    await db.insert(conversations).values(conversationSeeds);
    console.log(`✓ Seeded ${conversationSeeds.length} conversations\n`);

    // ========================================
    // Seed Histories Tables with Messages
    // ========================================
    console.log('→ Seeding histories tables with messages...\n');

    for (const conv of conversationSeeds) {
      const crew = provisionedCrews.find(p => p.crew.id === conv.crewId);
      const config = crew?.crew.config as { historiesTableName?: string };

      if (config?.historiesTableName) {
        try {
          // Validate table name
          if (!/^[a-z0-9_]+$/.test(config.historiesTableName)) {
            console.error(`  ✗ Invalid table name: ${config.historiesTableName}`);
            continue;
          }

          // Insert sample messages
          await client.unsafe(
            `INSERT INTO ${config.historiesTableName} (session_id, message, created_at) VALUES
             ($1, $2, NOW() - INTERVAL '10 minutes'),
             ($1, $3, NOW() - INTERVAL '8 minutes'),
             ($1, $4, NOW() - INTERVAL '5 minutes'),
             ($1, $5, NOW())`,
            [
              conv.sessionId,
              JSON.stringify({
                type: 'human',
                content: 'Hello, I need help with my account',
                additional_kwargs: {},
                response_metadata: {}
              }),
              JSON.stringify({
                type: 'ai',
                content: 'Hi! I\'d be happy to help you with your account. What seems to be the issue?',
                additional_kwargs: {},
                response_metadata: {}
              }),
              JSON.stringify({
                type: 'human',
                content: 'I can\'t access my dashboard. Can you help?',
                additional_kwargs: {},
                response_metadata: {}
              }),
              JSON.stringify({
                type: 'ai',
                content: 'I can help with that! Let me check your account status and get that resolved for you.',
                additional_kwargs: {},
                response_metadata: {}
              })
            ]
          );
          console.log(`  ✓ Seeded messages for ${conv.sessionId} in ${config.historiesTableName}`);
        } catch (error) {
          console.error(`  ✗ Failed to seed messages for ${conv.sessionId}:`, error);
        }
      }
    }

    console.log('\n✓ Database seeding completed successfully!');
  } catch (error) {
    console.error('Seeding failed:', error);
    throw error;
  } finally {
    await client.end();
    process.exit(0);
  }
};

seed().catch((err) => {
  console.error('Fatal error during seeding:', err);
  process.exit(1);
});
