CREATE TYPE "public"."user_role" AS ENUM('super_admin', 'client_admin', 'viewer');--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "role" "user_role" DEFAULT 'client_admin' NOT NULL;--> statement-breakpoint
CREATE INDEX "user_role_idx" ON "user" USING btree ("role");