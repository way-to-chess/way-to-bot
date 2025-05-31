import { z } from "zod";
import { EContactType } from "@way-to-bot/shared/api/enums/index";

export const ClientSchemaUserContactInfo = z.object({
  type: z.nativeEnum(EContactType),
  url: z.string(),
});

export const ClientSchemaUserBase = {
  username: z.string().nullable().optional(),
  firstName: z.string(),
  lastName: z.string(),
  fileId: z.number().optional(),
  email: z.string().nullable().optional(),
  birthDate: z.date().optional(),
  contactInfo: z.array(ClientSchemaUserContactInfo).optional(),
};

export const ClientSchemaUserCreate = z
  .object({
    ...ClientSchemaUserBase,
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
