import { TAppEpic } from "../../App/Epics/TAppEpic.ts";
import { httpRequestEpicFactory } from "../../Utils/HttpRequestEpicFactory.ts";
import { LOCATIONS_GET_ALL_REQUEST_SYMBOL } from "../LocationsVariables.ts";
import { locationsSlice } from "../LocationsSlice.ts";

const locationsLoadEpic: TAppEpic = (_, __, { httpApi }) =>
  httpRequestEpicFactory({
    input: httpApi.getAllLocations(),
    requestSymbol: LOCATIONS_GET_ALL_REQUEST_SYMBOL,
    receivedActionCreator: locationsSlice.actions.received,
  });

export { locationsLoadEpic };
