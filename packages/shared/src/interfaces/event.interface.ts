import { EEventStatus } from "../enums/index";
import { TDate } from "./date.inteface";
import { ILocation } from "./location.interface";
import { IUser } from "./user.interface";

export interface IEvent {
  id: number;
  dateTime: TDate;
  price?: string | null;
  status: EEventStatus;
  participantsLimit?: number | null;
  linkToTable?: string | null;
  location?: ILocation | null;
  users?: IUser[];
  createdAt: TDate;
  updatedAt: TDate;
}

export interface IEventCreatePayload {
  dateTime: TDate;
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
