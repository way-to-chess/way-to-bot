import { ParticipateRequestEntity } from "../database/entities/participate-request.entity";

export interface IParticipateRequestCreatePayload
  extends Partial<
    Omit<
      ParticipateRequestEntity,
      "id" | "approved" | "createdAt" | "updatedAt" | "event" | "user"
    >
  > {
  fileId?: number;
  eventId: number;
  userId: number;
}

export interface IParticipateRequestUpdatePayload
  extends Partial<
    Omit<
      ParticipateRequestEntity,
      "createdAt" | "updatedAt" | "event" | "user" | "id"
    >
  > {
  id: number;
  fileId?: number | null;
  eventId: number;
  userId: number;
}

export interface IParticipantRequestDeletePayload {
  id: number;
}
