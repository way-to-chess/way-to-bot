import { memo } from "react";
import { useParamSelector } from "@way-to-bot/shared/utils/UseParamSelector";
import { entitySlice } from "../../EntitySlice";
import { Button, Drawer, Form } from "antd";
import { PARTICIPATE_REQUESTS_DRAWER_ID } from "../../Constants/EntityIds";
import { useActionCreator } from "@way-to-bot/shared/utils/UseActionCreator";
import { LeaguesSelect } from "../Leagues/LeaguesSelect";
import { TEXT } from "@way-to-bot/shared/constants/text";
import { api } from "../../Api";
import { FORM_ITEM_REQUIRED_RULES } from "../../Constants/PersistedProps";
import {
  IWithId,
  IWithRequestId,
} from "@way-to-bot/shared/interfaces/with.interface";

const ApproveForm = memo(() => {
  const [approve, { isLoading }] = api.useApproveParticipateRequestMutation();

  const entity = useParamSelector(
    entitySlice.selectors.selectById,
    PARTICIPATE_REQUESTS_DRAWER_ID,
  );

  const onFinish = ({ leagueId }: { leagueId: number }) => {
    approve({
      leagueId,
      id: (entity as IWithRequestId & IWithId).requestId,
    });
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
