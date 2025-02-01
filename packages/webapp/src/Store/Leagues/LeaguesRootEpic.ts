import { routerEpic } from "../Utils/RouterEpic";
import { WEBAPP_ROUTES } from "@way-to-bot/shared/constants/webappRoutes";
import { combineEpics } from "redux-observable";
import { TAppEpic } from "../App/Epics/TAppEpic";
import { httpRequestEpicFactory } from "../Utils/HttpRequestEpicFactory";
import {
  LEAGUES_CREATE_REQUEST_SYMBOL,
  LEAGUES_DELETE_REQUEST_SYMBOL,
  LEAGUES_UPDATE_REQUEST_SYMBOL,
} from "../Leagues/LeaguesVariables";
import { leaguesSlice } from "../Leagues/LeaguesSlice";
import { fromActionCreator } from "../Utils/FromActionCreator";
import { EMPTY, merge, of, switchMap } from "rxjs";
import { message } from "antd";
import { TEXT } from "@way-to-bot/shared/constants/text";
import { drawerSlice, EDrawerType } from "../Drawer/DrawerSlice";
import { loadLeaguesEpic } from "../Leagues/LoadLeaguesEpic";

const createLeague: TAppEpic = (action$, state$, dependencies) =>
  action$.pipe(
    fromActionCreator(leaguesSlice.actions.createLeague),
    switchMap(({ payload }) => {
      return httpRequestEpicFactory({
        input: dependencies.httpApi.createLeague(payload),
        requestSymbol: LEAGUES_CREATE_REQUEST_SYMBOL,
        onSuccess: () => {
          message.success(TEXT.success);

          return merge(
            of(
              drawerSlice.actions.closeDrawer({
                drawerType: EDrawerType.MANAGE_LEAGUES_DRAWER,
              }),
            ),
            loadLeaguesEpic(action$, state$, dependencies),
          );
        },
        onError: () => {
          message.error(TEXT.error);

          return EMPTY;
        },
      });
    }),
  );

const updateLeague: TAppEpic = (action$, state$, dependencies) =>
  action$.pipe(
    fromActionCreator(leaguesSlice.actions.updateLeague),
    switchMap(({ payload }) => {
      return httpRequestEpicFactory({
        input: dependencies.httpApi.updateLeague(payload),
        requestSymbol: LEAGUES_UPDATE_REQUEST_SYMBOL,
        onSuccess: () => {
          message.success(TEXT.success);
          return EMPTY;
        },
        onError: () => {
          message.error(TEXT.error);

          return EMPTY;
        },
      });
    }),
  );

const deleteLeague: TAppEpic = (action$, state$, dependencies) =>
  action$.pipe(
    fromActionCreator(leaguesSlice.actions.deleteLeague),
    switchMap(({ payload }) => {
      return httpRequestEpicFactory({
        input: dependencies.httpApi.deleteLeague(payload),
        requestSymbol: LEAGUES_DELETE_REQUEST_SYMBOL,
        onSuccess: () => {
          return loadLeaguesEpic(action$, state$, dependencies);
        },
        onError: () => {
          message.error(TEXT.error);

          return EMPTY;
        },
      });
    }),
  );

const leaguesRouterEpic = routerEpic(WEBAPP_ROUTES.manageLeaguesRoute, () =>
  combineEpics(loadLeaguesEpic, createLeague, updateLeague, deleteLeague),
);

export { leaguesRouterEpic as leaguesRootEpic };
