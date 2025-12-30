import { pgTable, uuid, text, timestamp, pgEnum, index } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

// Enums
export const planEnum = pgEnum('plan', ['starter', 'professional', 'enterprise']);
export const statusEnum = pgEnum('status', ['active', 'inactive', 'trial']);

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
