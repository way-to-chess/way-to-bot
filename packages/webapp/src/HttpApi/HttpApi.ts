import { requestWithPayload, simpleGetRequest } from "./RequestUtils";
import {
  IUser,
  IUserCreatePayload,
  IUserDeletePayload,
  IUserUpdatePayload,
} from "@way-to-bot/shared/interfaces/user.interface";
import { IResponseWithData } from "@way-to-bot/shared/interfaces/response.interface";
import {
  IEvent,
  IEventCreatePayload,
  IEventDeletePayload,
  IEventUpdatePayload,
} from "@way-to-bot/shared/interfaces/event.interface";
import {
  ILocation,
  ILocationCreatePayload,
  ILocationDeletePayload,
  ILocationUpdatePayload,
} from "@way-to-bot/shared/interfaces/location.interface";
import {
  ILeague,
  ILeagueCreatePayload,
  ILeagueDeletePayload,
  ILeagueUpdatePayload,
} from "@way-to-bot/shared/interfaces/league.interface";

const httpApi = {
  getUserByUsername: (username: string) =>
    simpleGetRequest<IResponseWithData<IUser>>(
      `user/getByUserName/${username}`,
    )(),
  getAllUsers: simpleGetRequest<IResponseWithData<IUser[]>>("user/all"),
  createUser: requestWithPayload<IUserCreatePayload, boolean>(
    "POST",
    "user/create",
  ),
  deleteUser: requestWithPayload<IUserDeletePayload, boolean>(
    "DELETE",
    "user/delete",
  ),
  updateUser: requestWithPayload<IUserUpdatePayload, boolean>(
    "UPDATE",
    "user/update",
  ),
  getAllLocations:
    simpleGetRequest<IResponseWithData<ILocation[]>>("location/all"),
  createLocation: requestWithPayload<ILocationCreatePayload, boolean>(
    "POST",
    "location/create",
  ),
  deleteLocation: requestWithPayload<ILocationDeletePayload, boolean>(
    "DELETE",
    "location/delete",
  ),
  updateLocation: requestWithPayload<ILocationUpdatePayload, boolean>(
    "PUT",
    "location/update",
  ),
  getAllEvents: simpleGetRequest<IResponseWithData<IEvent[]>>("event/all"),
  createEvent: requestWithPayload<IEventCreatePayload, boolean>(
    "POST",
    "event/create",
  ),
  updateEvent: requestWithPayload<IEventUpdatePayload, boolean>(
    "PUT",
    "event/update",
  ),
  deleteEvent: requestWithPayload<IEventDeletePayload, boolean>(
    "DELETE",
    "event/delete",
  ),
  getAllLeagues: simpleGetRequest<IResponseWithData<ILeague[]>>("league/all"),
  createLeague: requestWithPayload<ILeagueCreatePayload, boolean>(
    "POST",
    "league/create",
  ),
  updateLeague: requestWithPayload<ILeagueUpdatePayload, boolean>(
    "PUT",
    "league/update",
  ),
  deleteLeague: requestWithPayload<ILeagueDeletePayload, boolean>(
    "DELETE",
    "league/delete",
  ),
};

export { httpApi };
