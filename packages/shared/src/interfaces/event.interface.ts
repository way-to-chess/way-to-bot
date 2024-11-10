import { TDate } from "./date.inteface";
import { EEventStatus } from "../enums";
import { EventEntity } from "../entities/event.entity";

export interface IEventCreatePayload {
  name: string;
  dateTime: TDate;
  price?: string | null;
  status: EEventStatus;
  participantsLimit?: number;
  linkToTable?: string;
  locationId?: number;
  fileId?: number | null;
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
  leagueId: number;
}

export interface IRemoveUsersFromEventPayload {
  eventId: number;
  userIds: number[];
  leagueId: number;
}
