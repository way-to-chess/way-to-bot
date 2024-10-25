import { Location } from "@entities/location.entity";

export interface ILocationCreatePayload {
  title: string;
  url?: string;
  address?: string;
  fileId?: number;
}

export interface ILocationUpdatePayload
  extends Partial<Omit<Location, "createdAt" | "updatedAt" | "preview">> {
  fileId?: number;
}

export interface ILocationDeletePayload {
  locationId: number;
}

export interface ILocationByIdPayload {
  locationId: number;
}
