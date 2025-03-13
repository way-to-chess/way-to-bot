import { TAppEpic } from "../../App/Epics/TAppEpic";
import { httpRequestEpicFactory } from "../../Utils/HttpRequestEpicFactory";
import { GET_USER_BY_ID_REQUEST_SYMBOL } from "../UserVariables";
import { userSlice } from "../UserSlice";
import { EMPTY, of } from "rxjs";

const getUserByIdEpic =
  (userId: number): TAppEpic =>
  (action$, state$, dependencies) => {
    return httpRequestEpicFactory({
      input: dependencies.httpApi.getUserById(userId),
      requestSymbol: GET_USER_BY_ID_REQUEST_SYMBOL,
      receivedActionCreator: userSlice.actions.usersReceived,
      onError: () => {
        const myUserId = userSlice.selectors.userId(state$.value);

        return myUserId === userId ? of(userSlice.actions.clearUser()) : EMPTY;
      },
    });
  };

export { getUserByIdEpic };
