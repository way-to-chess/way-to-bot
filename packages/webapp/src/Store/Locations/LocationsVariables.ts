import { createRequestSymbol } from "../RequestManager/CreateRequestSymbol";

const LOCATIONS_GET_ALL_REQUEST_SYMBOL = createRequestSymbol("LOCATIONS");
const LOCATIONS_CREATE_REQUEST_SYMBOL = createRequestSymbol("LOCATIONS_CREATE");

export { LOCATIONS_GET_ALL_REQUEST_SYMBOL, LOCATIONS_CREATE_REQUEST_SYMBOL };
