import { TEvent } from "../Models/TEvent";
import { Location } from "../../../src/database/entities/Location";

interface IGetAllEventsResponse {
  events: TEvent[];
}

interface IGetAllLocationsResponse {
  locations: Location[];
}

interface IUpdateEventResponse {
  updatedEvent: TEvent[];
}

export type {
  IGetAllEventsResponse,
  IGetAllLocationsResponse,
  IUpdateEventResponse,
};
