import { ParticipateRequestEntity } from "../database/entities/participate-request.entity";

export interface IParticipateRequestCreatePayload
  extends Omit<
    ParticipateRequestEntity,
    "id" | "approved" | "createdAt" | "updatedAt" | "event" | "user" | "receipt"
  > {
  fileId?: number;
  eventId: number;
  userId: number;
}

export interface IParticipateRequestUpdatePayload
  extends Partial<
    Omit<
      ParticipateRequestEntity,
      "createdAt" | "updatedAt" | "event" | "user" | "id" | "receipt"
    >
  > {
  id: number;
  fileId?: number | null;
  eventId: number;
  userId: number;
}

export interface IParticipateRequestApprovePayload {
  id: number;
  leagueId: number;
}

export interface IParticipantRequestDeletePayload {
  id: number;
}
