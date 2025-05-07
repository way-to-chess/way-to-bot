import { IEventLeagueEntity } from "@way-to-bot/shared/api/interfaces/entities/event-league-entity.interface.js";

export interface ILeagueEntity {
  id: number;
  name: string;
  eventLeagues?: IEventLeagueEntity[];
}
