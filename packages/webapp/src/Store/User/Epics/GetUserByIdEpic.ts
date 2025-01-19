import { TAppEpic } from "../../App/Epics/TAppEpic";
import { httpRequestEpicFactory } from "../../Utils/HttpRequestEpicFactory";
import { GET_USER_BY_ID_REQUEST_SYMBOL } from "../UserVariables";
import { userSlice } from "../UserSlice";

const getUserByIdEpic =
  (userId: number): TAppEpic =>
  (action$, state$, dependencies) => {
    return httpRequestEpicFactory({
      input: dependencies.httpApi.getUserById(userId),
      requestSymbol: GET_USER_BY_ID_REQUEST_SYMBOL,
      receivedActionCreator: userSlice.actions.usersReceived,
    });
  };

export { getUserByIdEpic };
