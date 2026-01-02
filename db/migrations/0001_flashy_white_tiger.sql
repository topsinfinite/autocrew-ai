CREATE TYPE "public"."crew_status" AS ENUM('active', 'inactive', 'error');--> statement-breakpoint
CREATE TYPE "public"."crew_type" AS ENUM('customer_support', 'lead_generation');--> statement-breakpoint
CREATE TABLE "crews" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"client_id" text NOT NULL,
	"crew_code" text NOT NULL,
	"type" "crew_type" NOT NULL,
	"config" jsonb DEFAULT '{}' NOT NULL,
	"webhook_url" text NOT NULL,
	"status" "crew_status" DEFAULT 'active' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "crews_crew_code_unique" UNIQUE("crew_code")
);
--> statement-breakpoint
ALTER TABLE "crews" ADD CONSTRAINT "crews_client_id_clients_client_code_fk" FOREIGN KEY ("client_id") REFERENCES "public"."clients"("client_code") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "crew_client_id_idx" ON "crews" USING btree ("client_id");--> statement-breakpoint
CREATE INDEX "crew_code_idx" ON "crews" USING btree ("crew_code");--> statement-breakpoint
CREATE INDEX "crew_type_idx" ON "crews" USING btree ("type");--> statement-breakpoint
CREATE INDEX "crew_status_idx" ON "crews" USING btree ("status");--> statement-breakpoint
CREATE INDEX "crew_name_idx" ON "crews" USING btree ("name");