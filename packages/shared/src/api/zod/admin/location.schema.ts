import { z } from "zod";

export const AdminSchemaLocationBase = {
  title: z.string(),
  url: z.string().nullable().optional(),
  address: z.string().nullable().optional(),
  fileId: z.number().nullable().optional(),
};

export const AdminSchemaLocationCreate = z
  .object({
    ...AdminSchemaLocationBase,
  })
  .strict();

export const AdminSchemaLocationUpdate = z
  .object({
    ...Object.fromEntries(
      Object.entries(AdminSchemaLocationBase).map(([key, value]) => [
        key,
        value.optional(),
      ]),
    ),
  })
  .strict();

export type TAdminLocationCreatePayload = z.infer<
  typeof AdminSchemaLocationCreate
>;
export type TAdminLocationUpdatePayload = z.infer<
  typeof AdminSchemaLocationUpdate
>;
