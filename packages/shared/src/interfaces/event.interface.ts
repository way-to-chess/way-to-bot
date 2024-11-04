import { EEventStatus } from "../enums/index";
import { TDate } from "./date.inteface";
import { ILocation } from "./location.interface";
import { IEventUserLeague } from "./eventUserLeague.interface";
import { IFile } from "./file.interface";

export interface IEvent {
  id: number;
  name?: string | null;
  dateTime: TDate;
  price?: string | null;
  status: EEventStatus;
  participantsLimit?: number | null;
  linkToTable?: string | null;
  location?: ILocation | null;
  createdAt: TDate;
  updatedAt: TDate;
  eventsUsersLeagues: IEventUserLeague[];
  preview: IFile | null;
}

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
