import { TDate } from "./date.inteface";
import { IFile } from "./file.interface";

export interface ILocation {
  id: number;
  title: string;
  url?: string | null;
  address?: string | null;
  preview?: IFile | null;
  createdAt: TDate;
  updatedAt: TDate;
}

export interface ILocationCreatePayload {
  title: string;
  url?: string;
  address?: string;
  fileId?: number;
}

export interface ILocationUpdatePayload
  extends Partial<Omit<ILocation, "createdAt" | "updatedAt" | "preview">> {
  fileId?: number;
}

export interface ILocationDeletePayload {
  locationId: number;
}
