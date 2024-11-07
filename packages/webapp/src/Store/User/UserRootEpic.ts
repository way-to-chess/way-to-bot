import type { TAppEpic } from "../App/Epics/TAppEpic";
import { EMPTY, merge, of, switchMap } from "rxjs";
import { userSlice } from "./UserSlice";
import { combineEpics } from "redux-observable";
import { WEBAPP_ROUTES } from "@way-to-bot/shared/constants/webappRoutes";
import { routerEpic } from "../Utils/RouterEpic";
import { fromActionCreator } from "../../Store/Utils/FromActionCreator";
import { httpRequestEpicFactory } from "../../Store/Utils/HttpRequestEpicFactory";
import {
  USER_CREATE_REQUEST_SYMBOL,
  USER_DELETE_REQUEST_SYMBOL,
  USER_UPDATE_REQUEST_SYMBOL,
  USERS_LOAD_REQUEST_SYMBOL,
} from "../../Store/User/UserVariables";
import { message } from "antd";
import { TEXT } from "@way-to-bot/shared/constants/text";

const loadUsersEpic: TAppEpic = (action$, state$, dependencies) =>
  httpRequestEpicFactory({
    input: dependencies.httpApi.getAllUsers(),
    requestSymbol: USERS_LOAD_REQUEST_SYMBOL,
    receivedActionCreator: userSlice.actions.usersReceived,
    onError: () => {
      message.error(TEXT.api.error);

      return EMPTY;
    },
  });

const updateUserEpic: TAppEpic = (action$, state$, dependencies) =>
  action$.pipe(
    fromActionCreator(userSlice.actions.updateUser),
    switchMap(({ payload }) =>
      httpRequestEpicFactory({
        input: dependencies.httpApi.updateUser(payload),
        requestSymbol: USER_UPDATE_REQUEST_SYMBOL,
        onSuccess: () => {
          message.success(TEXT.api.success);

          return merge(
            loadUsersEpic(action$, state$, dependencies),
            of(userSlice.actions.manageUsersDrawerVisibilityChanged(false)),
          );
        },
        onError: () => {
          message.error(TEXT.api.error);

          return EMPTY;
        },
      }),
    ),
  );

const createUserEpic: TAppEpic = (action$, state$, dependencies) =>
  action$.pipe(
    fromActionCreator(userSlice.actions.createUser),
    switchMap(({ payload }) =>
      httpRequestEpicFactory({
        input: dependencies.httpApi.createUser(payload),
        requestSymbol: USER_CREATE_REQUEST_SYMBOL,
        onSuccess: () => {
          message.success(TEXT.api.success);

          return merge(
            loadUsersEpic(action$, state$, dependencies),
            of(userSlice.actions.manageUsersDrawerVisibilityChanged(false)),
          );
        },
        onError: () => {
          message.error(TEXT.api.error);

          return EMPTY;
        },
      }),
    ),
  );

const deleteUserEpic: TAppEpic = (action$, state$, dependencies) =>
  action$.pipe(
    fromActionCreator(userSlice.actions.deleteUser),
    switchMap(({ payload }) =>
      httpRequestEpicFactory({
        input: dependencies.httpApi.deleteUser(payload),
        requestSymbol: USER_DELETE_REQUEST_SYMBOL,
        onSuccess: () => {
          message.success(TEXT.api.success);

          return loadUsersEpic(action$, state$, dependencies);
        },
        onError: () => {
          message.error(TEXT.api.error);

          return EMPTY;
        },
      }),
    ),
  );

const manageUsersRouterEpic = routerEpic(WEBAPP_ROUTES.manageUsersRoute, () =>
  combineEpics(loadUsersEpic, createUserEpic, deleteUserEpic, updateUserEpic),
);

export { manageUsersRouterEpic as userRootEpic };
