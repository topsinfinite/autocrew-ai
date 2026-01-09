import { pgTable, uuid, text, timestamp, pgEnum, index, jsonb, boolean, integer } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

// Enums
export const planEnum = pgEnum('plan', ['starter', 'professional', 'enterprise']);
export const statusEnum = pgEnum('status', ['active', 'inactive', 'trial']);
export const crewTypeEnum = pgEnum('crew_type', ['customer_support', 'lead_generation']);
export const crewStatusEnum = pgEnum('crew_status', ['active', 'inactive', 'error']);
export const sentimentEnum = pgEnum('sentiment', ['positive', 'neutral', 'negative']);
export const userRoleEnum = pgEnum('user_role', ['super_admin', 'client_admin', 'viewer']);

// Better Auth: User table
export const user = pgTable(
  'user',
  {
    id: text('id').primaryKey(),
    name: text('name').notNull(),
    email: text('email').notNull().unique(),
    emailVerified: boolean('email_verified').notNull().default(false),
    image: text('image'),
    role: userRoleEnum('role').notNull().default('client_admin'),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => ({
    emailIdx: index('user_email_idx').on(table.email),
    roleIdx: index('user_role_idx').on(table.role),
  })
);

// Better Auth: Session table
export const session = pgTable(
  'session',
  {
    id: text('id').primaryKey(),
    expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
    token: text('token').notNull().unique(),
    ipAddress: text('ip_address'),
    userAgent: text('user_agent'),
    userId: text('user_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
    activeOrganizationId: text('active_organization_id'), // Links to clients.id (organization)
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => ({
    tokenIdx: index('session_token_idx').on(table.token),
    userIdIdx: index('session_user_id_idx').on(table.userId),
    activeOrgIdx: index('session_active_org_idx').on(table.activeOrganizationId),
  })
);

// Better Auth: Account table
export const account = pgTable(
  'account',
  {
    id: text('id').primaryKey(),
    accountId: text('account_id').notNull(),
    providerId: text('provider_id').notNull(),
    userId: text('user_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
    accessToken: text('access_token'),
    refreshToken: text('refresh_token'),
    idToken: text('id_token'),
    accessTokenExpiresAt: timestamp('access_token_expires_at', { withTimezone: true }),
    refreshTokenExpiresAt: timestamp('refresh_token_expires_at', { withTimezone: true }),
    scope: text('scope'),
    password: text('password'),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => ({
    providerIdx: index('account_provider_idx').on(table.providerId),
    userIdIdx: index('account_user_id_idx').on(table.userId),
  })
);

// Better Auth: Verification table
export const verification = pgTable(
  'verification',
  {
    id: text('id').primaryKey(),
    identifier: text('identifier').notNull(),
    value: text('value').notNull(),
    expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => ({
    identifierIdx: index('verification_identifier_idx').on(table.identifier),
  })
);

// Clients table (maps to Better Auth organization)
export const clients = pgTable(
  'clients',
  {
    id: text('id').primaryKey(), // Changed from uuid to text for Better Auth compatibility
    companyName: text('company_name').notNull(),
    clientCode: text('client_code').notNull().unique(),
    slug: text('slug').notNull().unique(), // NEW: For Better Auth organization.slug
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
    slugIdx: index('slug_idx').on(table.slug), // NEW: Index for Better Auth lookups
    statusIdx: index('status_idx').on(table.status),
    planIdx: index('plan_idx').on(table.plan),
    contactEmailIdx: index('contact_email_idx').on(table.contactEmail),
  })
);

// Better Auth: Member table (organization membership)
export const member = pgTable(
  'member',
  {
    id: text('id').primaryKey(),
    organizationId: text('organization_id').notNull().references(() => clients.id, { onDelete: 'cascade' }),
    userId: text('user_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
    role: text('role').notNull().default('member'),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => ({
    orgUserIdx: index('member_org_user_idx').on(table.organizationId, table.userId),
    roleIdx: index('member_role_idx').on(table.role),
  })
);

// Better Auth: Invitation table
export const invitation = pgTable(
  'invitation',
  {
    id: text('id').primaryKey(),
    organizationId: text('organization_id').notNull().references(() => clients.id, { onDelete: 'cascade' }),
    email: text('email').notNull(),
    role: text('role').notNull().default('member'),
    status: text('status').notNull().default('pending'),
    expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
    inviterId: text('inviter_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => ({
    orgIdIdx: index('invitation_org_id_idx').on(table.organizationId),
    emailIdx: index('invitation_email_idx').on(table.email),
    statusIdx: index('invitation_status_idx').on(table.status),
  })
);

// Zod schemas for Better Auth tables
export const insertUserSchema = createInsertSchema(user);
export const selectUserSchema = createSelectSchema(user);

export const insertSessionSchema = createInsertSchema(session);
export const selectSessionSchema = createSelectSchema(session);

export const insertAccountSchema = createInsertSchema(account);
export const selectAccountSchema = createSelectSchema(account);

export const insertVerificationSchema = createInsertSchema(verification);
export const selectVerificationSchema = createSelectSchema(verification);

export const insertMemberSchema = createInsertSchema(member);
export const selectMemberSchema = createSelectSchema(member);

export const insertInvitationSchema = createInsertSchema(invitation);
export const selectInvitationSchema = createSelectSchema(invitation);

// TypeScript types for Better Auth tables
export type User = typeof user.$inferSelect;
export type NewUser = typeof user.$inferInsert;
export type Session = typeof session.$inferSelect;
export type NewSession = typeof session.$inferInsert;
export type Account = typeof account.$inferSelect;
export type NewAccount = typeof account.$inferInsert;
export type Verification = typeof verification.$inferSelect;
export type NewVerification = typeof verification.$inferInsert;
export type Member = typeof member.$inferSelect;
export type NewMember = typeof member.$inferInsert;
export type Invitation = typeof invitation.$inferSelect;
export type NewInvitation = typeof invitation.$inferInsert;

// Zod schemas for clients
export const insertClientSchema = createInsertSchema(clients, {
  id: z.string().optional(), // Auto-generated if not provided
  companyName: z.string().min(1, 'Company name is required'),
  clientCode: z.string().min(1, 'Client code is required').optional(), // Auto-generated if not provided
  slug: z.string()
    .min(3, 'Slug must be at least 3 characters')
    .max(50, 'Slug must be at most 50 characters')
    .regex(/^[a-z0-9-]+$/, 'Slug must contain only lowercase letters, numbers, and hyphens')
    .optional(), // Auto-generated from companyName if not provided
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
    status: crewStatusEnum('status').notNull().default('inactive'),
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
  status: z.enum(['active', 'inactive', 'error']).default('inactive'),
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

// Knowledge Base Documents table (indexes vector tables by docId - mirrors conversations pattern)
export const knowledgeBaseDocuments = pgTable(
  'knowledge_base_documents',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    docId: text('doc_id').notNull().unique(),
    clientId: text('client_id').notNull().references(() => clients.clientCode, { onDelete: 'cascade' }),
    crewId: uuid('crew_id').notNull().references(() => crews.id, { onDelete: 'cascade' }),
    filename: text('filename').notNull(),
    fileType: text('file_type').notNull(),
    fileSize: integer('file_size'),
    chunkCount: integer('chunk_count').notNull().default(0),
    status: text('status').notNull().default('indexed'),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => ({
    docIdIdx: index('kb_doc_id_idx').on(table.docId),
    clientIdIdx: index('kb_client_id_idx').on(table.clientId),
    crewIdIdx: index('kb_crew_id_idx').on(table.crewId),
    createdAtIdx: index('kb_created_at_idx').on(table.createdAt),
    filenameIdx: index('kb_filename_idx').on(table.filename),
  })
);

// Zod schemas for knowledge base documents
export const insertKnowledgeBaseDocumentSchema = createInsertSchema(knowledgeBaseDocuments, {
  docId: z.string().min(1, 'Document ID is required'),
  clientId: z.string().min(1, 'Client ID is required'),
  crewId: z.string().uuid('Invalid crew ID'),
  filename: z.string().min(1, 'Filename is required'),
  fileType: z.string().min(1, 'File type is required'),
  status: z.enum(['indexed', 'processing', 'error']).default('indexed'),
});

export const selectKnowledgeBaseDocumentSchema = createSelectSchema(knowledgeBaseDocuments);

// TypeScript types for knowledge base documents
// Note: KnowledgeBaseDocument type is defined in types/index.ts to maintain consistency
export type NewKnowledgeBaseDocument = typeof knowledgeBaseDocuments.$inferInsert;
