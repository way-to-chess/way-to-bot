import { IParticipateRequestEntity } from "@way-to-bot/shared/api/interfaces/entities/participate-request-entity.interface.js";
import { IUserEntity } from "@way-to-bot/shared/api/interfaces/entities/user-entity.interface.js";
import { IEventEntity } from "@way-to-bot/shared/api/interfaces/entities/event-entity.interface.js";
import { IFileEntity } from "@way-to-bot/shared/api/interfaces/entities/file-entity.interface.js";
import { EParticipateRequestPaymentType } from "../../enums/EParticipateRequestPaymentType.js";
import { EParticipateRequestStatus } from "../../enums/EParticipateRequestStatus.js";
import { TPrAdditionalUser } from "../../zod/common/base/participate-request.schema.js";

export class BaseDTOParticipateRequest {
  readonly id: number;
  readonly eventId: number;
  readonly event: IEventEntity;
  readonly userId: number;
  readonly user: IUserEntity;
  readonly fileId: number | null;
  readonly receipt: IFileEntity | null;
  readonly status: EParticipateRequestStatus;
  readonly createdAt: string;
  readonly message: string | null;
  readonly paymentType: EParticipateRequestPaymentType;
  readonly additionalUsers: TPrAdditionalUser[];

  constructor(request: IParticipateRequestEntity) {
    this.id = request.id;
    this.eventId = request.eventId;
    this.event = request.event;
    this.userId = request.userId;
    this.user = request.user;
    this.fileId = request.fileId ?? null;
    this.receipt = request.receipt ?? null;
    this.status = request.status;
    this.createdAt = request.createdAt.toISOString();
    this.message = request.message ?? null;
    this.paymentType = request.paymentType;
    this.additionalUsers = request.additionalUsers;
  }
}
