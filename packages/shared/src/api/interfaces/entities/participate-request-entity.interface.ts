import { IEventEntity } from "@way-to-bot/shared/api/interfaces/entities/event-entity.interface.js";
import { IFileEntity } from "@way-to-bot/shared/api/interfaces/entities/file-entity.interface.js";
import { IUserEntity } from "@way-to-bot/shared/api/interfaces/entities/user-entity.interface.js";
import { TCommonParticipateRequestAdditionalUser } from "@way-to-bot/shared/api/types/index.js";
import { EParticipateRequestPaymentType } from "../../enums/EParticipateRequestPaymentType";
import { EParticipateRequestStatus } from "../../enums/EParticipateRequestStatus";

export interface IParticipateRequestEntity {
  id: number;
  eventId: number;
  event: IEventEntity;
  userId: number;
  user: IUserEntity;
  additionalUsers: TCommonParticipateRequestAdditionalUser[];
  fileId?: number | null;
  receipt?: IFileEntity | null;
  status: EParticipateRequestStatus;
  paymentType: EParticipateRequestPaymentType;
  message?: string | null;
  createdAt: Date;
  updatedAt: Date;
}
