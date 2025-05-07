import { z } from "zod";

export const AdminSchemaEventLeagueCreate = z
  .object({
    eventId: z.number(),
    leagueId: z.number().optional(),
    link: z.string().nullable().optional(),
  })
  .strict();

export const AdminSchemaEventLeagueUpdate = z
  .object({
    link: z.string().nullable().optional(),
  })
  .strict();

export const AdminSchemaEventLeagueUsersUpdate = z
  .object({
    userIds: z.array(z.number()),
  })
  .strict();

export type TAdminEventLeagueCreatePayload = z.infer<
  typeof AdminSchemaEventLeagueCreate
>;
export type TAdminEventLeagueUpdatePayload = z.infer<
  typeof AdminSchemaEventLeagueUpdate
>;
export type TAdminEventLeagueUserUpdatePayload = z.infer<
  typeof AdminSchemaEventLeagueUsersUpdate
>;
