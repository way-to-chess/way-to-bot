import { IEventLeagueEntity } from "@way-to-bot/shared/api/interfaces/entities/event-league-entity.interface.js";
import { IUserEntity } from "@way-to-bot/shared/api/interfaces/entities/user-entity.interface.js";

export interface IEventLeagueUserEntity {
  id: number;
  userId: number;
  user: IUserEntity;
  eventLeagueId: number;
  eventLeague: IEventLeagueEntity;
  place?: number | null;
  points?: number | null;
}
