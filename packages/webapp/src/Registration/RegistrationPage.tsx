import { Button, Flex, Form, Input, Typography, Upload } from "antd";
import { LAYOUT_STYLE } from "../Variables";
import { IFileUploadResponse, useFileUpload } from "../Hooks/UseFileUpload";
import { useState } from "react";
import { TEXT } from "@way-to-bot/shared/constants/text";
import { useDispatch } from "react-redux";
import { userSlice } from "../Store/User/UserSlice";
import { EUserRole } from "@way-to-bot/shared/enums";
import { IUserCreatePayload } from "@way-to-bot/shared/interfaces/user.interface";

const RegistrationPage = () => {
  const [form] = Form.useForm();

  const [fileId, setFileId] = useState(0);

  const disabled = fileId === 0;

  const uploadProps = useFileUpload({
    onRemove: () => {
      setFileId(0);
    },
    onDone: ({ id }: IFileUploadResponse) => {
      setFileId(id);
    },
    onError: () => {
      setFileId(0);
    },
  });

  const dispatch = useDispatch();

  const onFinish = ({ firstName, lastName }: IUserCreatePayload) => {
    dispatch(
      userSlice.actions.createUser({
        fileId,
        firstName,
        lastName,
        roles: [EUserRole.USER],
        tgId: Telegram.WebApp?.initDataUnsafe.user?.id,
        username: Telegram.WebApp?.initDataUnsafe.user?.username,
      }),
    );
  };

  return (
    <Flex vertical style={LAYOUT_STYLE} gap={16}>
      <Typography.Text>{TEXT.registrationInto}</Typography.Text>
      <Form layout={"vertical"} size={"large"} form={form} onFinish={onFinish}>
        <Form.Item name={"fileId"}>
          <Upload {...uploadProps} listType={"picture"}>
            {disabled ? (
              <Button type={"dashed"}>{TEXT.uploadPhoto}</Button>
            ) : null}
          </Upload>
        </Form.Item>

        <Form.Item name={"firstName"}>
          <Input size={"large"} placeholder={TEXT.firstName} />
        </Form.Item>
        <Form.Item name={"lastName"}>
          <Input placeholder={TEXT.lastName} size={"large"} />
        </Form.Item>

        <Form.Item>
          <Button
            type={"primary"}
            htmlType={"submit"}
            style={{ float: "right" }}
          >
            {TEXT.create}
          </Button>
        </Form.Item>
      </Form>
    </Flex>
  );
};

export { RegistrationPage };
