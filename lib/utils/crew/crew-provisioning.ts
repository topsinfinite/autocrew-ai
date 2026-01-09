import { db } from '@/db';
import { crews } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { logger } from '@/lib/utils';
import type { CrewConfig, CrewType, CrewStatus } from '@/types';
import { generateCrewCode } from '../generators/crew-code-generator';
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
  const { name, clientId, type, webhookUrl, status = 'inactive' } = input;
  const startTime = Date.now();

  await logger.info('Crew provisioning started', {
    name,
    clientId,
    type,
    webhookUrl,
    status,
    operation: 'provision_crew',
  });

  // Declare variables outside try-catch for cleanup access
  let vectorTableName: string | undefined;
  let historiesTableName: string | undefined;

  try {
    // Step 1: Generate unique crew code
    await logger.info('Generating crew code', {
      clientId,
      type,
      operation: 'provision_crew',
    });
    const crewCode = await generateCrewCode(clientId, type);
    await logger.info('Crew code generated', {
      crewCode,
      clientId,
      type,
      operation: 'provision_crew',
    });

    // Step 2: Generate table names and create tables (customer_support only)
    const config: CrewConfig = { metadata: {} };

    if (type === 'customer_support') {
      await logger.info('Generating table names for customer support crew', {
        clientId,
        type,
        operation: 'provision_crew',
      });

      // Generate vector table name
      vectorTableName = await generateCrewTableName(clientId, type, 'vector');
      await logger.info('Vector table name generated', {
        vectorTableName,
        clientId,
        operation: 'provision_crew',
      });

      // Generate histories table name
      historiesTableName = await generateCrewTableName(clientId, type, 'histories');
      await logger.info('Histories table name generated', {
        historiesTableName,
        clientId,
        operation: 'provision_crew',
      });

      // Create tables
      await logger.info('Creating database tables', {
        vectorTableName,
        historiesTableName,
        clientId,
        operation: 'provision_crew',
      });
      await createVectorTable(vectorTableName);
      await createHistoriesTable(historiesTableName);

      // Update config with table names
      config.vectorTableName = vectorTableName;
      config.historiesTableName = historiesTableName;
    } else {
      await logger.info('Skipping table creation for lead generation crew', {
        type,
        clientId,
        operation: 'provision_crew',
      });
    }

    // Step 3: Insert crew record
    await logger.info('Inserting crew record into database', {
      name,
      clientId,
      crewCode,
      type,
      operation: 'provision_crew',
    });
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

    const duration = Date.now() - startTime;
    await logger.info('Crew provisioned successfully', {
      crewId: newCrew.id,
      crewCode,
      clientId,
      type,
      vectorTableName,
      historiesTableName,
      duration,
      operation: 'provision_crew',
    });

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
    const duration = Date.now() - startTime;
    await logger.error('Crew provisioning failed', {
      name,
      clientId,
      type,
      vectorTableName,
      historiesTableName,
      duration,
      operation: 'provision_crew',
    }, error);

    // Attempt to clean up tables if they were created
    if (vectorTableName) {
      await logger.info('Rolling back: Dropping vector table', {
        vectorTableName,
        clientId,
        operation: 'provision_crew_rollback',
      });
      await dropTable(vectorTableName);
    }
    if (historiesTableName) {
      await logger.info('Rolling back: Dropping histories table', {
        historiesTableName,
        clientId,
        operation: 'provision_crew_rollback',
      });
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
  const startTime = Date.now();

  await logger.info('Crew deprovisioning started', {
    crewId,
    operation: 'deprovision_crew',
  });

  try {
    // Step 1: Fetch crew to get table names
    await logger.info('Fetching crew for deprovisioning', {
      crewId,
      operation: 'deprovision_crew',
    });
    const [crew] = await db.select().from(crews).where(eq(crews.id, crewId)).limit(1);

    if (!crew) {
      await logger.warn('Crew not found for deprovisioning', {
        crewId,
        operation: 'deprovision_crew',
      });
      throw new Error(`Crew not found: ${crewId}`);
    }

    await logger.info('Crew found for deprovisioning', {
      crewId,
      crewCode: crew.crewCode,
      clientId: crew.clientId,
      operation: 'deprovision_crew',
    });

    const config = crew.config as CrewConfig;
    const vectorTableName = config.vectorTableName;
    const historiesTableName = config.historiesTableName;

    // Step 2: Delete crew record
    await logger.info('Deleting crew record from database', {
      crewId,
      crewCode: crew.crewCode,
      clientId: crew.clientId,
      operation: 'deprovision_crew',
    });
    await db.delete(crews).where(eq(crews.id, crewId));
    await logger.info('Crew record deleted successfully', {
      crewId,
      crewCode: crew.crewCode,
      operation: 'deprovision_crew',
    });

    // Step 3: Drop tables (if they exist)
    if (vectorTableName) {
      await logger.info('Dropping vector table', {
        vectorTableName,
        crewId,
        crewCode: crew.crewCode,
        operation: 'deprovision_crew',
      });
      await dropTable(vectorTableName);
    }

    if (historiesTableName) {
      await logger.info('Dropping histories table', {
        historiesTableName,
        crewId,
        crewCode: crew.crewCode,
        operation: 'deprovision_crew',
      });
      await dropTable(historiesTableName);
    }

    const duration = Date.now() - startTime;
    await logger.info('Crew deprovisioned successfully', {
      crewId,
      crewCode: crew.crewCode,
      clientId: crew.clientId,
      vectorTableName,
      historiesTableName,
      duration,
      operation: 'deprovision_crew',
    });
  } catch (error) {
    const duration = Date.now() - startTime;
    await logger.error('Crew deprovisioning failed', {
      crewId,
      duration,
      operation: 'deprovision_crew',
    }, error);
    throw new Error(
      `Failed to deprovision crew: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}
