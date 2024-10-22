import { TAppEpic } from "../App/Epics/TAppEpic.ts";
import { httpRequestEpicFactory } from "../Utils/HttpRequestEpicFactory.ts";
import { EVENTS_GET_BY_ID_REQUEST_SYMBOL } from "./EventsVariables.ts";
import { eventsSlice } from "./EventsSlice.ts";

const loadEventByIdEpic =
  (eventId: string): TAppEpic =>
  (_, __, { httpApi }) =>
    httpRequestEpicFactory({
      input: httpApi.getEventById(eventId),
      requestSymbol: EVENTS_GET_BY_ID_REQUEST_SYMBOL,
      receivedActionCreator: eventsSlice.actions.singleEventReceived,
    });
export { loadEventByIdEpic };
