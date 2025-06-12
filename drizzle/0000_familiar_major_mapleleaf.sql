CREATE TYPE "public"."link_precedence_enum" AS ENUM('primary', 'secondary');--> statement-breakpoint
CREATE TABLE "contacts_table" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text,
	"email" text,
	"phone_number" text NOT NULL,
	"linked_id" text NOT NULL,
	"linkPrecedence" "link_precedence_enum",
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	"delatedAt" timestamp,
	CONSTRAINT "contacts_table_name_unique" UNIQUE("name"),
	CONSTRAINT "contacts_table_email_unique" UNIQUE("email")
);
