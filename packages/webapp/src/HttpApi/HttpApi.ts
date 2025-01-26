import { requestWithPayload, simpleGetRequest } from "./RequestUtils";
import {
  IUser,
  IUserCreatePayload,
  IUserDeletePayload,
  IUserGetByTgInfoQueryPayload,
  IUserUpdatePayload,
} from "@way-to-bot/shared/interfaces/user.interface";
import { IResponseWithData } from "@way-to-bot/shared/interfaces/response.interface";
import {
  IAddUsersToEventPayload,
  IEvent,
  IEventCreatePayload,
  IEventDeletePayload,
  IEventUpdatePayload,
  IRemoveUsersFromEventPayload,
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
import { createQueryString } from "../Utils/CreateQueryString";

const httpApi = {
  //USERS
  getUserById: (userId: number) =>
    simpleGetRequest<IResponseWithData<IUser>>(`user/getById/${userId}`)(),
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
    "PUT",
    "user/update",
  ),
  getUserByTgInfo: ({ username, tgId }: IUserGetByTgInfoQueryPayload) =>
    simpleGetRequest<IResponseWithData<IUser>>(
      `user/getUserByTgInfo/${createQueryString({ username, tgId })}`,
    )(),

  //LOCATIONS
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

  //EVENTS
  getAllEvents: simpleGetRequest<IResponseWithData<IEvent[]>>("event/all"),
  getEventById: (eventId: string) =>
    simpleGetRequest<IResponseWithData<IEvent>>(`event/getById/${eventId}`)(),
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
  addUsersToEvent: requestWithPayload<IAddUsersToEventPayload, boolean>(
    "POST",
    "event/addUsersToEvent",
  ),
  removeUsersFromEvent: requestWithPayload<
    IRemoveUsersFromEventPayload,
    boolean
  >("POST", "event/removeUsersFromEvent"),

  //LEAGUES
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
