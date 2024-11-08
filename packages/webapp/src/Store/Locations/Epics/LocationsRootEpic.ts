import { combineEpics } from "redux-observable";
import { routerEpic } from "../../Utils/RouterEpic";
import { WEBAPP_ROUTES } from "@way-to-bot/shared/constants/webappRoutes";
import { TAppEpic } from "../../App/Epics/TAppEpic";
import { EMPTY, switchMap } from "rxjs";
import { locationsSlice } from "../LocationsSlice";

import { locationsLoadEpic } from "./LocationsLoadEpic";
import { message } from "antd";
import { fromActionCreator } from "../../Utils/FromActionCreator";
import { httpRequestEpicFactory } from "../../Utils/HttpRequestEpicFactory";
import {
  LOCATIONS_CREATE_REQUEST_SYMBOL,
  LOCATIONS_DELETE_REQUEST_SYMBOL,
  LOCATIONS_UPDATE_REQUEST_SYMBOL,
} from "../../Locations/LocationsVariables";
import { TEXT } from "@way-to-bot/shared/constants/text";

const deleteLocationEpic: TAppEpic = (action$, state$, dependencies) =>
  action$.pipe(
    fromActionCreator(locationsSlice.actions.deleteLocation),
    switchMap(({ payload }) =>
      httpRequestEpicFactory({
        input: dependencies.httpApi.deleteLocation(payload),
        requestSymbol: LOCATIONS_DELETE_REQUEST_SYMBOL,
        onSuccess: () => {
          message.success(TEXT.api.success);

          return locationsLoadEpic(action$, state$, dependencies);
        },
        onError: () => {
          message.error(TEXT.api.error);

          return EMPTY;
        },
      }),
    ),
  );

const updateLocationEpic: TAppEpic = (action$, state$, dependencies) =>
  action$.pipe(
    fromActionCreator(locationsSlice.actions.updateLocation),
    switchMap(({ payload }) =>
      httpRequestEpicFactory({
        input: dependencies.httpApi.updateLocation(payload),
        requestSymbol: LOCATIONS_UPDATE_REQUEST_SYMBOL,
        onSuccess: () => {
          message.success(TEXT.api.success);

          return locationsLoadEpic(action$, state$, dependencies);
        },
        onError: () => {
          message.error(TEXT.api.error);

          return EMPTY;
        },
      }),
    ),
  );

const createLocationEpic: TAppEpic = (action$, state$, dependencies) =>
  action$.pipe(
    fromActionCreator(locationsSlice.actions.createLocation),
    switchMap(({ payload }) =>
      httpRequestEpicFactory({
        input: dependencies.httpApi.createLocation(payload),
        requestSymbol: LOCATIONS_CREATE_REQUEST_SYMBOL,
        onSuccess: () => {
          message.success(TEXT.api.success);

          return locationsLoadEpic(action$, state$, dependencies);
        },
        onError: () => {
          message.error(TEXT.api.error);

          return EMPTY;
        },
      }),
    ),
  );

const locationsRouterEpic = routerEpic(WEBAPP_ROUTES.manageLocationsRoute, () =>
  combineEpics(
    locationsLoadEpic,
    deleteLocationEpic,
    createLocationEpic,
    updateLocationEpic,
  ),
);

export { locationsRouterEpic as locationsRootEpic };
