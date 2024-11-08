import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  IEvent,
  IEventCreatePayload,
  IEventDeletePayload,
  IEventUpdatePayload,
} from "@way-to-bot/shared/interfaces/event.interface";
import { IResponseWithData } from "@way-to-bot/shared/interfaces/response.interface";

interface IEventsSlice {
  manageEventsDrawerVisible: boolean;
  events: IEvent[];
}

const initialState: IEventsSlice = {
  manageEventsDrawerVisible: false,
  events: [],
};

const eventsSlice = createSlice({
  name: "events",
  initialState,
  reducers: {
    eventsReceived: (
      state,
      { payload }: PayloadAction<IResponseWithData<IEvent[]>>,
    ) => {
      state.events = payload.data;
    },
    updateEvent: (_, __: PayloadAction<IEventUpdatePayload>) => {},
    deleteEvent: (_, __: PayloadAction<IEventDeletePayload>) => {},

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
    events: (sliceState) => sliceState.events,
    eventById: (sliceState, eventId: number) =>
      sliceState.events.find((it) => it.id === eventId),
  },
});

export { eventsSlice };
