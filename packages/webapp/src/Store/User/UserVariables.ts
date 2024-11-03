import { createRequestSymbol } from "../RequestManager/CreateRequestSymbol";

const USER_CREATE_REQUEST_SYMBOL = createRequestSymbol("USER_CREATE");
const USER_DELETE_REQUEST_SYMBOL = createRequestSymbol("USER_DELETE");

const USERS_LOAD_REQUEST_SYMBOL = createRequestSymbol("USERS_LOAD");

export {
  USER_CREATE_REQUEST_SYMBOL,
  USERS_LOAD_REQUEST_SYMBOL,
  USER_DELETE_REQUEST_SYMBOL,
};
