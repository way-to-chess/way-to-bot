import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  IAddUsersToEventPayload,
  IEventCreatePayload,
  IEventDeletePayload,
  IEventUpdatePayload,
  IRemoveUsersFromEventPayload,
} from "@way-to-bot/shared/interfaces/event.interface";
import { IResponseWithData } from "@way-to-bot/shared/interfaces/response.interface";
import { EventEntity } from "@way-to-bot/shared/entities/event.entity";

interface IEventsSlice {
  events: EventEntity[];
}

const initialState: IEventsSlice = {
  events: [],
};

const eventsSlice = createSlice({
  name: "events",
  initialState,
  reducers: {
    eventsReceived: (
      state,
      {
        payload,
      }: PayloadAction<IResponseWithData<EventEntity[] | EventEntity>>,
    ) => {
      state.events = Array.isArray(payload.data)
        ? payload.data
        : [payload.data];
    },
    updateEvent: (_, __: PayloadAction<IEventUpdatePayload>) => {},
    deleteEvent: (_, __: PayloadAction<IEventDeletePayload>) => {},
    createEvent: (_, __: PayloadAction<IEventCreatePayload>) => {},
    addUsersToEvent: (_, __: PayloadAction<IAddUsersToEventPayload>) => {},
    removeUsersFromEvent: (
      _,
      __: PayloadAction<IRemoveUsersFromEventPayload>,
    ) => {},
  },
  selectors: {
    events: (sliceState) => sliceState.events,
    eventById: (sliceState, eventId: number | string) => {
      return sliceState.events.find((it) => it.id === Number(eventId)) ?? null;
    },
  },
});

export { eventsSlice };
