import { TAppEpic } from "../../App/Epics/TAppEpic";
import { fromActionCreator } from "../../Utils/FromActionCreator";
import { EMPTY, merge, of, switchMap } from "rxjs";
import { httpRequestEpicFactory } from "../../Utils/HttpRequestEpicFactory";
import { message } from "antd";
import { TEXT } from "@way-to-bot/shared/constants/text";
import { participateRequestSlice } from "../ParticipateRequestSlice";
import {
  GET_ALL_PARTICIPATE_REQUESTS_REQUEST_SYMBOL,
  PARTICIPATE_REQUEST_DELETE_REQUEST_SYMBOL,
  PARTICIPATE_REQUEST_UPDATE_REQUEST_SYMBOL,
} from "../ParticipateRequestVariables";
import { routerEpic } from "../../Utils/RouterEpic";
import { WEBAPP_ROUTES } from "@way-to-bot/shared/constants/webappRoutes";
import { combineEpics } from "redux-observable";
import { loadLeaguesEpic } from "../../Leagues/LoadLeaguesEpic";
import { drawerSlice, EDrawerType } from "../../Drawer/DrawerSlice";

const loadAllParticipateRequestsEpic: TAppEpic = (
  action$,
  state$,
  dependencies,
) =>
  httpRequestEpicFactory({
    input: dependencies.httpApi.getAllParticipateRequests(),
    requestSymbol: GET_ALL_PARTICIPATE_REQUESTS_REQUEST_SYMBOL,
    receivedActionCreator: participateRequestSlice.actions.allRequestsReceived,
  });

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const deleteParticipateRequestEpic: TAppEpic = (
  action$,
  state$,
  dependencies,
) =>
  action$.pipe(
    fromActionCreator(participateRequestSlice.actions.deleteParticipateRequest),
    switchMap(({ payload }) =>
      httpRequestEpicFactory({
        input: dependencies.httpApi.deleteParticipateRequest(payload),
        requestSymbol: PARTICIPATE_REQUEST_DELETE_REQUEST_SYMBOL,
        onSuccess: () => {
          message.success(TEXT.success);

          return EMPTY;
        },
        onError: () => {
          message.error(TEXT.error);

          return EMPTY;
        },
      }),
    ),
  );

const updateParticipateRequestEpic: TAppEpic = (
  action$,
  state$,
  dependencies,
) =>
  action$.pipe(
    fromActionCreator(participateRequestSlice.actions.updateParticipateRequest),
    switchMap(({ payload }) =>
      httpRequestEpicFactory({
        input: dependencies.httpApi.updateParticipateRequest(payload),
        requestSymbol: PARTICIPATE_REQUEST_UPDATE_REQUEST_SYMBOL,
        onSuccess: () => {
          return merge(
            of(
              drawerSlice.actions.closeDrawer({
                drawerType: EDrawerType.APPROVE_PARTICIPATE_REQUEST_DRAWER,
              }),
            ),
            loadAllParticipateRequestsEpic(action$, state$, dependencies),
          );
        },
        onError: () => {
          message.error(TEXT.error);

          return EMPTY;
        },
      }),
    ),
  );

const participateRequestsRouterEpic = routerEpic(
  WEBAPP_ROUTES.manageParticipateRequestsRoute,
  () =>
    combineEpics(
      loadAllParticipateRequestsEpic,
      loadLeaguesEpic,
      updateParticipateRequestEpic,
    ),
);

export { participateRequestsRouterEpic };
