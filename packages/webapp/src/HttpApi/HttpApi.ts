import { IWithError } from "../Models/IError";

import {
  BASE_API_URL,
  requestWithPayload,
  simpleGetRequest,
} from "./RequestUtils";
import type {
  IGetAllEventsResponse,
  IUpdateEventResponse,
} from "./HttpApiTypes";
import { IWithEvent } from "../Models/TEvent";
import {
  IUser,
  IUserCreatePayload,
  IUserDeletePayload,
  IUserUpdatePayload,
} from "@way-to-bot/shared/interfaces/user.interface";
import { IResponseWithData } from "@way-to-bot/shared/interfaces/response.interface";
import {
  IEventCreatePayload,
  IEventDeletePayload,
  IEventUpdatePayload,
} from "@way-to-bot/shared/interfaces/event.interface";
import {
  ILocationCreatePayload,
  ILocationDeletePayload,
  ILocationUpdatePayload,
} from "@way-to-bot/shared/interfaces/location.interface";

const httpApi = {
  getAllEvents: simpleGetRequest<IGetAllEventsResponse>("event/all"),
  getEventById: (eventId: string) =>
    simpleGetRequest<IWithEvent>(`/event/getById/${eventId}`)(),
  createEvent: requestWithPayload<IEventCreatePayload, undefined>(
    "POST",
    "event/create",
  ),
  updateEvent: requestWithPayload<IEventUpdatePayload, IUpdateEventResponse>(
    "PUT",
    "event/update",
  ),
  deleteEvent: requestWithPayload<IEventDeletePayload, boolean>(
    "DELETE",
    "event/delete",
  ),
  getEventsLocations: simpleGetRequest<IGetAllEventsResponse>("location/all"),
  getOrCreateUserByUsername: async (
    username: string,
  ): Promise<any | IWithError> => {
    const response = await fetch(`${BASE_API_URL}/user/init`, {
      body: JSON.stringify({ username }),
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
    });

    if (!response.ok) {
      return { error: response.statusText };
    }

    return await response.json();
  },
  getUserById: async (id: number): Promise<IUser | IWithError> => {
    const response = await fetch(`${BASE_API_URL}/user/getById/${id}`);

    if (!response.ok) {
      return { error: response.statusText };
    }

    return await response.json();
  },
  updateUser: async (payload: IUserUpdatePayload) => {
    const response = await fetch(`${BASE_API_URL}/user/update`, {
      body: JSON.stringify(payload),
      headers: {
        "Content-Type": "application/json",
      },
      method: "PUT",
    });

    if (!response.ok) {
      return { error: response.statusText };
    }

    return await response.json();
  },
  joinEvent: async (payload: { username: string; eventId: number }) => {
    const response = await fetch(`${BASE_API_URL}/event/join-event`, {
      body: JSON.stringify(payload),
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
    });
    console.log(response);
  },
  leaveEvent: async (payload: { username: string; eventId: number }) => {
    const response = await fetch(`${BASE_API_URL}/event/leave-event`, {
      body: JSON.stringify(payload),
      headers: {
        "Content-Type": "application/json",
      },
      method: "DELETE",
    });
    console.log(response);
  },
  getAllLocations: async (): Promise<{ locations: Location[] }> => {
    const response = await fetch(`${BASE_API_URL}/location/all`);
    if (!response.ok) {
      console.error(response.statusText);

      return { locations: [] };
    }
    return await response.json();
  },
  updateLocation: async (payload: ILocationUpdatePayload) => {
    const response = await fetch(`${BASE_API_URL}/location/update`, {
      body: JSON.stringify(payload),
      headers: {
        "Content-Type": "application/json",
      },
      method: "PUT",
    });

    console.log(response);
  },
  createLocation: async (payload: ILocationCreatePayload) => {
    const response = await fetch(`${BASE_API_URL}/location/create`, {
      body: JSON.stringify(payload),
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
    });

    console.log(response);
  },
  deleteLocation: async (payload: ILocationDeletePayload) => {
    const response = await fetch(`${BASE_API_URL}/location/delete`, {
      body: JSON.stringify(payload),
      headers: {
        "Content-Type": "application/json",
      },
      method: "DELETE",
    });

    console.log(response);
  },
  deleteTeamParticipant: requestWithPayload<any, boolean>(
    "DELETE",
    "/team-participant/delete",
  ),
  createEventTeam: requestWithPayload<any, boolean>("POST", "team/create"),
  updateEventTeam: requestWithPayload<any, boolean>("PUT", "team/update"),
  deleteEventTeam: requestWithPayload<any, boolean>("DELETE", "team/delete"),
  createEventGame: requestWithPayload<any, boolean>("POST", "game/create"),
  updateEventGame: requestWithPayload<any, boolean>("PUT", "game/update"),
  deleteEventGame: requestWithPayload<any, boolean>("DELETE", "game/delete"),
  addEventGameStat: requestWithPayload<any, boolean>("POST", "game/stat/add"),
  deleteEventGameStat: requestWithPayload<any, boolean>(
    "DELETE",
    "game/stat/delete",
  ),

  getAllUsers: simpleGetRequest<IResponseWithData<IUser[]>>("user/all"),
  createUser: requestWithPayload<IUserCreatePayload, boolean>(
    "POST",
    "user/create",
  ),
  deleteUser: requestWithPayload<IUserDeletePayload, boolean>(
    "DELETE",
    "user/delete",
  ),
};

type THttpApi = typeof httpApi;

export { httpApi, type THttpApi };
