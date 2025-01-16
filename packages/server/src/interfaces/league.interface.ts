import { LeagueEntity } from "../database/entities/league.entity";

export interface ILeagueCreatePayload
  extends Omit<
    LeagueEntity,
    "id" | "eventsUsersLeagues" | "eventsLeaguesResults"
  > {}

export interface ILeagueUpdatePayload
  extends Partial<
    Omit<LeagueEntity, "eventsUsersLeagues" | "eventsLeaguesResults">
  > {}

export interface ILeagueDeletePayload {
  leagueId: number;
}
