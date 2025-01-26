import { TAppEpic } from "../../App/Epics/TAppEpic";
import { fromActionCreator } from "../../Utils/FromActionCreator";
import { participateRequestSlice } from "../ParticipateRequestSlice";
import { EMPTY, merge, of, switchMap } from "rxjs";
import { httpRequestEpicFactory } from "../../Utils/HttpRequestEpicFactory";
import { PARTICIPATE_REQUEST_CREATE_REQUEST_SYMBOL } from "../ParticipateRequestVariables";
import { message } from "antd";
import { TEXT } from "@way-to-bot/shared/constants/text";
import { drawerSlice, EDrawerType } from "../../Drawer/DrawerSlice";
import { loadEventByIdEpic } from "../../Events/LoadEventByIdEpic";

const createParticipateRequestEpic: TAppEpic = (
  action$,
  state$,
  dependencies,
) =>
  action$.pipe(
    fromActionCreator(participateRequestSlice.actions.createParticipateRequest),
    switchMap(({ payload }) =>
      httpRequestEpicFactory({
        input: dependencies.httpApi.createParticipateRequest(payload),
        requestSymbol: PARTICIPATE_REQUEST_CREATE_REQUEST_SYMBOL,
        onSuccess: () => {
          message.success(TEXT.api.success);

          return merge(
            of(
              drawerSlice.actions.closeDrawer({
                drawerType: EDrawerType.CONFIRM_PARTICIPATE_REQUEST,
              }),
            ),
            loadEventByIdEpic(payload.eventId.toString())(
              action$,
              state$,
              dependencies,
            ),
          );
        },
        onError: () => {
          message.error(TEXT.api.error);

          return EMPTY;
        },
      }),
    ),
  );

export { createParticipateRequestEpic };
