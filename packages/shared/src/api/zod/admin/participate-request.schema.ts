import { z } from "zod";

import { EParticipateRequestStatus } from "../../enums/EParticipateRequestStatus.js";

export const AdminSchemaParticipateRequestUpdate = z
  .object({
    status: z.enum(EParticipateRequestStatus),
    message: z.string().optional().nullable(),
  })
  .strict();

export type TAdminParticipateRequestUpdatePayload = z.infer<
  typeof AdminSchemaParticipateRequestUpdate
>;
