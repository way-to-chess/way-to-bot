import { EUserRole } from "../enums";
import { TDate } from "./date.inteface";
import { IEvent } from "./event.interface";
import { IFile } from "./file.interface";

export interface IUser {
  id: number;
  username: string;
  firstName: string;
  lastName: string;
  roles: EUserRole[];
  photo?: IFile | null;
  wins: number;
  losses: number;
  draws: number;
  total: number;
  winRate: number;
  rating: number;
  createdAt: TDate;
  updatedAt: TDate;
  events?: IEvent[];
}

export interface IUserCreatePayload {
  username?: string;
  firstName: string;
  lastName: string;
  roles?: EUserRole[];
  fileId?: number;
  tgId?: number;
}

export interface IUserUpdatePayload
  extends Partial<
    Omit<IUser, "createdAt" | "updatedAt" | "winRate" | "photo">
  > {
  fileId?: number | null;
}

export interface IUserDeletePayload {
  userId: number;
}
