import { z } from 'zod';

const createContactSchema = z.object({
    email: z.string().email().optional(),
    phoneNumber: z.string().optional(),
});



export type createContactSchemaType = z.infer<typeof createContactSchema>;