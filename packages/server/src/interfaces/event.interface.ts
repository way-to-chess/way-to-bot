import { EventEntity } from "../database/entities/event.entity";

export interface IEventCreatePayload
  extends Omit<
    EventEntity,
    | "createdAt"
    | "updatedAt"
    | "location"
    | "users"
    | "eventsUsersLeagues"
    | "participateRequests"
    | "preview"
    | "leaguesResults"
  > {
  locationId?: number;
  fileId?: number | null;
}

export interface IEventUpdatePayload
  extends Partial<
    Omit<
      EventEntity,
      | "createdAt"
      | "updatedAt"
      | "location"
      | "users"
      | "eventsUsersLeagues"
      | "participateRequests"
      | "preview"
      | "leaguesResults"
    >
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
  leagueId: number;
  userIds: number[];
}

export interface IRemoveUsersFromEventPayload {
  eventId: number;
  leagueId: number;
  userIds: number[];
}

export interface IEventsLeaguesUpdate {
  eventId: number;
  leagueId: number;
  link: string;
}
