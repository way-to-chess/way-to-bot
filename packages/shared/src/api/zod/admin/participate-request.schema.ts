import { z } from "zod";

export const AdminSchemaParticipateRequestUpdate = z
  .object({
    approved: z.boolean(),
  })
  .strict();

export const AdminSchemaParticipateRequestApprove = z
  .object({
    leagueId: z.number().optional(),
  })
  .strict();

export type TAdminParticipateRequestUpdatePayload = z.infer<
  typeof AdminSchemaParticipateRequestUpdate
>;

export type TAdminParticipateRequestApprovePayload = z.infer<
  typeof AdminSchemaParticipateRequestApprove
>;
