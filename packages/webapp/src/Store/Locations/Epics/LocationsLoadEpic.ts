import { TAppEpic } from "../../App/Epics/TAppEpic";
import { httpRequestEpicFactory } from "../../Utils/HttpRequestEpicFactory";
import { LOCATIONS_GET_ALL_REQUEST_SYMBOL } from "../LocationsVariables";
import { locationsSlice } from "../LocationsSlice";

const locationsLoadEpic: TAppEpic = (_, __, { httpApi }) =>
  httpRequestEpicFactory({
    input: httpApi.getAllLocations(),
    requestSymbol: LOCATIONS_GET_ALL_REQUEST_SYMBOL,
    receivedActionCreator: locationsSlice.actions.received,
  });

export { locationsLoadEpic };
