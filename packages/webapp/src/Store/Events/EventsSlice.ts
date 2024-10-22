import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IWithEvent, TEvent } from "../../Models/TEvent";
import { IGetAllEventsResponse } from "../../HttpApi/HttpApiTypes";
import { getNotNil } from "../../Utils/GetNotNil";

interface IEventsSlice {
  edges: TEvent[];
  singleEvent: TEvent | null;
}

const initialState: IEventsSlice = {
  edges: [],
  singleEvent: null,
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
    create: () => {},
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
  },
  selectors: {
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
  },
});

export { eventsSlice };
