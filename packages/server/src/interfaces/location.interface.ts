import { Location } from "../database/entities/location.entity";

export interface ILocationCreatePayload
  extends Partial<
    Omit<Location, "id" | "createdAt" | "updatedAt" | "preview">
  > {
  fileId?: number;
}

export interface ILocationUpdatePayload
  extends Partial<Omit<Location, "createdAt" | "updatedAt" | "preview">> {
  fileId?: number | null;
}

export interface ILocationDeletePayload {
  locationId: number;
}
