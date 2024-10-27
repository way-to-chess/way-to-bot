import { Event as EventEntity } from "@way-to-bot/server/src/database/entities/event.entity";
import { EEventStatus } from "../enums/index";

export interface IEventCreatePayload {
  dateTime: Date;
  price?: string | null;
  status: EEventStatus;
  participantsLimit?: number;
  linkToTable?: string;
  locationId?: number;
}

export interface IEventUpdatePayload
  extends Partial<
    Omit<EventEntity, "createdAt" | "updatedAt" | "location" | "users">
  > {
  locationId?: number | null;
}

export interface IEventDeletePayload {
  eventId: number;
}

export interface IAddUsersToEventPayload {
  eventId: number;
  userIds: number[];
}

export interface IRemoveUsersFromEventPayload {
  eventId: number;
  userIds: number[];
}
