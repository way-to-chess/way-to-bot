import { z } from "zod";
import { ClientSchemaUserContactInfo } from "@way-to-bot/shared/api/zod/client/user.schema.js";

import { EUserRole } from "../../enums/EUserRole";

const AdminSchemaUserBase = {
  username: z.string().nullable().optional(),
  firstName: z.string(),
  lastName: z.string(),
  email: z.string().nullable().optional(),
  birthDate: z.date().optional(),
  roles: z.array(z.nativeEnum(EUserRole)).optional(),
  fileId: z.number().nullable().optional(),
  wins: z.number().optional(),
  losses: z.number().optional(),
  draws: z.number().optional(),
  rating: z.number().optional(),
  contactInfo: z.array(ClientSchemaUserContactInfo).optional(),
};

export const AdminSchemaUserCreate = z
  .object({
    ...AdminSchemaUserBase,
  })
  .strict();

export const AdminSchemaUserUpdate = z
  .object({
    ...Object.fromEntries(
      Object.entries(AdminSchemaUserBase).map(([key, value]) => [
        key,
        value.optional(),
      ]),
    ),
  })
  .strict();

export type TAdminUserCreatePayload = z.infer<typeof AdminSchemaUserCreate>;
export type TAdminUserUpdatePayload = z.infer<typeof AdminSchemaUserUpdate>;
