-- Better Auth Integration Migration
-- This migration adds Better Auth tables and updates clients table

-- Step 1: Create Better Auth core tables
CREATE TABLE IF NOT EXISTS "user" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"email_verified" boolean DEFAULT false NOT NULL,
	"image" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "user_email_unique" UNIQUE("email")
);

CREATE TABLE IF NOT EXISTS "session" (
	"id" text PRIMARY KEY NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"token" text NOT NULL,
	"ip_address" text,
	"user_agent" text,
	"user_id" text NOT NULL,
	"active_organization_id" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "session_token_unique" UNIQUE("token")
);

CREATE TABLE IF NOT EXISTS "account" (
	"id" text PRIMARY KEY NOT NULL,
	"account_id" text NOT NULL,
	"provider_id" text NOT NULL,
	"user_id" text NOT NULL,
	"access_token" text,
	"refresh_token" text,
	"id_token" text,
	"access_token_expires_at" timestamp with time zone,
	"refresh_token_expires_at" timestamp with time zone,
	"scope" text,
	"password" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "verification" (
	"id" text PRIMARY KEY NOT NULL,
	"identifier" text NOT NULL,
	"value" text NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);

-- Step 2: Modify clients table
-- First, change id column type from uuid to text
ALTER TABLE "clients" ALTER COLUMN "id" SET DATA TYPE text;
ALTER TABLE "clients" ALTER COLUMN "id" DROP DEFAULT;

-- Add slug column (nullable first for backfilling)
ALTER TABLE "clients" ADD COLUMN IF NOT EXISTS "slug" text;

-- Backfill slug from clientCode for existing records
-- Convert to lowercase and replace non-alphanumeric with hyphens
UPDATE "clients"
SET "slug" = LOWER(REGEXP_REPLACE("client_code", '[^a-zA-Z0-9]+', '-', 'g'))
WHERE "slug" IS NULL;

-- Now make slug NOT NULL and add unique constraint
ALTER TABLE "clients" ALTER COLUMN "slug" SET NOT NULL;
ALTER TABLE "clients" ADD CONSTRAINT "clients_slug_unique" UNIQUE("slug");

-- Step 3: Create member and invitation tables (after clients is updated)
CREATE TABLE IF NOT EXISTS "member" (
	"id" text PRIMARY KEY NOT NULL,
	"organization_id" text NOT NULL,
	"user_id" text NOT NULL,
	"role" text DEFAULT 'member' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "invitation" (
	"id" text PRIMARY KEY NOT NULL,
	"organization_id" text NOT NULL,
	"email" text NOT NULL,
	"role" text DEFAULT 'member' NOT NULL,
	"status" text DEFAULT 'pending' NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"inviter_id" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);

-- Step 4: Add foreign key constraints
ALTER TABLE "account" ADD CONSTRAINT "account_user_id_user_id_fk"
	FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;

ALTER TABLE "session" ADD CONSTRAINT "session_user_id_user_id_fk"
	FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;

ALTER TABLE "member" ADD CONSTRAINT "member_organization_id_clients_id_fk"
	FOREIGN KEY ("organization_id") REFERENCES "public"."clients"("id") ON DELETE cascade ON UPDATE no action;

ALTER TABLE "member" ADD CONSTRAINT "member_user_id_user_id_fk"
	FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;

ALTER TABLE "invitation" ADD CONSTRAINT "invitation_organization_id_clients_id_fk"
	FOREIGN KEY ("organization_id") REFERENCES "public"."clients"("id") ON DELETE cascade ON UPDATE no action;

ALTER TABLE "invitation" ADD CONSTRAINT "invitation_inviter_id_user_id_fk"
	FOREIGN KEY ("inviter_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;

-- Step 5: Create indexes for Better Auth tables
CREATE INDEX IF NOT EXISTS "user_email_idx" ON "user" USING btree ("email");
CREATE INDEX IF NOT EXISTS "session_token_idx" ON "session" USING btree ("token");
CREATE INDEX IF NOT EXISTS "session_user_id_idx" ON "session" USING btree ("user_id");
CREATE INDEX IF NOT EXISTS "session_active_org_idx" ON "session" USING btree ("active_organization_id");
CREATE INDEX IF NOT EXISTS "account_provider_idx" ON "account" USING btree ("provider_id");
CREATE INDEX IF NOT EXISTS "account_user_id_idx" ON "account" USING btree ("user_id");
CREATE INDEX IF NOT EXISTS "verification_identifier_idx" ON "verification" USING btree ("identifier");
CREATE INDEX IF NOT EXISTS "member_org_user_idx" ON "member" USING btree ("organization_id","user_id");
CREATE INDEX IF NOT EXISTS "member_role_idx" ON "member" USING btree ("role");
CREATE INDEX IF NOT EXISTS "invitation_org_id_idx" ON "invitation" USING btree ("organization_id");
CREATE INDEX IF NOT EXISTS "invitation_email_idx" ON "invitation" USING btree ("email");
CREATE INDEX IF NOT EXISTS "invitation_status_idx" ON "invitation" USING btree ("status");

-- Step 6: Create index for clients slug
CREATE INDEX IF NOT EXISTS "slug_idx" ON "clients" USING btree ("slug");

-- Add helpful comments
COMMENT ON TABLE "user" IS 'Better Auth: User authentication and identity';
COMMENT ON TABLE "session" IS 'Better Auth: User sessions with organization context';
COMMENT ON TABLE "account" IS 'Better Auth: OAuth providers and password storage';
COMMENT ON TABLE "verification" IS 'Better Auth: Email verification and password reset tokens';
COMMENT ON TABLE "member" IS 'Better Auth: Organization membership and roles';
COMMENT ON TABLE "invitation" IS 'Better Auth: Organization invitation management';
COMMENT ON COLUMN "clients"."slug" IS 'URL-friendly identifier for Better Auth organization plugin';
