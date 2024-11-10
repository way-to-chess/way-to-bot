import { LocationEntity } from "../entities/location.entity";

export interface ILocationCreatePayload {
  title: string;
  url?: string;
  address?: string;
  fileId?: number;
}

export interface ILocationUpdatePayload
  extends Partial<Omit<LocationEntity, "createdAt" | "updatedAt" | "preview">> {
  fileId?: number;
}

export interface ILocationDeletePayload {
  locationId: number;
}
