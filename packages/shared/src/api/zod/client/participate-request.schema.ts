import { z } from "zod";
import { ClientSchemaUserBase } from "@way-to-bot/shared/api/zod/client/user.schema.js";

const ClientSchemaParticipateRequestAdditionalUserSchema = z
  .object({
    ...ClientSchemaUserBase,
    birthDate: z.coerce.date(),
    email: z.string().optional(),
  })
  .catchall(z.any());

const ClientSchemaParticipateRequestBase = {
  eventId: z.number(),
  fileId: z.number(),
  additionalUsers: z.array(ClientSchemaParticipateRequestAdditionalUserSchema),
};

export const ClientSchemaParticipateRequestCreate = z
  .object({
    ...ClientSchemaParticipateRequestBase,
  })
  .strict();

export const ClientSchemaParticipateRequestUpdate = z
  .object({
    ...Object.fromEntries(
      Object.entries(ClientSchemaParticipateRequestBase).map(([key, value]) => [
        key,
        value.optional(),
      ]),
    ),
  })
  .strict();

export type TClientParticipateRequestCreatePayload = z.infer<
  typeof ClientSchemaParticipateRequestCreate
>;
export type TClientParticipateRequestUpdatePayload = z.infer<
  typeof ClientSchemaParticipateRequestUpdate
>;
export type TClientParticipateRequestAdditionalUser = z.infer<
  typeof ClientSchemaParticipateRequestAdditionalUserSchema
>;
