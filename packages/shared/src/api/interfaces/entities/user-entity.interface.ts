import { IFileEntity } from "@way-to-bot/shared/api/interfaces/entities/file-entity.interface.js";
import { IParticipateRequestEntity } from "@way-to-bot/shared/api/interfaces/entities/participate-request-entity.interface.js";
import { IEventLeagueUserEntity } from "@way-to-bot/shared/api/interfaces/entities/event-league-user-entity.interface.js";
import { EUserRole } from "../../enums/EUserRole.js";

export interface IUserEntity {
  id: number;
  username?: string | null;
  tgId?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  email?: string | null;
  birthDate?: Date;
  age?: number;
  roles: EUserRole[];
  fileId?: number | null;
  photo?: IFileEntity | null;
  wins: number;
  losses: number;
  draws: number;
  total: number;
  winRate: number;
  rating: number;
  participateRequests?: IParticipateRequestEntity[];
  eventLeagues?: IEventLeagueUserEntity[];
}
