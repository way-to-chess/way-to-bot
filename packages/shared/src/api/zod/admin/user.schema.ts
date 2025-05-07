import { z } from "zod";
import { EUserRole } from "../../enums/index.js";

const AdminSchemaUserBase = {
  username: z.string().nullable().optional(),
  firstName: z.string(),
  lastName: z.string(),
  roles: z.array(z.nativeEnum(EUserRole)).optional(),
  fileId: z.number().nullable().optional(),
  wins: z.number().optional(),
  losses: z.number().optional(),
  draws: z.number().optional(),
  rating: z.number().optional(),
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
