import { IEvent } from "./event.interface";
import { IUser } from "./user.interface";
import { IFile } from "./file.interface";
import { TDate } from "./date.inteface";

export interface IParticipateRequest {
  id: number;
  event: IEvent;
  user: IUser;
  receipt?: IFile;
  approved: boolean;
  createdAt: TDate;
  updatedAt: TDate;
}

export interface IParticipateRequestCreatePayload
  extends Omit<
    IParticipateRequest,
    "id" | "approved" | "createdAt" | "updatedAt" | "event" | "user" | "receipt"
  > {
  fileId?: number;
  eventId: number;
  userId: number;
}

export interface IParticipateRequestUpdatePayload
  extends Partial<
    Omit<
      IParticipateRequest,
      "createdAt" | "updatedAt" | "event" | "user" | "id" | "receipt"
    >
  > {
  id: number;
  fileId?: number | null;
  eventId: number;
  userId: number;
}

export interface IParticipateRequestDeletePayload {
  id: number;
}
