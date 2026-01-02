import { pgTable, uuid, text, timestamp, pgEnum, index, jsonb, boolean, integer } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

// Enums
export const planEnum = pgEnum('plan', ['starter', 'professional', 'enterprise']);
export const statusEnum = pgEnum('status', ['active', 'inactive', 'trial']);
export const crewTypeEnum = pgEnum('crew_type', ['customer_support', 'lead_generation']);
export const crewStatusEnum = pgEnum('crew_status', ['active', 'inactive', 'error']);
export const sentimentEnum = pgEnum('sentiment', ['positive', 'neutral', 'negative']);

// Clients table
export const clients = pgTable(
  'clients',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    companyName: text('company_name').notNull(),
    clientCode: text('client_code').notNull().unique(),
    contactPersonName: text('contact_person_name').notNull(),
    contactEmail: text('contact_email').notNull(),
    phone: text('phone'),
    address: text('address'),
    city: text('city'),
    country: text('country'),
    plan: planEnum('plan').notNull(),
    status: statusEnum('status').notNull().default('trial'),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => ({
    clientCodeIdx: index('client_code_idx').on(table.clientCode),
    statusIdx: index('status_idx').on(table.status),
    planIdx: index('plan_idx').on(table.plan),
    contactEmailIdx: index('contact_email_idx').on(table.contactEmail),
  })
);

// Zod schemas
export const insertClientSchema = createInsertSchema(clients, {
  companyName: z.string().min(1, 'Company name is required'),
  clientCode: z.string().min(1, 'Client code is required').optional(), // Auto-generated if not provided
  contactPersonName: z.string().min(1, 'Contact person name is required'),
  contactEmail: z.string().email('Invalid email address'),
  phone: z.string().optional().nullable(),
  address: z.string().optional().nullable(),
  city: z.string().optional().nullable(),
  country: z.string().optional().nullable(),
  plan: z.enum(['starter', 'professional', 'enterprise']),
  status: z.enum(['active', 'inactive', 'trial']).default('trial'),
});

export const selectClientSchema = createSelectSchema(clients);

// TypeScript types
export type Client = typeof clients.$inferSelect;
export type NewClient = typeof clients.$inferInsert;

// Crews table
export const crews = pgTable(
  'crews',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    name: text('name').notNull(),
    clientId: text('client_id').notNull().references(() => clients.clientCode, { onDelete: 'cascade' }),
    crewCode: text('crew_code').notNull().unique(),
    type: crewTypeEnum('type').notNull(),
    config: jsonb('config').notNull().default('{}'),
    webhookUrl: text('webhook_url').notNull(),
    status: crewStatusEnum('status').notNull().default('active'),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => ({
    clientIdIdx: index('crew_client_id_idx').on(table.clientId),
    crewCodeIdx: index('crew_code_idx').on(table.crewCode),
    typeIdx: index('crew_type_idx').on(table.type),
    statusIdx: index('crew_status_idx').on(table.status),
    nameIdx: index('crew_name_idx').on(table.name),
  })
);

// CrewConfig interface for JSONB structure
export const crewConfigSchema = z.object({
  vectorTableName: z.string().optional(),
  historiesTableName: z.string().optional(),
  metadata: z.record(z.string(), z.unknown()).default({}),
});

export type CrewConfig = z.infer<typeof crewConfigSchema>;

// Zod schemas for crews
export const insertCrewSchema = createInsertSchema(crews, {
  name: z.string().min(1, 'Crew name is required'),
  clientId: z.string().min(1, 'Client ID is required'),
  crewCode: z.string().optional(), // Auto-generated if not provided
  type: z.enum(['customer_support', 'lead_generation']),
  config: crewConfigSchema.optional(),
  webhookUrl: z.string().url('Invalid webhook URL'),
  status: z.enum(['active', 'inactive', 'error']).default('active'),
});

export const selectCrewSchema = createSelectSchema(crews);

// TypeScript types for crews
export type Crew = typeof crews.$inferSelect;
export type NewCrew = typeof crews.$inferInsert;

// Conversations table (indexes histories tables by sessionId)
export const conversations = pgTable(
  'conversations',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    sessionId: text('session_id').notNull().unique(),
    clientId: text('client_id').notNull().references(() => clients.clientCode, { onDelete: 'cascade' }),
    crewId: uuid('crew_id').notNull().references(() => crews.id, { onDelete: 'cascade' }),
    customerName: text('customer_name'),
    customerEmail: text('customer_email'),
    sentiment: sentimentEnum('sentiment'),
    resolved: boolean('resolved').default(false),
    duration: integer('duration'),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => ({
    sessionIdIdx: index('conversation_session_id_idx').on(table.sessionId),
    clientIdIdx: index('conversation_client_id_idx').on(table.clientId),
    crewIdIdx: index('conversation_crew_id_idx').on(table.crewId),
    createdAtIdx: index('conversation_created_at_idx').on(table.createdAt),
    sentimentIdx: index('conversation_sentiment_idx').on(table.sentiment),
  })
);

// Zod schemas for conversations
export const insertConversationSchema = createInsertSchema(conversations, {
  sessionId: z.string().min(1, 'Session ID is required'),
  clientId: z.string().min(1, 'Client ID is required'),
  crewId: z.string().uuid('Invalid crew ID'),
  customerEmail: z.string().email('Invalid email address').optional().nullable(),
  sentiment: z.enum(['positive', 'neutral', 'negative']).optional().nullable(),
});

export const selectConversationSchema = createSelectSchema(conversations);

// TypeScript types for conversations
export type ConversationRow = typeof conversations.$inferSelect;
export type NewConversation = typeof conversations.$inferInsert;
