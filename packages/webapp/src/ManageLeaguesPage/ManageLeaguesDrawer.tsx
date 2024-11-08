import { Button, Drawer, Form, Input } from "antd";
import { useParamSelector } from "../Hooks/UseParamSelector";
import { drawerSlice, EDrawerType } from "../Store/Drawer/DrawerSlice";
import { useActionCreator } from "../Hooks/UseActionCreator";
import { TEXT } from "@way-to-bot/shared/constants/text";

const ManageLeaguesDrawer = () => {
  const open = useParamSelector(
    drawerSlice.selectors.drawerOpen,
    EDrawerType.MANAGE_LEAGUES_DRAWER,
  );

  const onClose = useActionCreator(drawerSlice.actions.closeDrawer, {
    drawerType: EDrawerType.MANAGE_LEAGUES_DRAWER,
  });

  const onFinish = () => {};

  return (
    <Drawer
      open={open}
      onClose={onClose}
      placement={"right"}
      closable
      getContainer={false}
    >
      <Form layout={"vertical"} onFinish={onFinish}>
        <Form.Item name={"name"} label={TEXT.leagues.name}>
          <Input />
        </Form.Item>

        <Form.Item>
          <Button
            type={"primary"}
            htmlType={"submit"}
            style={{ float: "right" }}
          >
            {TEXT.common.create}
          </Button>
        </Form.Item>
      </Form>
    </Drawer>
  );
};

export { ManageLeaguesDrawer };
