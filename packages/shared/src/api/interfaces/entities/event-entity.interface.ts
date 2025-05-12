import { EEventStatus } from "@way-to-bot/shared/api/enums/index.js";
import { ILocationEntity } from "@way-to-bot/shared/api/interfaces/entities/location-entity.interface.js";
import { IFileEntity } from "@way-to-bot/shared/api/interfaces/entities/file-entity.interface.js";
import { IEventLeagueEntity } from "@way-to-bot/shared/api/interfaces/entities/event-league-entity.interface.js";
import { IParticipateRequestEntity } from "@way-to-bot/shared/api/interfaces/entities/participate-request-entity.interface.js";
import { IUserEntity } from "@way-to-bot/shared/api/interfaces/entities/user-entity.interface.js";

export interface IEventEntity {
  id: number;
  name: string;
  dateTime: Date;
  duration?: number | null;
  price?: string | null;
  description?: string | null;
  status: EEventStatus;
  participantsLimit?: number | null;
  linkToStream?: string | null;
  locationId?: number | null;
  location?: ILocationEntity | null;
  fileId?: number | null;
  preview?: IFileEntity | null;
  hostId: number;
  host: IUserEntity;
  eventLeagues?: IEventLeagueEntity[];
  participateRequests?: IParticipateRequestEntity[];
  createdAt: Date;
  updatedAt: Date;
}
