import type { TAppEpic } from "../../App/Epics/TAppEpic";
import { EMPTY, merge, of, switchMap } from "rxjs";
import { userSlice } from "../UserSlice";
import { combineEpics } from "redux-observable";
import { WEBAPP_ROUTES } from "@way-to-bot/shared/constants/webappRoutes";
import { routerEpic } from "../../Utils/RouterEpic";
import { fromActionCreator } from "../../Utils/FromActionCreator";
import { httpRequestEpicFactory } from "../../Utils/HttpRequestEpicFactory";
import {
  USER_CREATE_REQUEST_SYMBOL,
  USER_DELETE_REQUEST_SYMBOL,
  USER_UPDATE_REQUEST_SYMBOL,
} from "../UserVariables";
import { message } from "antd";
import { TEXT } from "@way-to-bot/shared/constants/text";
import { getUserByIdEpic } from "./GetUserByIdEpic";
import { loadUsersEpic } from "./LoadUsersEpic";

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

const manageUsersIdRoute = routerEpic(
  WEBAPP_ROUTES.manageUsersIdRoute,
  (match) => {
    return getUserByIdEpic(Number(match.params.userId));
  },
);

const userRootEpic = combineEpics(manageUsersRouterEpic, manageUsersIdRoute);

export { userRootEpic };
