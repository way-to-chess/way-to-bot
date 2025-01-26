import { TAppEpic } from "../../App/Epics/TAppEpic";
import { fromActionCreator } from "../../Utils/FromActionCreator";
import { EMPTY, switchMap } from "rxjs";
import { httpRequestEpicFactory } from "../../Utils/HttpRequestEpicFactory";
import { message } from "antd";
import { TEXT } from "@way-to-bot/shared/constants/text";
import { participateRequestSlice } from "../ParticipateRequestSlice";
import {
  PARTICIPATE_REQUEST_DELETE_REQUEST_SYMBOL,
  PARTICIPATE_REQUEST_UPDATE_REQUEST_SYMBOL,
} from "../ParticipateRequestVariables";

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
          message.success(TEXT.api.success);

          return EMPTY;
        },
        onError: () => {
          message.error(TEXT.api.error);

          return EMPTY;
        },
      }),
    ),
  );
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
// eslint-disable-next-line @typescript-eslint/no-unused-vars
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
          message.success(TEXT.api.success);

          return EMPTY;
        },
        onError: () => {
          message.error(TEXT.api.error);

          return EMPTY;
        },
      }),
    ),
  );
