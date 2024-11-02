import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IWithEvent, TEvent } from "../../Models/TEvent";
import { IGetAllEventsResponse } from "../../HttpApi/HttpApiTypes";
import { getNotNil } from "../../Utils/GetNotNil";
import {
  IEvent,
  IEventCreatePayload,
} from "@way-to-bot/shared/interfaces/event.interface";
import { EVENTS } from "./EVENTS";

interface IEventsSlice {
  edges: TEvent[];
  singleEvent: TEvent | null;
  manageEventsDrawerVisible: boolean;

  events: IEvent[];
}

const initialState: IEventsSlice = {
  edges: [],
  singleEvent: null,
  manageEventsDrawerVisible: false,

  events: EVENTS,
};

const eventsSlice = createSlice({
  name: "events",
  initialState,
  reducers: {
    received: (state, { payload }: PayloadAction<IGetAllEventsResponse>) => {
      state.edges = payload.events;
    },
    singleEventReceived: (state, { payload }: PayloadAction<IWithEvent>) => {
      state.singleEvent = payload.event;
    },
    update: () => {},
    updated: () => {},
    delete: () => {},
    deleted: () => {},
    deleteTeamParticipant: () => {},
    createSingleEventTeam: () => {},
    updateSingleEventTeam: () => {},
    deleteSingleEventTeam: () => {},
    createSingleEventGame: () => {},
    updateSingleEventGame: () => {},
    deleteSingleEventGame: () => {},
    addSingleEventGameStat: () => {},
    deleteSingleEventGameStat: () => {},

    manageEventsDrawerVisibilityChanged: (
      state,
      { payload }: { payload: boolean },
    ) => {
      state.manageEventsDrawerVisible = payload;
    },

    createEvent: (_, __: PayloadAction<IEventCreatePayload>) => {},
  },
  selectors: {
    manageEventsDrawerVisible: (sliceState) =>
      sliceState.manageEventsDrawerVisible,

    edges: (sliceState) => sliceState.edges,
    singleEventNotNil: (sliceState) =>
      getNotNil(sliceState.singleEvent, "singleEventNotNilSelector"),
    singleEventParticipants: (sliceState) => {
      const event = getNotNil(
        sliceState.singleEvent,
        "singleEventParticipants -> event",
      );

      return event.participants;
    },
    singleEventTeamByIdNotNil: (sliceState, id: number) => {
      const event = getNotNil(
        sliceState.singleEvent,
        "singleEventTeamById -> event",
      );

      return getNotNil(
        event.teams.find((it) => it.id === id),
        "singleEventTeamById -> event.teams.find",
      );
    },
    singleEventTeams: (sliceState) => {
      const event = getNotNil(
        sliceState.singleEvent,
        "singleEventParticipants -> event",
      );

      return event.teams;
    },
    singleEventGameByIdNotNil: (sliceState, id: number) => {
      const event = getNotNil(
        sliceState.singleEvent,
        "singleEventGameByIdNotNil -> event",
      );

      return getNotNil(
        event.games.find((it) => it.id === id),
        "singleEventGameByIdNotNil -> event.games.find",
      );
    },

    events: (sliceState) => sliceState.events,
    eventById: (sliceState, eventId: number) =>
      sliceState.events.find((it) => it.id === eventId),
  },
});

export { eventsSlice };
