import { Button, Drawer, Flex, Form, Input, Radio, Table } from "antd";
import { PlusIcon } from "lucide-react";
import { useState } from "react";
import { UserTransfer } from "../Users/UserTransfer";
import { TGApi } from "../../Store/TG/TGApi";
import "react-quill-new/dist/quill.snow.css";

const requiredRule = { required: true, message: "Обязательное поле" };

const WEB_URL = "";

const UserIds = () => {
  const type = Form.useWatch("type");

  return type === "PICK" ? (
    <Form.Item
      name={"userIds"}
      rules={[requiredRule]}
      valuePropName={"targetKeys"}
    >
      <UserTransfer />
    </Form.Item>
  ) : null;
};

const options = {
  parse_mode: "HTML",
  reply_markup: {
    inline_keyboard: [[]],
  },
};

const CreateForm = () => {
  const [sendCustomMessage, { isLoading }] =
    TGApi.useSendCustomMessageMutation();

  const onFinish = (values: { message: string; userIds: number[] }) => {
    sendCustomMessage({
      message: values.message,
      userIds: values.userIds ?? [],
      options,
    });
  };

  return (
    <Form
      layout={"vertical"}
      requiredMark={"optional"}
      onFinish={onFinish}
      disabled={isLoading}
    >
      <Form.Item name={"type"} rules={[requiredRule]} initialValue={"ALL"}>
        <Radio.Group
          options={[
            { value: "ALL", label: "Для всех" },
            { value: "PICK", label: "Выбрать из списка" },
          ]}
        />
      </Form.Item>

      <UserIds />

      <Form.Item name={"message"} label={"Сообщение"} rules={[requiredRule]}>
        <Input.TextArea rows={4} />
      </Form.Item>

      <Form.Item style={{ float: "right" }}>
        <Button htmlType={"submit"} type={"primary"} loading={isLoading}>
          {"Отправить"}
        </Button>
      </Form.Item>
    </Form>
  );
};

const MessagesTable = () => {
  const [open, setOpen] = useState(false);

  const showDrawer = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };

  return (
    <>
      <Drawer
        title={"Отправить сообщение"}
        open={open}
        onClose={onClose}
        width={720}
      >
        <CreateForm />
      </Drawer>

      <Flex vertical gap={8}>
        <Button
          style={{ width: "fit-content", alignSelf: "end" }}
          type={"primary"}
          onClick={showDrawer}
          icon={<PlusIcon size={14} />}
        >
          {"Отправить"}
        </Button>
        <Table style={{ width: "100%" }} dataSource={[]} />
      </Flex>
    </>
  );
};

export { MessagesTable };
