ALTER TABLE "contacts_table" DROP CONSTRAINT "contacts_table_name_unique";--> statement-breakpoint
ALTER TABLE "contacts_table" DROP CONSTRAINT "contacts_table_email_unique";--> statement-breakpoint
ALTER TABLE "contacts_table" ADD COLUMN "linkedId" integer;--> statement-breakpoint
ALTER TABLE "contacts_table" DROP COLUMN "linked_id";