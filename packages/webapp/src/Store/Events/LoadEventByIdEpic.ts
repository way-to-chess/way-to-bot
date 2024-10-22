import { TAppEpic } from "../App/Epics/TAppEpic";
import { httpRequestEpicFactory } from "../Utils/HttpRequestEpicFactory";
import { EVENTS_GET_BY_ID_REQUEST_SYMBOL } from "./EventsVariables";
import { eventsSlice } from "./EventsSlice";

const loadEventByIdEpic =
  (eventId: string): TAppEpic =>
  (_, __, { httpApi }) =>
    httpRequestEpicFactory({
      input: httpApi.getEventById(eventId),
      requestSymbol: EVENTS_GET_BY_ID_REQUEST_SYMBOL,
      receivedActionCreator: eventsSlice.actions.singleEventReceived,
    });
export { loadEventByIdEpic };
