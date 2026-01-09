CREATE TABLE "knowledge_base_documents" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"doc_id" text NOT NULL,
	"client_id" text NOT NULL,
	"crew_id" uuid NOT NULL,
	"filename" text NOT NULL,
	"file_type" text NOT NULL,
	"file_size" integer,
	"chunk_count" integer DEFAULT 0 NOT NULL,
	"status" text DEFAULT 'indexed' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "knowledge_base_documents_doc_id_unique" UNIQUE("doc_id")
);
--> statement-breakpoint
ALTER TABLE "knowledge_base_documents" ADD CONSTRAINT "knowledge_base_documents_client_id_clients_client_code_fk" FOREIGN KEY ("client_id") REFERENCES "public"."clients"("client_code") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "knowledge_base_documents" ADD CONSTRAINT "knowledge_base_documents_crew_id_crews_id_fk" FOREIGN KEY ("crew_id") REFERENCES "public"."crews"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "kb_doc_id_idx" ON "knowledge_base_documents" USING btree ("doc_id");--> statement-breakpoint
CREATE INDEX "kb_client_id_idx" ON "knowledge_base_documents" USING btree ("client_id");--> statement-breakpoint
CREATE INDEX "kb_crew_id_idx" ON "knowledge_base_documents" USING btree ("crew_id");--> statement-breakpoint
CREATE INDEX "kb_created_at_idx" ON "knowledge_base_documents" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "kb_filename_idx" ON "knowledge_base_documents" USING btree ("filename");