import { z } from "zod";

export const AdminSchemaLeagueCreate = z
  .object({
    name: z.string().optional(),
  })
  .strict();

export const AdminSchemaLeagueUpdate = z
  .object({
    name: z.string().optional(),
  })
  .strict();

export type TAdminLeagueCreatePayload = z.infer<typeof AdminSchemaLeagueCreate>;
export type TAdminLeagueUpdatePayload = z.infer<typeof AdminSchemaLeagueUpdate>;
