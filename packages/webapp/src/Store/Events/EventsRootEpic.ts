import { combineEpics } from "redux-observable";
import { routerEpic } from "../Utils/RouterEpic";
import { httpRequestEpicFactory } from "../Utils/HttpRequestEpicFactory";
import { TAppEpic } from "../App/Epics/TAppEpic";
import {
  CREATE_EVENT_GAME_REQUEST_SYMBOL,
  CREATE_EVENT_TEAM_REQUEST_SYMBOL,
  DELETE_EVENT_TEAM_REQUEST_SYMBOL,
  DELETE_TEAM_PARTICIPANT_REQUEST_SYMBOL,
  EVENTS_DELETE_REQUEST_SYMBOL,
  EVENTS_GET_ALL_REQUEST_SYMBOL,
  EVENTS_UPDATE_REQUEST_SYMBOL,
  UPDATE_EVENT_GAME_REQUEST_SYMBOL,
  UPDATE_EVENT_TEAM_REQUEST_SYMBOL,
} from "./EventsVariables";
import { eventsSlice } from "./EventsSlice";
import { locationsLoadEpic } from "../Locations/Epics/LocationsLoadEpic";
import { EMPTY, switchMap, tap } from "rxjs";
import { fromActionCreator } from "../Utils/FromActionCreator";
import { getNotNil } from "../../Utils/GetNotNil";
import { message } from "antd";
import { clearRequestSymbolsEpic } from "../Utils/ClearRequestSymbolsEpic";
import { loadEventByIdEpic } from "./LoadEventByIdEpic";
import {
  deleteSingleEventGameEpicFactory,
  singleEventGameRootEpic,
} from "./SingleEventGameRootEpic";
import { WEBAPP_ROUTES } from "@way-to-bot/shared/constants/webappRoutes";

const loadEventsEpic: TAppEpic = (_, __, { httpApi }) =>
  httpRequestEpicFactory({
    input: httpApi.getAllEvents(),
    requestSymbol: EVENTS_GET_ALL_REQUEST_SYMBOL,
    receivedActionCreator: eventsSlice.actions.received,
  });

const createEventEpic: TAppEpic = (action$) =>
  action$.pipe(
    fromActionCreator(eventsSlice.actions.create),
    tap((action) => {
      Telegram.WebApp.sendData(JSON.stringify(action.payload));
    }),
    switchMap(
      () => EMPTY,
      // httpRequestEpicFactory({
      //   input: httpApi.createEvent(action.payload),
      //   requestSymbol: EVENTS_CREATE_REQUEST_SYMBOL,
      // }),
    ),
  );

const updateEventEpicFactory =
  (eventId: string): TAppEpic =>
  (action$, state$, dependencies) =>
    action$.pipe(
      fromActionCreator(eventsSlice.actions.update),
      switchMap((action) =>
        httpRequestEpicFactory({
          input: dependencies.httpApi.updateEvent(action.payload),
          requestSymbol: EVENTS_UPDATE_REQUEST_SYMBOL,
          receivedActionCreator: eventsSlice.actions.updated,
          onSuccess: () => {
            message.open({
              type: "success",
              content: "Updated",
            });
            return loadEventByIdEpic(eventId)(action$, state$, dependencies);
          },
        }),
      ),
    );

