import { config } from 'dotenv';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { clients } from './schema';
import * as schema from './schema';

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

const seedClients = async () => {
  console.log('Starting database seeding...');

  try {
    // Clear existing clients
    console.log('Clearing existing clients...');
    await db.delete(clients);

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

    console.log(`Successfully seeded ${mockClientsData.length} clients`);

    // Verify the seeded data
    const seededClients = await db.select().from(clients);
    console.log('\nSeeded clients:');
    seededClients.forEach((client) => {
      console.log(`- ${client.companyName} (${client.clientCode}) - ${client.status}`);
    });

    console.log('\nDatabase seeding completed successfully!');
  } catch (error) {
    console.error('Seeding failed:', error);
    throw error;
  } finally {
    await client.end();
    process.exit(0);
  }
};

seedClients().catch((err) => {
  console.error('Fatal error during seeding:', err);
  process.exit(1);
});
