CREATE TYPE "public"."sentiment" AS ENUM('positive', 'neutral', 'negative');--> statement-breakpoint
CREATE TABLE "conversations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"session_id" text NOT NULL,
	"client_id" text NOT NULL,
	"crew_id" uuid NOT NULL,
	"customer_name" text,
	"customer_email" text,
	"sentiment" "sentiment",
	"resolved" boolean DEFAULT false,
	"duration" integer,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "conversations_session_id_unique" UNIQUE("session_id")
);
--> statement-breakpoint
ALTER TABLE "conversations" ADD CONSTRAINT "conversations_client_id_clients_client_code_fk" FOREIGN KEY ("client_id") REFERENCES "public"."clients"("client_code") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "conversations" ADD CONSTRAINT "conversations_crew_id_crews_id_fk" FOREIGN KEY ("crew_id") REFERENCES "public"."crews"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "conversation_session_id_idx" ON "conversations" USING btree ("session_id");--> statement-breakpoint
CREATE INDEX "conversation_client_id_idx" ON "conversations" USING btree ("client_id");--> statement-breakpoint
CREATE INDEX "conversation_crew_id_idx" ON "conversations" USING btree ("crew_id");--> statement-breakpoint
CREATE INDEX "conversation_created_at_idx" ON "conversations" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "conversation_sentiment_idx" ON "conversations" USING btree ("sentiment");