CREATE TYPE "public"."conversation_status" AS ENUM('pending', 'completed');--> statement-breakpoint
ALTER TABLE "conversations" ADD COLUMN "status" "conversation_status" DEFAULT 'pending' NOT NULL;--> statement-breakpoint
CREATE INDEX "conversation_status_idx" ON "conversations" USING btree ("status");