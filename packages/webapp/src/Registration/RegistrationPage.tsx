import {
  Avatar,
  Button,
  Card,
  Flex,
  Form,
  Input,
  Typography,
  Upload,
} from "antd";
import { LAYOUT_STYLE } from "../Variables";
import { IFileUploadResponse, useFileUpload } from "../Hooks/UseFileUpload";
import { useCallback, useState } from "react";
import { TEXT } from "@way-to-bot/shared/constants/text";
import { useDispatch } from "react-redux";
import { userSlice } from "../Store/User/UserSlice";
import { EUserRole } from "@way-to-bot/shared/enums";
import { getPreviewSrc } from "@way-to-bot/shared/utils/GetPreviewSrc";
import { UserOutlined } from "@ant-design/icons";
import { IUserCreatePayload } from "@way-to-bot/shared/interfaces/user.interface";

const RegistrationPage = () => {
  const [form] = Form.useForm();

  const [previewUrl, setPreviewUrl] = useState("");

  const uploadProps = useFileUpload({
    onRemove: useCallback(
      () => form.setFieldValue("fileId", undefined),
      [form],
    ),
    onDone: useCallback(
      ({ id, url }: IFileUploadResponse) => {
        form.setFieldValue("fileId", id);
        setPreviewUrl(url);
      },
      [form],
    ),
    onError: useCallback(() => {
      form.setFieldValue("fileId", undefined);
    }, [form]),
  });

  const dispatch = useDispatch();

  const onFinish = ({ firstName, lastName, fileId }: IUserCreatePayload) => {
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

  console.log(getPreviewSrc(previewUrl));

  return (
    <Flex vertical style={LAYOUT_STYLE} gap={16}>
      <Typography.Text>{TEXT.registrationInto}</Typography.Text>
      <Form layout={"vertical"} size={"large"} form={form} onFinish={onFinish}>
        <Form.Item name={"fileId"}>
          <Card>
            <Card.Meta
              avatar={
                <Avatar
                  src={getPreviewSrc(previewUrl)}
                  size={"large"}
                  icon={<UserOutlined />}
                />
              }
              description={
                <Flex gap={16} align={"center"} justify={"space-between"}>
                  <Typography.Text>{TEXT.uploadFileEmpty}</Typography.Text>
                  <Upload {...uploadProps} showUploadList={false}>
                    <Button type={"text"} style={{ padding: 0 }}>
                      {TEXT.upload}
                    </Button>
                  </Upload>
                </Flex>
              }
            />
          </Card>
        </Form.Item>

        <Form.Item name={"firstName"}>
          <Input size={"large"} placeholder={"Имя"} />
        </Form.Item>
        <Form.Item name={"lastName"}>
          <Input placeholder={"Фамилия"} size={"large"} />
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
