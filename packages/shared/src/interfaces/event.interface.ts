import { EventEntity } from "../entities/event.entity";

export interface IEventCreatePayload
  extends Partial<
    Omit<EventEntity, "createdAt" | "updatedAt" | "location" | "users">
  > {
  locationId?: number;
  fileId?: number | null;
}

export interface IEventUpdatePayload
  extends Partial<
    Omit<EventEntity, "id" | "createdAt" | "updatedAt" | "location" | "users">
  > {
  id: number;
  locationId?: number | null;
  fileId?: number | null;
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
