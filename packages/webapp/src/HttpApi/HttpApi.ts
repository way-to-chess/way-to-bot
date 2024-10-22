import { TUser } from "../Models/TUser.ts";
import { IWithError } from "../Models/IError.ts";
import {
  TUserInitResponse,
  TUserInitResponseData,
  TUserUpdatePayload,
} from "../../../src/types/user.types.ts";
import { Location } from "../../../src/database/entities/Location.ts";
import {
  TLocationCreatePayload,
  TLocationDeletePayload,
  TLocationUpdatePayload,
} from "../../../src/types/location.types.ts";
import {
  BASE_API_URL,
  requestWithPayload,
  simpleGetRequest,
} from "./RequestUtils.ts";
import type {
  IGetAllEventsResponse,
  IUpdateEventResponse,
} from "./HttpApiTypes.ts";
import { IWithEvent } from "../Models/TEvent.ts";
import {
  TEventCreatePayload,
  TEventDeletePayload,
  TEventUpdatePayload,
} from "../../../src/types/event.types.ts";
import { TTeamParticipantDeletePayload } from "../../../src/types/team-participant.types.ts";
import {
  TTeamCreatePayload,
  TTeamDeletePayload,
  TTeamUpdatePayload,
} from "../../../src/types/team.types.ts";
import {
  TGameCreatePayload,
  TGameDeletePayload,
  TGameUpdatePayload,
} from "../../../src/types/game.types.ts";
import {
  TGameStatAddPayload,
  TGameStatDeletePayload,
} from "../../../src/types/game-stat.types.ts";

const httpApi = {
  getAllEvents: simpleGetRequest<IGetAllEventsResponse>("event/all"),
  getEventById: (eventId: string) =>
    simpleGetRequest<IWithEvent>(`/event/getById/${eventId}`)(),
  createEvent: requestWithPayload<TEventCreatePayload, undefined>(
    "POST",
    "event/create",
  ),
  updateEvent: requestWithPayload<TEventUpdatePayload, IUpdateEventResponse>(
    "PUT",
    "event/update",
  ),
  deleteEvent: requestWithPayload<TEventDeletePayload, boolean>(
    "DELETE",
    "event/delete",
  ),
  getEventsLocations: simpleGetRequest<IGetAllEventsResponse>("location/all"),
  getAllUsers: async (): Promise<{ users: TUser[] }> => {
    const response = await fetch(`${BASE_API_URL}/user/all`);
    if (!response.ok) {
      console.error(response.statusText);

      return { users: [] };
    }
    return await response.json();
  },
  getOrCreateUserByUsername: async (
    username: string,
  ): Promise<TUserInitResponse | IWithError> => {
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
  getUserById: async (
    id: number,
  ): Promise<TUserInitResponseData | IWithError> => {
    const response = await fetch(`${BASE_API_URL}/user/getById/${id}`);

    if (!response.ok) {
      return { error: response.statusText };
    }

    return await response.json();
  },
  updateUser: async (payload: TUserUpdatePayload) => {
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
  updateLocation: async (payload: TLocationUpdatePayload) => {
    const response = await fetch(`${BASE_API_URL}/location/update`, {
      body: JSON.stringify(payload),
      headers: {
        "Content-Type": "application/json",
      },
      method: "PUT",
    });

    console.log(response);
  },
  createLocation: async (payload: TLocationCreatePayload) => {
    const response = await fetch(`${BASE_API_URL}/location/create`, {
      body: JSON.stringify(payload),
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
    });

    console.log(response);
  },
  deleteLocation: async (payload: TLocationDeletePayload) => {
    const response = await fetch(`${BASE_API_URL}/location/delete`, {
      body: JSON.stringify(payload),
      headers: {
        "Content-Type": "application/json",
      },
      method: "DELETE",
    });

    console.log(response);
  },
  deleteTeamParticipant: requestWithPayload<
    TTeamParticipantDeletePayload,
    boolean
  >("DELETE", "/team-participant/delete"),
  createEventTeam: requestWithPayload<TTeamCreatePayload, boolean>(
    "POST",
    "team/create",
  ),
  updateEventTeam: requestWithPayload<TTeamUpdatePayload, boolean>(
    "PUT",
    "team/update",
  ),
  deleteEventTeam: requestWithPayload<TTeamDeletePayload, boolean>(
    "DELETE",
    "team/delete",
  ),
  createEventGame: requestWithPayload<TGameCreatePayload, boolean>(
    "POST",
    "game/create",
  ),
  updateEventGame: requestWithPayload<TGameUpdatePayload, boolean>(
    "PUT",
    "game/update",
  ),
  deleteEventGame: requestWithPayload<TGameDeletePayload, boolean>(
    "DELETE",
    "game/delete",
  ),
  addEventGameStat: requestWithPayload<TGameStatAddPayload, boolean>(
    "POST",
    "game/stat/add",
  ),
  deleteEventGameStat: requestWithPayload<TGameStatDeletePayload, boolean>(
    "DELETE",
    "game/stat/delete",
  ),
};

type THttpApi = typeof httpApi;

export { httpApi, type THttpApi };
