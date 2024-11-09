import { createRequestSymbol } from "../RequestManager/CreateRequestSymbol";

const EVENTS_GET_ALL_REQUEST_SYMBOL = createRequestSymbol("EVENTS_GET_ALL");
const EVENTS_GET_BY_ID_REQUEST_SYMBOL = createRequestSymbol("EVENTS_GET_BY_ID");
const EVENTS_CREATE_REQUEST_SYMBOL = createRequestSymbol("EVENTS_CREATE");
const EVENTS_UPDATE_REQUEST_SYMBOL = createRequestSymbol("EVENTS_UPDATE");
const EVENTS_DELETE_REQUEST_SYMBOL = createRequestSymbol("EVENTS_DELETE");
const ADD_USERS_TO_EVENT_REQUEST_SYMBOL = createRequestSymbol("EVENTS_DELETE");

export {
  EVENTS_GET_ALL_REQUEST_SYMBOL,
  EVENTS_GET_BY_ID_REQUEST_SYMBOL,
  EVENTS_CREATE_REQUEST_SYMBOL,
  EVENTS_UPDATE_REQUEST_SYMBOL,
  EVENTS_DELETE_REQUEST_SYMBOL,
  ADD_USERS_TO_EVENT_REQUEST_SYMBOL,
};
