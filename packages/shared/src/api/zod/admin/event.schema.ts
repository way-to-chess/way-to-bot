import { z } from "zod";

import { EEventStatus } from "../../enums/EEventStatus.js";

const eventStatusSchema = z.nativeEnum(EEventStatus);

const AdminSchemaEventBase = {
  name: z.string(),
  dateTime: z.coerce.date(),
  price: z.string().nullable().optional(),
  status: eventStatusSchema.optional(),
  participantsLimit: z.number().nullable().optional(),
  linkToStream: z.string().nullable().optional(),
  locationId: z.number().nullable().optional(),
  fileId: z.number().nullable().optional(),
  description: z.string().nullable().optional(),
  duration: z.number().nullable().optional(),
  hostId: z.number(),
  additionalInfo: z.record(z.string(), z.unknown()).nullable().optional(),
};

export const AdminSchemaEventCreate = z
  .object({
    ...AdminSchemaEventBase,
  })
  .strict();

export const AdminSchemaEventUpdate = z
  .object({
    ...Object.fromEntries(
      Object.entries(AdminSchemaEventBase).map(([key, value]) => [
        key,
        value.optional(),
      ]),
    ),
  })
  .strict();

export type TAdminEventCreatePayload = z.infer<typeof AdminSchemaEventCreate>;
export type TAdminEventUpdatePayload = z.infer<typeof AdminSchemaEventUpdate>;
