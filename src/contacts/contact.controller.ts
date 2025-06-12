import e, { Request, Response } from "express";
import {
	createContactSerive,
	getContactByIdService,
	getContactByLinkedIdService,
	getContactsByEamilOrPhoneNumberService,
	getPrimaryContactsService,
	getSecondaryContactsService,
	updateContactByIdService,
} from "./contacts.service";
import { createContactSchemaType } from "./contacts.schema";

export const getContactsController = async (
	req: Request<unknown, unknown, createContactSchemaType>,
	res: Response
) => {
	const body = req.body;
	if (!body.email && !body.phoneNumber) {
		res.status(400).json({
			error: "At least one of email or phone number must be provided",
		});
		return;
	}

	// Check if it doesn't exist in the database
	try {
		const data = await Promise.all([
			getContactsByEamilOrPhoneNumberService({ email: body.email }),
			getContactsByEamilOrPhoneNumberService({
				phoneNumber: body.phoneNumber,
			}),
		]);

		if (data && data?.[0]?.length === 0 && data?.[1]?.length === 0) {
			const createResponse = await createContactSerive(
				{
					email: body.email,
					phoneNumber: body.phoneNumber,
				},
				undefined,
				"primary"
			);
		} else if (data && data?.[0]?.length === 0) {
			const createResponse = await createContactSerive(
				{
					email: body.email,
				},
				data?.[1]?.[0]?.id,
				"secondary"
			);
		} else if (data && data?.[1]?.length === 0) {
			const createResponse = await createContactSerive(
				{
					phoneNumber: body.phoneNumber,
				},
				data?.[0]?.[0]?.id,
				"secondary"
			);
		}
	} catch (error) {
		console.error("Error checking contacts:", error);
		res.status(500).json({ error: "Failed to check contacts" });
		return;
	}

	try {
		const primaryContacts = await getPrimaryContactsService({
			email: body?.email,
			phoneNumber: body?.phoneNumber,
		});
		console.log("Primary Contacts:", primaryContacts);
		if (!primaryContacts || primaryContacts.length === 0) {
			const secondaryContacts = await getSecondaryContactsService({
				email: body?.email,
				phoneNumber: body?.phoneNumber,
			});

			if (!secondaryContacts || secondaryContacts.length === 0) {
				// If no primary or secondary contacts found, create a new contact
				console.log(
					"No primary or secondary contacts found, creating a new contact"
				);
				const createResponse = await createContactSerive(
					body,
					undefined,
					"primary"
				);
				if (!createResponse || createResponse.length === 0) {
					res.status(500).json({ error: "Failed to create contact" });
					return;
				}

				res.status(200).json({
					contact: {
						primaryContatctId: createResponse[0].id,
						email: [createResponse[0].email],
						phoneNumber: [createResponse[0].phoneNumber],
						secondaryContactIds: [],
					},
				});
				return;
			}
			if (secondaryContacts.length >= 1 && secondaryContacts[0].linkedId) {
				const primaryContactByLinkedId = await getContactByIdService(
					secondaryContacts[0].linkedId
				);
				const allSecondaryContacts = await getContactByLinkedIdService(
					primaryContactByLinkedId[0].id
				);
				res.status(200).json({
					contact: {
						primaryContatctId: primaryContactByLinkedId[0].id,
						email: [
							primaryContactByLinkedId[0].email,
							...secondaryContacts.map((contact) => contact.email),
						].filter((email) => email != null),
						phoneNumber: [
							primaryContactByLinkedId[0].phoneNumber,
							...secondaryContacts.map((contact) => contact.phoneNumber),
						].filter((phoneNumber) => phoneNumber != null),
						secondaryContactIds: allSecondaryContacts
							.map((contact) => contact.id)
							.filter((id) => id != null),
					},
				});
			}
		} else {
			if (primaryContacts.length > 1) {
				const updatededPrimaryContact = await updateContactByIdService(
					primaryContacts[1].id,
					primaryContacts[0].id
				);
			}
			const allSecondaryContacts = await getContactByLinkedIdService(
				primaryContacts[0].id
			);
			res.status(200).json({
				contact: {
					primaryContatctId: primaryContacts[0].id,
					email: [
						primaryContacts[0].email,
						...allSecondaryContacts.map((contact) => contact.email),
					].filter((email) => email != null),
					phoneNumber: [
						primaryContacts[0].phoneNumber,
						...allSecondaryContacts.map((contact) => contact.phoneNumber),
					].filter((phoneNumber) => phoneNumber != null),
					secondaryContactIds: allSecondaryContacts
						.map((contact) => contact.id)
						.filter((id) => id != null),
				},
			});
			return;
		}

		// if (!contacts || contacts.length === 0) {
		// 	const createResponse = await createContactSerive({});
		// }
		res.status(501).json({ error: "Internal Server error" });
	} catch (error) {
		console.error("Error fetching contacts:", error);
		res.status(500).json({ error: "Failed to fetch contacts" });
	}
};
