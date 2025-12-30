CREATE TYPE "public"."plan" AS ENUM('starter', 'professional', 'enterprise');--> statement-breakpoint
CREATE TYPE "public"."status" AS ENUM('active', 'inactive', 'trial');--> statement-breakpoint
CREATE TABLE "clients" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"company_name" text NOT NULL,
	"client_code" text NOT NULL,
	"contact_person_name" text NOT NULL,
	"contact_email" text NOT NULL,
	"phone" text,
	"address" text,
	"city" text,
	"country" text,
	"plan" "plan" NOT NULL,
	"status" "status" DEFAULT 'trial' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "clients_client_code_unique" UNIQUE("client_code")
);
--> statement-breakpoint
CREATE INDEX "client_code_idx" ON "clients" USING btree ("client_code");--> statement-breakpoint
CREATE INDEX "status_idx" ON "clients" USING btree ("status");--> statement-breakpoint
CREATE INDEX "plan_idx" ON "clients" USING btree ("plan");--> statement-breakpoint
CREATE INDEX "contact_email_idx" ON "clients" USING btree ("contact_email");