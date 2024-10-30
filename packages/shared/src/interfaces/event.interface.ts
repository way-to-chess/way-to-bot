import { EEventStatus } from "../enums/index";
import { ILocation } from "./location.interface";
import { IUser } from "./user.interface";

export interface IEvent {
  id: number;
  dateTime: Date;
  price?: string | null;
  status: EEventStatus;
  participantsLimit?: number | null;
  linkToTable?: string | null;
  location?: ILocation | null;
  users?: IUser[];
  createdAt: Date;
  updatedAt: Date;
}

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
    Omit<IEvent, "createdAt" | "updatedAt" | "location" | "users">
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
