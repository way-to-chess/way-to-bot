import { memo } from "react";
import { useDrawer } from "../Hooks/UseDrawer";
import { EDrawerType } from "../Store/Drawer/DrawerSlice";
import { Button, Drawer, Form } from "antd";
import { LeaguesSelect } from "../ManageLeaguesPage/LeaguesSelect";
import { TEXT } from "@way-to-bot/shared/constants/text";
import { useDispatch } from "react-redux";
import { participateRequestSlice } from "../Store/ParticipateRequest/ParticipateRequestSlice";

const ApproveParticipateRequestDrawer = memo(() => {
  const { open, onClose, data } = useDrawer(
    EDrawerType.APPROVE_PARTICIPATE_REQUEST_DRAWER,
  );

  const dispatch = useDispatch();

  const onFinish = () => {
    dispatch(
      participateRequestSlice.actions.updateParticipateRequest({
        approved: true,
        id: data.requestId,
      }),
    );
  };

  return (
    <Drawer
      getContainer={false}
      placement={"right"}
      closable
      open={open}
      onClose={onClose}
    >
      <Form layout={"vertical"} onFinish={onFinish}>
        <Form.Item name={"league"} label={TEXT.league}>
          <LeaguesSelect />
        </Form.Item>
        <Form.Item>
          <Button
            type={"primary"}
            htmlType={"submit"}
            style={{ float: "right" }}
          >
            {TEXT.approve}
          </Button>
        </Form.Item>
      </Form>
    </Drawer>
  );
});

export { ApproveParticipateRequestDrawer };
