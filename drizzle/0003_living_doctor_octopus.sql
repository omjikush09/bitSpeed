ALTER TABLE "contacts_table" ALTER COLUMN "phone_number" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "contacts_table" ALTER COLUMN "linkPrecedence" SET DEFAULT 'primary';--> statement-breakpoint
ALTER TABLE "contacts_table" ALTER COLUMN "linkPrecedence" SET NOT NULL;