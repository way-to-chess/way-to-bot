import { combineEpics, ofType } from "redux-observable";
import { routerEpic } from "../../Utils/RouterEpic";
import { WEBAPP_ROUTES } from "@way-to-bot/shared/constants/webappRoutes";
import { TAppEpic } from "../../App/Epics/TAppEpic";
import { catchError, delay, EMPTY, from, merge, of, switchMap } from "rxjs";
import { locationsSlice } from "../LocationsSlice";
import { PayloadAction } from "@reduxjs/toolkit";

import { locationsLoadEpic } from "./LocationsLoadEpic";
import { message } from "antd";
import { fromActionCreator } from "../../Utils/FromActionCreator";
import { ILocationCreatePayload } from "@way-to-bot/shared/interfaces/location.interface";
import { httpRequestEpicFactory } from "../../Utils/HttpRequestEpicFactory";
import { LOCATIONS_CREATE_REQUEST_SYMBOL } from "../../Locations/LocationsVariables";
import { TEXT } from "@way-to-bot/shared/constants/text";

//todo get type from server
type TLocationDeletePayload = any;
type TLocationUpdatePayload = any;

const deleteLocationEpic: TAppEpic = (action$, state$, dependencies) =>
  action$.pipe(
    ofType("locations/delete"),
    switchMap(({ payload }: PayloadAction<TLocationDeletePayload>) => {
      return from(dependencies.httpApi.deleteLocation(payload)).pipe(
        delay(500),
        switchMap(() => locationsLoadEpic(action$, state$, dependencies)),
      );
    }),
  );

const updateLocationEpic: TAppEpic = (action$, _, dependencies) =>
  action$.pipe(
    ofType("locations/update"),
    switchMap(({ payload }: PayloadAction<TLocationUpdatePayload>) => {
      return from(dependencies.httpApi.updateLocation(payload)).pipe(
        switchMap(() => {
          message.success("Updated");

          return of(locationsSlice.actions.updateSuccess());
        }),
        catchError(() => of(locationsSlice.actions.updateError())),
      );
    }),
  );

const updateLocationRouterEpic = routerEpic(
  WEBAPP_ROUTES.updateLocationRoute,
  () => updateLocationEpic,
);

const createLocationEpic: TAppEpic = (action$, state$, dependencies) =>
  action$.pipe(
    fromActionCreator(locationsSlice.actions.createLocation),
    switchMap(({ payload }: PayloadAction<ILocationCreatePayload>) => {
      return httpRequestEpicFactory({
        input: dependencies.httpApi.createLocation(payload),
        requestSymbol: LOCATIONS_CREATE_REQUEST_SYMBOL,
        onSuccess: () => {
          message.success(TEXT.api.success);

          return merge(
            of(
              locationsSlice.actions.manageLocationsDrawerVisibilityChanged(
                false,
              ),
            ),
            locationsLoadEpic(action$, state$, dependencies),
          );
        },
        onError: () => {
          message.error(TEXT.api.error);

          return EMPTY;
        },
      });
    }),
  );

const locationsRouterEpic = routerEpic(WEBAPP_ROUTES.manageLocationsRoute, () =>
  combineEpics(locationsLoadEpic, deleteLocationEpic, createLocationEpic),
);

const locationsRootEpic = combineEpics(
  locationsRouterEpic,
  updateLocationRouterEpic,
);

export { locationsRootEpic };
