import { IEventEntity } from "@way-to-bot/shared/api/interfaces/entities/event-entity.interface.js";
import { ILeagueEntity } from "@way-to-bot/shared/api/interfaces/entities/league-entity.interface.js";
import { IEventLeagueUserEntity } from "@way-to-bot/shared/api/interfaces/entities/event-league-user-entity.interface.js";

export interface IEventLeagueEntity {
  id: number;
  eventId: number;
  event: IEventEntity;
  leagueId: number;
  league: ILeagueEntity;
  participants?: IEventLeagueUserEntity[];
  link?: string | null;
}
