import { Button, Drawer, Form, Input } from "antd";
import { useDrawer } from "../Hooks/UseDrawer";
import { EDrawerType } from "../Store/Drawer/DrawerSlice";
import { UsersSelect } from "./UsersSelect";
import { TEXT } from "@way-to-bot/shared/constants/text";
import { IUserCreatePayload } from "@way-to-bot/shared/interfaces/user.interface";

const SendMessageForm = () => {
  const [form] = Form.useForm<IUserCreatePayload>();

  return (
    <Form layout={"vertical"} form={form}>
      <Form.Item name={"users"} label={TEXT.users.users}>
        <UsersSelect />
      </Form.Item>
      <Form.Item name={"message"} label={TEXT.users.message}>
        <Input.TextArea />
      </Form.Item>
      <Form.Item>
        <Button type={"primary"} htmlType={"submit"} style={{ float: "right" }}>
          {TEXT.common.send}
        </Button>
      </Form.Item>
    </Form>
  );
};

const SendMessageDrawer = () => {
  const { trigger: _, ...props } = useDrawer(EDrawerType.SEND_MESSAGE_DRAWER);

  return (
    <Drawer {...props} placement={"right"} closable getContainer={false}>
      <SendMessageForm />
    </Drawer>
  );
};

export { SendMessageDrawer };
