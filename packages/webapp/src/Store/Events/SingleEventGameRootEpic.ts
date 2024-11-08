import { routerEpic } from "../Utils/RouterEpic";
import { combineEpics } from "redux-observable";
import { loadEventByIdEpic } from "./LoadEventByIdEpic";
import { getNotNil } from "@way-to-bot/shared/utils/getNotNil";
import { TAppEpic } from "../App/Epics/TAppEpic";
import { fromActionCreator } from "../Utils/FromActionCreator";
import { eventsSlice } from "./EventsSlice";
import { switchMap } from "rxjs";
import { httpRequestEpicFactory } from "../Utils/HttpRequestEpicFactory";
import {
  CREATE_EVENT_GAME_REQUEST_SYMBOL,
  DELETE_EVENT_GAME_REQUEST_SYMBOL,
  UPDATE_EVENT_GAME_REQUEST_SYMBOL,
} from "./EventsVariables";
import { message } from "antd";
import { WEBAPP_ROUTES } from "@way-to-bot/shared/constants/webappRoutes";

const deleteSingleEventGameEpicFactory =
  (eventId: string): TAppEpic =>
  (action$, state$, dependencies) =>
    action$.pipe(
      fromActionCreator(eventsSlice.actions.deleteSingleEventGame),
      switchMap(({ payload }) =>
        httpRequestEpicFactory({
          input: dependencies.httpApi.deleteEventGame(payload),
          requestSymbol: DELETE_EVENT_GAME_REQUEST_SYMBOL,
          onSuccess: () => {
            message.success("Deleted");
            return loadEventByIdEpic(eventId)(action$, state$, dependencies);
          },
          onError: (e) => {
            message.error(e);
            return loadEventByIdEpic(eventId)(action$, state$, dependencies);
          },
        }),
      ),
    );

const updateEventGameEpic: TAppEpic = (action$, _, { httpApi }) =>
  action$.pipe(
    fromActionCreator(eventsSlice.actions.updateSingleEventGame),
    switchMap(({ payload }) =>
      httpRequestEpicFactory({
        input: httpApi.updateEventGame(payload),
        requestSymbol: UPDATE_EVENT_GAME_REQUEST_SYMBOL,
      }),
    ),
  );

const updateEventGameRouterEpic = routerEpic(
  WEBAPP_ROUTES.updateSingleEventGameRoute,
  (match) => {
    const eventId = getNotNil(
      match.params.eventId,
      "createEventGameRouterEpic -> eventId",
    );

    return combineEpics(updateEventGameEpic, loadEventByIdEpic(eventId));
  },
);

const createEventGameEpic: TAppEpic = (action$, _, { httpApi }) =>
  action$.pipe(
    fromActionCreator(eventsSlice.actions.createSingleEventGame),
    switchMap(({ payload }) =>
      httpRequestEpicFactory({
        input: httpApi.createEventGame(payload),
        requestSymbol: CREATE_EVENT_GAME_REQUEST_SYMBOL,
      }),
    ),
  );

const createEventGameRouterEpic = routerEpic(
  WEBAPP_ROUTES.createSingleEventGameRoute,
  (match) => {
    const eventId = getNotNil(
      match.params.eventId,
      "createEventGameRouterEpic -> eventId",
    );

    return combineEpics(createEventGameEpic, loadEventByIdEpic(eventId));
  },
);

const singleEventGameRootEpic = combineEpics(
  updateEventGameRouterEpic,
  createEventGameRouterEpic,
);

export { singleEventGameRootEpic, deleteSingleEventGameEpicFactory };
