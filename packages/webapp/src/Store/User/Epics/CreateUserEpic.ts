import type { TAppEpic } from "../../App/Epics/TAppEpic";
import { fromActionCreator } from "../../Utils/FromActionCreator";
import { userSlice } from "../UserSlice";
import { EMPTY, switchMap } from "rxjs";
import {
  httpRequestEpicFactory,
  IHttpRequestEpicFactoryProps,
} from "../../Utils/HttpRequestEpicFactory";
import { USER_CREATE_REQUEST_SYMBOL } from "../UserVariables";
import { message } from "antd";
import { TEXT } from "@way-to-bot/shared/constants/text";

const createUserEpic =
  ({
    onSuccess,
  }: Pick<IHttpRequestEpicFactoryProps<boolean>, "onSuccess">): TAppEpic =>
  (action$, state$, dependencies) =>
    action$.pipe(
      fromActionCreator(userSlice.actions.createUser),
      switchMap(({ payload }) =>
        httpRequestEpicFactory({
          input: dependencies.httpApi.createUser(payload),
          requestSymbol: USER_CREATE_REQUEST_SYMBOL,
          onSuccess,
          onError: () => {
            message.error(TEXT.error);

            return EMPTY;
          },
        }),
      ),
    );
export { createUserEpic };
