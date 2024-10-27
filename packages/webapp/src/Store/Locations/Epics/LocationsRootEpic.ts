import { combineEpics, ofType } from "redux-observable";
import { routerEpic } from "../../Utils/RouterEpic";
import { WEBAPP_ROUTES } from "@way-to-bot/shared/constants/webappRoutes";
import { TAppEpic } from "../../App/Epics/TAppEpic";
import { catchError, delay, from, of, switchMap } from "rxjs";
import { locationsSlice } from "../LocationsSlice";
import { PayloadAction } from "@reduxjs/toolkit";

import { locationsLoadEpic } from "./LocationsLoadEpic";
import { message } from "antd";

//todo get type from server
type TLocationCreatePayload = any;
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

const locationsRouterEpic = routerEpic(WEBAPP_ROUTES.locationsRoute, () =>
  combineEpics(locationsLoadEpic, deleteLocationEpic),
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

const createLocationEpic: TAppEpic = (action$, _, dependencies) =>
  action$.pipe(
    ofType("locations/create"),
    switchMap(({ payload }: PayloadAction<TLocationCreatePayload>) => {
      return from(dependencies.httpApi.createLocation(payload)).pipe(
        () => of(locationsSlice.actions.createSuccess()),
        catchError(() => of(locationsSlice.actions.createError())),
      );
    }),
  );

const createLocationRouterEpic = routerEpic(
  WEBAPP_ROUTES.createLocationRoute,
  () => createLocationEpic,
);

const locationsRootEpic = combineEpics(
  locationsRouterEpic,
  updateLocationRouterEpic,
  createLocationRouterEpic,
);

export { locationsRootEpic };
