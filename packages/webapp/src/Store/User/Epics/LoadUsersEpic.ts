import type { TAppEpic } from "../../App/Epics/TAppEpic";
import { httpRequestEpicFactory } from "../../Utils/HttpRequestEpicFactory";
import { USERS_LOAD_REQUEST_SYMBOL } from "../UserVariables";
import { userSlice } from "../UserSlice";

const loadUsersEpic: TAppEpic = (action$, state$, dependencies) =>
  httpRequestEpicFactory({
    input: dependencies.httpApi.getAllUsers(),
    requestSymbol: USERS_LOAD_REQUEST_SYMBOL,
    receivedActionCreator: userSlice.actions.usersReceived,
  });

export { loadUsersEpic };
