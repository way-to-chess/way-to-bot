import type { TAppEpic } from "../App/Epics/TAppEpic";
import { concat, EMPTY, from, of, switchMap, take } from "rxjs";
import { userSlice } from "./UserSlice";
import { combineEpics, ofType } from "redux-observable";
import { WEBAPP_ROUTES } from "@way-to-bot/shared/constants/webappRoutes";
import { getNotNil } from "../../Utils/GetNotNil";
import { routerEpic } from "../Utils/RouterEpic";
import { isDev } from "../../Utils/OneLineUtils";
import { PathMatch } from "react-router-dom";
import { fromActionCreator } from "../../Store/Utils/FromActionCreator";
import { httpRequestEpicFactory } from "../../Store/Utils/HttpRequestEpicFactory";
import { USER_CREATE_REQUEST_SYMBOL } from "../../Store/User/UserVariables";
import { message } from "antd";
import { TEXT } from "@way-to-bot/shared/constants/text";

const userInitLoadEpic: TAppEpic = (_, state$, { httpApi }) =>
  state$.pipe(
    take(1),
    switchMap(() => {
      const username = isDev
        ? (Telegram.WebApp.initDataUnsafe.user?.username ?? "user_1")
        : Telegram.WebApp.initDataUnsafe.user?.username;

      if (!username) {
        return EMPTY;
      }

      return concat(
        of(userSlice.actions.started()),
        from(httpApi.getOrCreateUserByUsername(username)).pipe(
          switchMap((data) => of(userSlice.actions.received(data))),
        ),
      );
    }),
  );

const userLoadProfilePageByIdEpic =
  (match: PathMatch): TAppEpic =>
  (_, __, { httpApi }) => {
    const id = getNotNil(match.params.id, "userRouterEpic");

    return concat(
      of(userSlice.actions.profilePageStarted()),
      from(httpApi.getUserById(Number(id))).pipe(
        switchMap((data) => of(userSlice.actions.profilePageReceived(data))),
      ),
    );
  };

const userRouterEpic = routerEpic(WEBAPP_ROUTES.profileRoute, (match) =>
  combineEpics(userLoadProfilePageByIdEpic(match)),
);

const userUpdateProfileEpic: TAppEpic = (action$, __, { httpApi }) =>
  action$.pipe(
    ofType(userSlice.actions.update.type),
    switchMap((payload) =>
      from(httpApi.updateUser(payload)).pipe(
        switchMap((value) => of(userSlice.actions.updateResult(value))),
      ),
    ),
  );

const updateProfileRouterEpic = routerEpic(
  WEBAPP_ROUTES.updateProfileRoute,
  (match) =>
    combineEpics(userLoadProfilePageByIdEpic(match), userUpdateProfileEpic),
);

const createUserEpic: TAppEpic = (action$, _, { httpApi }) =>
  action$.pipe(
    fromActionCreator(userSlice.actions.createUser),
    switchMap(({ payload }) =>
      httpRequestEpicFactory({
        input: httpApi.createUser(payload),
        requestSymbol: USER_CREATE_REQUEST_SYMBOL,
        onSuccess: () => {
          message.success(TEXT.api.success);

          return of(
            userSlice.actions.manageUsersDrawerVisibilityChanged(false),
          );
        },
        onError: () => {
          message.error(TEXT.api.error);

          return EMPTY;
        },
      }),
    ),
  );

const userRootEpic = combineEpics(
  userInitLoadEpic,
  userRouterEpic,
  updateProfileRouterEpic,
  createUserEpic,
);

export { userRootEpic };
