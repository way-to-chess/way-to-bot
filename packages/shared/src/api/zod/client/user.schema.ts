import { z } from "zod";

const ClientSchemaUserBase = {
  username: z.string().nullable().optional(),
  firstName: z.string(),
  lastName: z.string(),
  fileId: z.number().optional(),
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
