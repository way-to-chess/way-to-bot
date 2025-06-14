import { z } from "zod";
import { EParticipateRequestStatus } from "@way-to-bot/shared/api/enums/index.js";

export const AdminSchemaParticipateRequestUpdate = z
  .object({
    status: z.nativeEnum(EParticipateRequestStatus),
    message: z.string().optional(),
  })
  .strict();

export type TAdminParticipateRequestUpdatePayload = z.infer<
  typeof AdminSchemaParticipateRequestUpdate
>;
