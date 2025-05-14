import { IFileEntity } from "@way-to-bot/shared/api/interfaces/entities/file-entity.interface.js";
import { IEventLeagueEntity } from "@way-to-bot/shared/api/interfaces/entities/event-league-entity.interface.js";

export interface IEventLeagueResult {
  id: number;
  eventLeagueId: number;
  eventLeague: IEventLeagueEntity;
  roundsFileId?: number;
  roundsFile?: IFileEntity;
  ratingFileId?: number;
  ratingFile?: IFileEntity;
}