const deleteEventEpic: TAppEpic = (action$, state$, dependencies) =>
  action$.pipe(
    fromActionCreator(eventsSlice.actions.delete),
    switchMap((action) =>
      httpRequestEpicFactory({
        input: dependencies.httpApi.deleteEvent(action.payload),
        requestSymbol: EVENTS_DELETE_REQUEST_SYMBOL,
        receivedActionCreator: eventsSlice.actions.deleted,
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

const updateEventRouterEpic = routerEpic(
  WEBAPP_ROUTES.updateEventRoute,
  (match) =>
    combineEpics(
      locationsLoadEpic,
      loadEventByIdEpic(
        getNotNil(match.params.eventId, "updateEventRouterEpic"),
      ),
      updateEventEpicFactory(
        getNotNil(match.params.eventId, "updateEventRouterEpic"),
      ),
    ),
);

const createEventRouterEpic = routerEpic(WEBAPP_ROUTES.createEventRoute, () =>
  combineEpics(locationsLoadEpic, createEventEpic),
);

const manageEventsRouterEpic = routerEpic(WEBAPP_ROUTES.manageEventsRoute, () =>
  combineEpics(loadEventsEpic, deleteEventEpic),
);

const deleteTeamParticipantEpic =
  (eventId: string): TAppEpic =>
  (action$, state$, dependencies) =>
    action$.pipe(
      fromActionCreator(eventsSlice.actions.deleteTeamParticipant),
      switchMap(({ payload }) => {
        return httpRequestEpicFactory({
          input: dependencies.httpApi.deleteTeamParticipant(payload),
          requestSymbol: DELETE_TEAM_PARTICIPANT_REQUEST_SYMBOL,
          onSuccess: () => {
            message.open({
              type: "success",
              content: "Deleted",
            });
            return loadEventByIdEpic(eventId)(action$, state$, dependencies);
          },
          onError: (error) => {
            message.open({
              type: "error",
              content: error,
            });
            return EMPTY;
          },
        });
      }),
    );

const deleteSingleEventTeamEpicFactory =
  (eventId: string): TAppEpic =>
  (action$, state$, dependencies) =>
    action$.pipe(
      fromActionCreator(eventsSlice.actions.deleteSingleEventTeam),
      switchMap(({ payload: { id } }) => {
        return httpRequestEpicFactory({
          input: dependencies.httpApi.deleteEventTeam({ id }),
          requestSymbol: DELETE_EVENT_TEAM_REQUEST_SYMBOL,
          onSuccess: () => {
            message.open({
              type: "success",
              content: "Deleted",
            });
            return loadEventByIdEpic(eventId)(action$, state$, dependencies);
          },
          onError: (error) => {
            message.open({
              type: "error",
              content: error,
            });
            return EMPTY;
          },
        });
      }),
    );

const manageSingleEventRouterEpic = routerEpic(
  WEBAPP_ROUTES.manageSingleEventRoute,
  (match) => {
    const notNilEventId = getNotNil(
      match.params.eventId,
      "manageSingleEventRouterEpic",
    );

    return combineEpics(
      loadEventByIdEpic(notNilEventId),
      deleteTeamParticipantEpic(notNilEventId),
      clearRequestSymbolsEpic(
        CREATE_EVENT_TEAM_REQUEST_SYMBOL,
        UPDATE_EVENT_TEAM_REQUEST_SYMBOL,
        CREATE_EVENT_GAME_REQUEST_SYMBOL,
        UPDATE_EVENT_GAME_REQUEST_SYMBOL,
      ),
      deleteSingleEventTeamEpicFactory(notNilEventId),
      deleteSingleEventGameEpicFactory(notNilEventId),
    );
  },
);

const updateSingleEventTeamEpicFactory: TAppEpic = (action$, _, { httpApi }) =>
  action$.pipe(
    fromActionCreator(eventsSlice.actions.updateSingleEventTeam),
    switchMap(({ payload }) => {
      return httpRequestEpicFactory({
        input: httpApi.updateEventTeam(payload),
        requestSymbol: UPDATE_EVENT_TEAM_REQUEST_SYMBOL,
      });
    }),
  );

const updateSingleEventTeamRouterEpic = routerEpic(
  WEBAPP_ROUTES.updateSingleEventTeamRoute,
  (match) => {
    const notNilEventId = getNotNil(
      match.params.eventId,
      "updateSingleEventTeamRouterEpic",
    );

    return combineEpics(
      loadEventByIdEpic(notNilEventId),
      updateSingleEventTeamEpicFactory,
    );
  },
);

const createEventTeamEpic: TAppEpic = (action$, _, { httpApi }) =>
  action$.pipe(
    fromActionCreator(eventsSlice.actions.createSingleEventTeam),
    switchMap(({ payload }) => {
      return httpRequestEpicFactory({
        input: httpApi.createEventTeam(payload),
        requestSymbol: CREATE_EVENT_TEAM_REQUEST_SYMBOL,
      });
    }),
  );

const createSingleEventTeamRouterEpic = routerEpic(
  WEBAPP_ROUTES.createSingleEventTeamRoute,
  (match) => {
    const notNilEventId = getNotNil(
      match.params.eventId,
      "createSingleEventTeamRouterEpic",
    );

    return combineEpics(loadEventByIdEpic(notNilEventId), createEventTeamEpic);
  },
);

const clientEventsRouterEpic = routerEpic(
  WEBAPP_ROUTES.eventsRoute,
  () => loadEventsEpic,
);

const eventsRootEpic = combineEpics(
  manageEventsRouterEpic,
  createEventRouterEpic,
  clientEventsRouterEpic,
  updateEventRouterEpic,
  manageSingleEventRouterEpic,
  updateSingleEventTeamRouterEpic,
  createSingleEventTeamRouterEpic,
  singleEventGameRootEpic,
);

export { eventsRootEpic };
