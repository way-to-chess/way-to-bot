import { TAppEpic } from "../../App/Epics/TAppEpic";
import { httpRequestEpicFactory } from "../../Utils/HttpRequestEpicFactory";
import { GET_USER_BY_USERNAME_REQUEST_SYMBOL } from "../../User/UserVariables";
import { userSlice } from "../../User/UserSlice";
import { EMPTY } from "rxjs";
import { isDev } from "../../../Utils/OneLineUtils";

const getUserByUsernameEpic: TAppEpic = (action$, state$, dependencies) => {
  let username = Telegram.WebApp.initDataUnsafe.user?.username;

  if (isDev) {
    username = "privetenn";
  }

  if (!username) {
    return EMPTY;
  }

  return httpRequestEpicFactory({
    input: dependencies.httpApi.getUserByUsername(username),
    requestSymbol: GET_USER_BY_USERNAME_REQUEST_SYMBOL,
    receivedActionCreator: userSlice.actions.userReceived,
  });
};

export { getUserByUsernameEpic };
