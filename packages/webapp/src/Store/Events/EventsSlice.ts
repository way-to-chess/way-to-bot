import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  IAddUsersToEventPayload,
  IEvent,
  IEventCreatePayload,
  IEventDeletePayload,
  IEventUpdatePayload,
  IRemoveUsersFromEventPayload,
} from "@way-to-bot/shared/interfaces/event.interface";
import { IResponseWithData } from "@way-to-bot/shared/interfaces/response.interface";
import { getNotNil } from "@way-to-bot/shared/utils/getNotNil";

interface IEventsSlice {
  events: IEvent[];
}

const initialState: IEventsSlice = {
  events: [],
};

const eventById = (sliceState: IEventsSlice, eventId: number | string) => {
  return sliceState.events.find((it) => it.id === Number(eventId)) ?? null;
};

const notNilEventById = (
  sliceState: IEventsSlice,
  eventId: number,
  context: string,
) =>
  getNotNil(
    eventById(sliceState, eventId),
    `event with id: ${eventId} not found | context: ${context}`,
  );

const eventsSlice = createSlice({
  name: "events",
  initialState,
  reducers: {
    eventsReceived: (
      state,
      { payload }: PayloadAction<IResponseWithData<IEvent[] | IEvent>>,
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
    eventById,
    notNilEventById,
    eventStatusById: (sliceState, eventId: number) => {
      const event = notNilEventById(sliceState, eventId, "eventStatusById");

      return event.status;
    },
    notNilEventParticipateRequests: (sliceState, eventId: number) => {
      const event = notNilEventById(
        sliceState,
        eventId,
        "notNilEventParticipateRequests",
      );

      return event.participateRequests;
    },
    hasPendingParticipateRequest: (
      sliceState,
      eventId: number,
      userId: number,
    ) => {
      const event = eventById(sliceState, eventId);

      const participateRequest = event?.participateRequests.find(
        (it) => it.user.id === userId,
      );

      return participateRequest && !participateRequest.approved;
    },
  },
});

export { eventsSlice };
