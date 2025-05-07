import { IEventEntity } from "@way-to-bot/shared/api/interfaces/entities/event-entity.interface.js";
import { IFileEntity } from "@way-to-bot/shared/api/interfaces/entities/file-entity.interface.js";
import { IUserEntity } from "@way-to-bot/shared/api/interfaces/entities/user-entity.interface.js";

export interface IParticipateRequestEntity {
  id: number;
  eventId: number;
  event: IEventEntity;
  userId: number;
  user: IUserEntity;
  fileId?: number | null;
  receipt?: IFileEntity | null;
  approved: boolean;
  createdAt: Date;
  updatedAt: Date;
}
