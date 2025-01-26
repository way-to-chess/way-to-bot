import { combineEpics } from "redux-observable";
import { routerEpic } from "../Utils/RouterEpic";
import { httpRequestEpicFactory } from "../Utils/HttpRequestEpicFactory";
import { TAppEpic } from "../App/Epics/TAppEpic";
import {
  ADD_USERS_TO_EVENT_REQUEST_SYMBOL,
  EVENTS_CREATE_REQUEST_SYMBOL,
  EVENTS_DELETE_REQUEST_SYMBOL,
  EVENTS_GET_ALL_REQUEST_SYMBOL,
  EVENTS_UPDATE_REQUEST_SYMBOL,
  REMOVE_USERS_FROM_EVENT_REQUEST_SYMBOL,
} from "./EventsVariables";
import { eventsSlice } from "./EventsSlice";
import { locationsLoadEpic } from "../Locations/Epics/LocationsLoadEpic";
import { EMPTY, merge, of, switchMap, tap } from "rxjs";
import { fromActionCreator } from "../Utils/FromActionCreator";
import { message } from "antd";
import { WEBAPP_ROUTES } from "@way-to-bot/shared/constants/webappRoutes";
import { TEXT } from "@way-to-bot/shared/constants/text";
import { loadLeaguesEpic } from "../Leagues/LoadLeaguesEpic";
import { loadEventByIdEpic } from "../Events/LoadEventByIdEpic";
import { getNotNil } from "@way-to-bot/shared/utils/getNotNil";
import { drawerSlice, EDrawerType } from "../Drawer/DrawerSlice";
import { loadUsersEpic } from "../User/Epics/LoadUsersEpic";
import { createParticipateRequestEpic } from "../ParticipateRequest/Epics/CreateParticipateRequestEpic";

const loadEventsEpic: TAppEpic = (_, __, { httpApi }) =>
  httpRequestEpicFactory({
    input: httpApi.getAllEvents(),
    requestSymbol: EVENTS_GET_ALL_REQUEST_SYMBOL,
    receivedActionCreator: eventsSlice.actions.eventsReceived,
  });

const createEventEpic: TAppEpic = (action$, state$, dependencies) =>
  action$.pipe(
    fromActionCreator(eventsSlice.actions.createEvent),
    tap((action) => {
      Telegram.WebApp.sendData(JSON.stringify(action.payload));
    }),
    switchMap((action) => {
      return httpRequestEpicFactory({
        input: dependencies.httpApi.createEvent(action.payload),
        requestSymbol: EVENTS_CREATE_REQUEST_SYMBOL,
        onSuccess: () => {
          message.success(TEXT.api.success);

          return merge(
            of(
              drawerSlice.actions.closeDrawer({
                drawerType: EDrawerType.MANAGE_EVENTS_DRAWER,
              }),
            ),
            loadEventsEpic(action$, state$, dependencies),
          );
        },
        onError: () => {
          message.error(TEXT.api.error);

          return EMPTY;
        },
      });
    }),
  );

const updateEventEpic: TAppEpic = (action$, state$, dependencies) =>
  action$.pipe(
    fromActionCreator(eventsSlice.actions.updateEvent),
    switchMap((action) =>
      httpRequestEpicFactory({
        input: dependencies.httpApi.updateEvent(action.payload),
        requestSymbol: EVENTS_UPDATE_REQUEST_SYMBOL,
        onSuccess: () => {
          message.open({
            type: "success",
            content: "Updated",
          });
          return loadEventsEpic(action$, state$, dependencies);
        },
      }),
    ),
  );

const deleteEventEpic: TAppEpic = (action$, state$, dependencies) =>
  action$.pipe(
    fromActionCreator(eventsSlice.actions.deleteEvent),
    switchMap((action) =>
      httpRequestEpicFactory({
        input: dependencies.httpApi.deleteEvent(action.payload),
        requestSymbol: EVENTS_DELETE_REQUEST_SYMBOL,
        onSuccess: () => {
          message.open({
            type: "success",
            content: "Deleted",
          });
          return loadEventsEpic(action$, state$, dependencies);
        },
        onError: (error) => {
          message.open({
            type: "error",
            content: error,
          });
          return EMPTY;
        },
      }),
    ),
  );

const addUsersToEvent: TAppEpic = (action$, state$, dependencies) =>
  action$.pipe(
    fromActionCreator(eventsSlice.actions.addUsersToEvent),
    switchMap(({ payload }) =>
      httpRequestEpicFactory({
        input: dependencies.httpApi.addUsersToEvent(payload),
        requestSymbol: ADD_USERS_TO_EVENT_REQUEST_SYMBOL,
        onSuccess: () => {
          message.success(TEXT.api.success);

          return merge(
            of(
              drawerSlice.actions.closeDrawer({
                drawerType: EDrawerType.MANAGE_EVENT_USERS_DRAWER,
              }),
            ),
            loadEventByIdEpic(payload.eventId.toString())(
              action$,
              state$,
              dependencies,
            ),
          );
        },
        onError: () => {
          message.error(TEXT.api.error);

          return EMPTY;
        },
      }),
    ),
  );

const removeUsersFromEvent: TAppEpic = (action$, state$, dependencies) =>
  action$.pipe(
    fromActionCreator(eventsSlice.actions.removeUsersFromEvent),
    switchMap(({ payload }) =>
      httpRequestEpicFactory({
        input: dependencies.httpApi.removeUsersFromEvent(payload),
        requestSymbol: REMOVE_USERS_FROM_EVENT_REQUEST_SYMBOL,
        onSuccess: () => {
          message.success(TEXT.api.success);

          return loadEventByIdEpic(payload.eventId.toString())(
            action$,
            state$,
            dependencies,
          );
        },
        onError: () => {
          message.error(TEXT.api.error);

          return EMPTY;
        },
      }),
    ),
  );

const manageEventsRouterEpic = routerEpic(WEBAPP_ROUTES.manageEventsRoute, () =>
  combineEpics(
    loadEventsEpic,
    deleteEventEpic,
    locationsLoadEpic,
    createEventEpic,
    updateEventEpic,
  ),
);

const manageEventsIdRouterEpic = routerEpic(
  WEBAPP_ROUTES.manageEventsIdRoute,
  ({ params }) =>
    combineEpics(
      createParticipateRequestEpic,
      removeUsersFromEvent,
      addUsersToEvent,
      loadUsersEpic,
      loadLeaguesEpic,
      loadEventByIdEpic(
        getNotNil(
          params.eventId,
          `manageEventsIdRouterEpic -> ${params.eventId}`,
        ),
      ),
    ),
);

const eventsRootEpic = combineEpics(
  manageEventsRouterEpic,
  manageEventsIdRouterEpic,
);

export { eventsRootEpic };
