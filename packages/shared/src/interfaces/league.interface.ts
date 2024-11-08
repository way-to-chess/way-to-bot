import { IEventUserLeague } from "./eventUserLeague.interface";

interface ILeague {
  id: number;
  name: string;
  eventsUsersLeagues: IEventUserLeague[];
}

interface ILeagueCreatePayload extends Partial<Omit<ILeague, "id">> {}

interface ILeagueUpdatePayload extends Partial<ILeague> {}

interface ILeagueDeletePayload {
  leagueId: number;
}

export type {
  ILeague,
  ILeagueCreatePayload,
  ILeagueUpdatePayload,
  ILeagueDeletePayload,
};
