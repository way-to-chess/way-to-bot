import { httpRequestEpicFactory } from "../../Utils/HttpRequestEpicFactory";
import { TAppEpic } from "../../App/Epics/TAppEpic";
import { EMPTY, of } from "rxjs";
import { GET_USER_BY_TG_INFO_REQUEST_SYMBOL } from "../UserVariables";
import { userSlice } from "../UserSlice";
import { getNotNil } from "@way-to-bot/shared/utils/getNotNil";

const getUserByTgInfoEpic: TAppEpic = (action$, state$, dependencies) => {
  const user = Telegram.WebApp.initDataUnsafe.user;

  if (!user) {
    return EMPTY;
  }

  return httpRequestEpicFactory({
    input: dependencies.httpApi.getUserByTgInfo({
      tgId: getNotNil(
        user.id,
        `getUserByTgInfoEpic -> tgId | user: ${JSON.stringify(user)}`,
      ),
      username: user.username,
    }),
    requestSymbol: GET_USER_BY_TG_INFO_REQUEST_SYMBOL,
    receivedActionCreator: userSlice.actions.userReceived,
    onError: () => {
      return of(userSlice.actions.clearUser());
    },
  });
};

export { getUserByTgInfoEpic };
