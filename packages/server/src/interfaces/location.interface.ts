import { LocationEntity } from "../database/entities/location.entity";

export interface ILocationCreatePayload
  extends Partial<
    Omit<LocationEntity, "id" | "createdAt" | "updatedAt" | "preview">
  > {
  fileId?: number;
}

export interface ILocationUpdatePayload
  extends Partial<Omit<LocationEntity, "createdAt" | "updatedAt" | "preview">> {
  fileId?: number | null;
}

export interface ILocationDeletePayload {
  locationId: number;
}
