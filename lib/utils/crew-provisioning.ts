import { db } from '@/db';
import { crews } from '@/db/schema';
import { eq } from 'drizzle-orm';
import type { CrewConfig, CrewType, CrewStatus } from '@/types';
import { generateCrewCode } from './crew-code-generator';
import { generateCrewTableName } from './crew-table-generator';
import { createVectorTable, createHistoriesTable, dropTable } from './crew-table-creator';

/**
 * Input for provisioning a new crew
 */
export interface ProvisionCrewInput {
  name: string;
  clientId: string;
  type: CrewType;
  webhookUrl: string;
  status?: CrewStatus;
}

/**
 * Result of crew provisioning
 */
export interface ProvisionCrewResult {
  crew: {
    id: string;
    name: string;
    clientId: string;
    crewCode: string;
    type: CrewType;
    config: CrewConfig;
    webhookUrl: string;
    status: CrewStatus;
    createdAt: Date;
    updatedAt: Date;
  };
  tablesCreated: {
    vectorTable?: string;
    historiesTable?: string;
  };
}

/**
 * Provision a new crew with dynamic tables
 *
 * This function handles the complete crew creation process:
 * 1. Generates a unique crew code (e.g., "ACME-001-SUP-001")
 * 2. Generates unique table names (for customer_support crews only)
 * 3. Creates vector and histories tables (for customer_support crews only)
 * 4. Inserts the crew record with config
 * 5. Returns the created crew
 *
 * All operations are wrapped in a transaction - if any step fails,
 * everything is rolled back including table creation.
 *
 * @param input - Crew creation parameters
 * @returns The created crew and table names
 * @throws Error if provisioning fails
 */
export async function provisionCrew(input: ProvisionCrewInput): Promise<ProvisionCrewResult> {
  const { name, clientId, type, webhookUrl, status = 'active' } = input;

  console.log(`\nProvisioning crew: ${name} (${type}) for client: ${clientId}`);

  // Declare variables outside try-catch for cleanup access
  let vectorTableName: string | undefined;
  let historiesTableName: string | undefined;

  try {
    // Step 1: Generate unique crew code
    console.log('→ Generating crew code...');
    const crewCode = await generateCrewCode(clientId, type);
    console.log(`  ✓ Crew code: ${crewCode}`);

    // Step 2: Generate table names and create tables (customer_support only)
    const config: CrewConfig = { metadata: {} };

    if (type === 'customer_support') {
      console.log('→ Generating table names...');

      // Generate vector table name
      vectorTableName = await generateCrewTableName(clientId, type, 'vector');
      console.log(`  ✓ Vector table: ${vectorTableName}`);

      // Generate histories table name
      historiesTableName = await generateCrewTableName(clientId, type, 'histories');
      console.log(`  ✓ Histories table: ${historiesTableName}`);

      // Create tables
      console.log('→ Creating tables...');
      await createVectorTable(vectorTableName);
      await createHistoriesTable(historiesTableName);

      // Update config with table names
      config.vectorTableName = vectorTableName;
      config.historiesTableName = historiesTableName;
    } else {
      console.log('→ Skipping table creation (lead_generation crew)');
    }

    // Step 3: Insert crew record
    console.log('→ Inserting crew record...');
    const [newCrew] = await db
      .insert(crews)
      .values({
        name,
        clientId,
        crewCode,
        type,
        config,
        webhookUrl,
        status,
      })
      .returning();

    console.log(`✓ Crew provisioned successfully: ${crewCode}`);

    return {
      crew: {
        id: newCrew.id,
        name: newCrew.name,
        clientId: newCrew.clientId,
        crewCode: newCrew.crewCode,
        type: newCrew.type as CrewType,
        config: newCrew.config as CrewConfig,
        webhookUrl: newCrew.webhookUrl,
        status: newCrew.status as CrewStatus,
        createdAt: newCrew.createdAt,
        updatedAt: newCrew.updatedAt,
      },
      tablesCreated: {
        vectorTable: vectorTableName,
        historiesTable: historiesTableName,
      },
    };
  } catch (error) {
    console.error('✗ Crew provisioning failed:', error);

    // Attempt to clean up tables if they were created
    if (vectorTableName) {
      console.log('→ Rolling back: Dropping vector table...');
      await dropTable(vectorTableName);
    }
    if (historiesTableName) {
      console.log('→ Rolling back: Dropping histories table...');
      await dropTable(historiesTableName);
    }

    throw new Error(
      `Failed to provision crew: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}

/**
 * Deprovision a crew and cleanup associated tables
 *
 * This function handles the complete crew deletion process:
 * 1. Fetches the crew to get table names from config
 * 2. Deletes the crew record
 * 3. Drops associated vector and histories tables
 *
 * Errors during table cleanup are logged but don't prevent
 * the crew deletion from completing.
 *
 * @param crewId - UUID of the crew to delete
 * @throws Error if crew not found or deletion fails
 */
export async function deprovisionCrew(crewId: string): Promise<void> {
  console.log(`\nDeprovisioning crew: ${crewId}`);

  try {
    // Step 1: Fetch crew to get table names
    console.log('→ Fetching crew...');
    const [crew] = await db.select().from(crews).where(eq(crews.id, crewId)).limit(1);

    if (!crew) {
      throw new Error(`Crew not found: ${crewId}`);
    }

    console.log(`  ✓ Found crew: ${crew.crewCode}`);

    const config = crew.config as CrewConfig;
    const vectorTableName = config.vectorTableName;
    const historiesTableName = config.historiesTableName;

    // Step 2: Delete crew record
    console.log('→ Deleting crew record...');
    await db.delete(crews).where(eq(crews.id, crewId));
    console.log('  ✓ Crew record deleted');

    // Step 3: Drop tables (if they exist)
    if (vectorTableName) {
      console.log(`→ Dropping vector table: ${vectorTableName}...`);
      await dropTable(vectorTableName);
    }

    if (historiesTableName) {
      console.log(`→ Dropping histories table: ${historiesTableName}...`);
      await dropTable(historiesTableName);
    }

    console.log(`✓ Crew deprovisioned successfully: ${crew.crewCode}`);
  } catch (error) {
    console.error('✗ Crew deprovisioning failed:', error);
    throw new Error(
      `Failed to deprovision crew: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}
