import { Event as EventEntity } from "../database/entities/event.entity";

export interface IEventCreatePayload
  extends Partial<
    Omit<EventEntity, "createdAt" | "updatedAt" | "location" | "users">
  > {
  locationId?: number;
}

export interface IEventUpdatePayload
  extends Partial<
    Omit<EventEntity, "id" | "createdAt" | "updatedAt" | "location" | "users">
  > {
  id: number;
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
