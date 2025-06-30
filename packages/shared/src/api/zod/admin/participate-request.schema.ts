import { z } from "zod";

import { EParticipateRequestStatus } from "../../enums/EParticipateRequestStatus";

export const AdminSchemaParticipateRequestUpdate = z
  .object({
    status: z.nativeEnum(EParticipateRequestStatus),
    message: z.string().optional().nullable(),
  })
  .strict();

export type TAdminParticipateRequestUpdatePayload = z.infer<
  typeof AdminSchemaParticipateRequestUpdate
>;
