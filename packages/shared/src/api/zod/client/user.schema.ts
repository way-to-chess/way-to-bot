import {z} from "zod";

import {EContactType} from "../../enums/EContactType.js";

export const ClientSchemaUserContactInfo = z.object({
    type: z.nativeEnum(EContactType),
    url: z.string(),
});

export const ClientSchemaUserBase = {
    username: z.string().nullable().optional(),
    firstName: z.string().min(2).max(30).regex(/^[\p{L}\s\-']+$/u),
    lastName: z.string().min(2).max(30).regex(/^[\p{L}\s\-']+$/u),
    fileId: z.number().optional().nullable(),
    email: z.string().nullable().optional(),
    birthDate: z.date().optional(),
    contactInfo: z.array(ClientSchemaUserContactInfo).optional(),
};

export const ClientSchemaUserCreate = z
    .object({
        ...ClientSchemaUserBase,
        tgId: z.string().optional(),
        username: z.string().optional(),
    })
    .strict();

export const ClientSchemaUserUpdate = z
    .object({
        ...Object.fromEntries(
            Object.entries(ClientSchemaUserBase).map(([key, value]) => [
                key,
                value.optional(),
            ]),
        ),
    })
    .strict();

export type TClientUserCreatePayload = z.infer<typeof ClientSchemaUserCreate>;
export type TClientUserUpdatePayload = z.infer<typeof ClientSchemaUserUpdate>;
