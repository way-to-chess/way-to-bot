import { z } from "zod";

const ClientSchemaParticipateRequestBase = {
  eventId: z.number(),
  userId: z.number(),
  fileId: z.number(),
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
