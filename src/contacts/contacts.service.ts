import { db } from "../db/db";

import { contactTable } from "../db/schema";
import { createContactSchemaType } from "./contacts.schema";
import { eq, and, or } from "drizzle-orm";
import { alias } from "drizzle-orm/pg-core";

export type linkedContactType = "primary" | "secondary";

export const createContactSerive = async (
	data: createContactSchemaType,
	linkedId?: number,
	type: linkedContactType = "secondary"
) => {
	console.log("Data received in service:", data);
	if (!data.email && !data.phoneNumber) {
		throw new Error("At least one of email or phone number must be provided");
	}

	try {
		if (data.email) {
			const response = await db
				.insert(contactTable)
				.values({
					email: data.email,
					linkedId: linkedId || undefined,
					linkPrecedence: type,
				})
				.returning();
			console.log("Response from DB:", response);
			return response;
		} else if (data.phoneNumber) {
			const response = await db
				.insert(contactTable)
				.values({
					phoneNumber: data.phoneNumber,
					linkedId: linkedId || undefined,
					linkPrecedence: type,
				})
				.returning();
			return response;
		}
		if (data.email && data.phoneNumber) {
			const response = await db
				.insert(contactTable)
				.values({
					email: data.email,
					phoneNumber: data.phoneNumber,
					linkedId: linkedId || undefined,
					linkPrecedence: type,
				})
				.returning();
			return response;
		}
		return [];
	} catch (error) {
		console.error("Error creating contact:", error);
		throw new Error("Failed to create contact");
	}
};

export const getContactsByEamilOrPhoneNumberService = async ({
	email,
	phoneNumber,
}: {
	email?: string;
	phoneNumber?: string;
}) => {
	try {
		if (email) {
			const response = await db
				.select()
				.from(contactTable)
				.where(eq(contactTable.email, email));
			console.log("Response from DB:", response);
			return response;
		} else if (phoneNumber) {
			const response = await db
				.select()
				.from(contactTable)
				.where(eq(contactTable.phoneNumber, phoneNumber));
			return response;
		}
		return [];
	} catch (error) {
		console.error("Error fetching contacts:", error);
		throw new Error("Failed to fetch contacts");
	}
};

export const getContactByIdService = async (id: number) => {
	try {
		const response = await db
			.select()
			.from(contactTable)
			.where(eq(contactTable.id, id));
		return response;
	} catch (error) {
		console.error("Error fetching contact by ID:", error);
		throw new Error("Failed to fetch contact by ID");
	}
};

export const getContactByLinkedIdService = async (linkedId: number) => {
	try {
		const response = await db
			.select()
			.from(contactTable)
			.where(eq(contactTable.linkedId, linkedId));
		return response;
	} catch (error) {
		console.error("Error fetching contact by linked ID:", error);
		throw new Error("Failed to fetch contact by linked ID");
	}
};

export const getPrimaryContactsService = async ({
	email,
	phoneNumber,
}: {
	email?: string;
	phoneNumber?: string;
}) => {
	if (!email && !phoneNumber) {
		throw new Error("At least one of email or phone number must be provided");
	}
	try {
		if (email && phoneNumber) {
			const response = await db
				.select()
				.from(contactTable)
				.where(
					and(
						or(
							eq(contactTable.email, email),
							eq(contactTable.phoneNumber, phoneNumber)
						),
						eq(contactTable.linkPrecedence, "primary")
					)
				);
			return response;
		} else if (email) {
			const response = await db
				.select()
				.from(contactTable)
				.where(
					and(
						eq(contactTable.email, email),
						eq(contactTable.linkPrecedence, "primary")
					)
				);
			return response;
		} else if (phoneNumber) {
			const response = await db
				.select()
				.from(contactTable)
				.where(
					and(
						eq(contactTable.phoneNumber, phoneNumber),
						eq(contactTable.linkPrecedence, "primary")
					)
				);
			return response;
		}
	} catch (error) {
		console.error("Error fetching primary contacts:", error);
		throw new Error("Failed to fetch primary contacts");
	}
};

export const getSecondaryContactsService = async ({
	email,
	phoneNumber,
}: {
	email?: string;
	phoneNumber?: string;
}) => {
	if (!email && !phoneNumber) {
		throw new Error("At least one of email or phone number must be provided");
	}
	try {
		if (email && phoneNumber) {
			const response = await db
				.select()
				.from(contactTable)
				.where(
					and(
						or(
							eq(contactTable.email, email),
							eq(contactTable.phoneNumber, phoneNumber)
						),
						eq(contactTable.linkPrecedence, "secondary")
					)
				);
			return response;
		} else if (email) {
			const response = await db
				.select()
				.from(contactTable)
				.where(
					and(
						eq(contactTable.email, email),
						eq(contactTable.linkPrecedence, "secondary")
					)
				);
			return response;
		} else if (phoneNumber) {
			const response = await db
				.select()
				.from(contactTable)
				.where(
					and(
						eq(contactTable.phoneNumber, phoneNumber),
						eq(contactTable.linkPrecedence, "secondary")
					)
				);
			return response;
		}
	} catch (error) {
		console.error("Error fetching secondary contacts:", error);
		throw new Error("Failed to fetch secondary contacts");
	}
};

export const updateContactByIdService = async (
	id: number,
	linkedId?: number,
	type: linkedContactType = "secondary"
) => {
	try {
		const response = await db
			.update(contactTable)
			.set({
				linkPrecedence: type,
				updatedAt: new Date(),
				linkedId: linkedId || undefined,
			})
			.where(eq(contactTable.id, id))
			.returning();
		return response;
	} catch (error) {
		console.error("Error updating contact by ID:", error);
		throw new Error("Failed to update contact by ID");
	}
};
