import { requestWithPayload, simpleGetRequest } from "./RequestUtils";
import {
  IUserCreatePayload,
  IUserDeletePayload,
  IUserUpdatePayload,
} from "@way-to-bot/shared/interfaces/user.interface";
import { IResponseWithData } from "@way-to-bot/shared/interfaces/response.interface";
import {
  IAddUsersToEventPayload,
  IEventCreatePayload,
  IEventDeletePayload,
  IEventUpdatePayload,
  IRemoveUsersFromEventPayload,
} from "@way-to-bot/shared/interfaces/event.interface";
import {
  ILocationCreatePayload,
  ILocationDeletePayload,
  ILocationUpdatePayload,
} from "@way-to-bot/shared/interfaces/location.interface";
import {
  ILeagueCreatePayload,
  ILeagueDeletePayload,
  ILeagueUpdatePayload,
} from "@way-to-bot/shared/interfaces/league.interface";
import { EventEntity } from "@way-to-bot/shared/entities/event.entity";
import { LeagueEntity } from "@way-to-bot/shared/entities/league.entity";
import { LocationEntity } from "@way-to-bot/shared/entities/location.entity";
import { UserEntity } from "@way-to-bot/shared/entities/user.entity";

const httpApi = {
  //USERS
  getUserById: (userId: number) =>
    simpleGetRequest<IResponseWithData<UserEntity>>(`user/getById/${userId}`)(),
  getUserByUsername: (username: string) =>
    simpleGetRequest<IResponseWithData<UserEntity>>(
      `user/getByUserName/${username}`,
    )(),
  getAllUsers: simpleGetRequest<IResponseWithData<UserEntity[]>>("user/all"),
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

  //LOCATIONS
  getAllLocations:
    simpleGetRequest<IResponseWithData<LocationEntity[]>>("location/all"),
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
  getAllEvents: simpleGetRequest<IResponseWithData<EventEntity[]>>("event/all"),
  getEventById: (eventId: string) =>
    simpleGetRequest<IResponseWithData<EventEntity>>(
      `event/getById/${eventId}`,
    )(),
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
  getAllLeagues:
    simpleGetRequest<IResponseWithData<LeagueEntity[]>>("league/all"),
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
