import { LeagueEntity } from "../entities/league.entity";

interface ILeagueCreatePayload extends Partial<Omit<LeagueEntity, "id">> {}

interface ILeagueUpdatePayload extends Partial<LeagueEntity> {}

interface ILeagueDeletePayload {
  leagueId: number;
}

export type {
  ILeagueCreatePayload,
  ILeagueUpdatePayload,
  ILeagueDeletePayload,
};
