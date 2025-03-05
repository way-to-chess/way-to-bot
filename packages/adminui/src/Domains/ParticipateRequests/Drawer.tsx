import { memo } from "react";
import { useParamSelector } from "@way-to-bot/shared/utils/UseParamSelector";
import { entitySlice } from "../../EntitySlice";
import { Button, Drawer, Form, message } from "antd";
import { PARTICIPATE_REQUESTS_DRAWER_ID } from "../../Constants/EntityIds";
import { useActionCreator } from "@way-to-bot/shared/utils/UseActionCreator";
import { LeaguesSelect } from "../Leagues/LeaguesSelect";
import { TEXT } from "@way-to-bot/shared/constants/text";
import { api } from "@way-to-bot/shared/Api";
import { FORM_ITEM_REQUIRED_RULES } from "../../Constants/PersistedProps";
import {
  IWithId,
  IWithRequestId,
} from "@way-to-bot/shared/interfaces/with.interface";

// onQueryStarted: (_, { queryFulfilled, dispatch }) => {
//   queryFulfilled
//       .then(() => {
//         message.success(TEXT.success);
//
//         return dispatch(
//             api.endpoints.getAllParticipateRequests.initiate(),
//         ).refetch();
//       })
//       .then(() => {
//         dispatch(
//             entitySlice.actions.removeEntity(PARTICIPATE_REQUESTS_DRAWER_ID),
//         );
//       })
//       .catch((response) => {
//         message.error(JSON.stringify(response.error.data, null, 2));
//       });
// },

const ApproveForm = memo(() => {
  const [approve, { isLoading }] = api.useApproveParticipateRequestMutation();

  const [getAllParticipateRequests] =
    api.useLazyGetAllParticipateRequestsQuery();

  const closeDrawer = useActionCreator(
    entitySlice.actions.removeEntity,
    PARTICIPATE_REQUESTS_DRAWER_ID,
  );

  const entity = useParamSelector(
    entitySlice.selectors.selectById,
    PARTICIPATE_REQUESTS_DRAWER_ID,
  );

  const onFinish = async ({ leagueId }: { leagueId: number }) => {
    try {
      await approve({
        leagueId,
        id: (entity as IWithRequestId & IWithId).requestId,
      }).unwrap();

      await getAllParticipateRequests().unwrap();

      closeDrawer();
    } catch (e) {
      message.error(JSON.stringify(e.data.error, null, 2));
    }
  };

  return (
    <Form layout={"vertical"} onFinish={onFinish}>
      <Form.Item
        name={"leagueId"}
        label={TEXT.league}
        rules={FORM_ITEM_REQUIRED_RULES}
      >
        <LeaguesSelect />
      </Form.Item>
      <Form.Item>
        <Button
          type={"primary"}
          htmlType={"submit"}
          style={{ float: "right" }}
          loading={isLoading}
        >
          {TEXT.approve}
        </Button>
      </Form.Item>
    </Form>
  );
});

const ParticipateRequestsDrawer = memo(() => {
  const open = useParamSelector(
    entitySlice.selectors.selectExists,
    PARTICIPATE_REQUESTS_DRAWER_ID,
  );

  const onClose = useActionCreator(
    entitySlice.actions.removeEntity,
    PARTICIPATE_REQUESTS_DRAWER_ID,
  );

  return (
    <Drawer placement={"right"} closable open={open} onClose={onClose}>
      <ApproveForm />
    </Drawer>
  );
});

export { ParticipateRequestsDrawer };
