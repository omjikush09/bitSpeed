import { relations } from "drizzle-orm";

import {
	pgTable,
	text,
	serial,
	date,
	timestamp,
	pgEnum,
    integer
} from "drizzle-orm/pg-core";

export const linkPrecedenceEnum = pgEnum("link_precedence_enum", [
	"primary",
	"secondary",
]);

export const contactTable = pgTable("contacts_table", {
	id: serial("id").primaryKey(),
	
	email: text("email").unique(),
	phoneNumber: text("phone_number").unique(),
	linkedId: integer(),
	linkPrecedence: linkPrecedenceEnum().default("primary").notNull(),
	createdAt: timestamp().defaultNow().notNull(),
	updatedAt: timestamp().defaultNow().notNull(),
	delatedAt: timestamp(),
});

export const createContactType=typeof contactTable.$inferInsert;


export const userRelatioin = relations(contactTable, ({ many, one }) => ({
	contacts: many(contactTable,{relationName:"contacts"}), // self-referential many relation
	linkedContact: one(contactTable, {
		fields: [contactTable.linkedId],
		references: [contactTable.id],
        relationName: "linkedContact", // self-referential one relation
	}),
}));

// export const contactRelations = relations(contactTable, ({ one }) => ({
   
// }));
