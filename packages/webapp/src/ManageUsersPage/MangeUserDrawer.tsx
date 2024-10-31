import { memo, useCallback } from "react";
import { Button, Drawer, Form, FormProps, Input, Select, Upload } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { userSlice } from "../Store/User/UserSlice";
import { useActionCreator } from "../Hooks/UseActionCreator";
import { TEXT } from "@way-to-bot/shared/constants/text";
import { IUserCreatePayload } from "@way-to-bot/shared/interfaces/user.interface";
import { EUserRole } from "@way-to-bot/shared/enums";
import { useParamSelector } from "../Hooks/UseParamSelector";
import { requestManagerSlice } from "../Store/RequestManager/RequestManagerSlice";
import { USER_CREATE_REQUEST_SYMBOL } from "../Store/User/UserVariables";
import { ERequestStatus } from "../Store/RequestManager/RequestManagerModels";
import { useFileUpload } from "../Hooks/UseFileUpload";
import { UploadOutlined } from "@ant-design/icons";

const USER_ROLES_SELECT_OPTIONS = Object.values(EUserRole).map((value) => ({
  label: value,
  value,
}));

const MangeUserDrawer = memo(() => {
  const open = useSelector(userSlice.selectors.manageUsersDrawerVisible);
  const closeDrawer = useActionCreator(
    userSlice.actions.manageUsersDrawerVisibilityChanged,
    false,
  );

  const dispatch = useDispatch();

  const requestStatus = useParamSelector(
    requestManagerSlice.selectors.statusBySymbol,
    USER_CREATE_REQUEST_SYMBOL,
  );

  const onFinish: FormProps<IUserCreatePayload>["onFinish"] = (values) => {
    dispatch(userSlice.actions.createUser(values));
  };

  const [form] = Form.useForm<IUserCreatePayload>();

  const uploadProps = useFileUpload({
    onRemove: useCallback(
      () => form.setFieldValue("fileId", undefined),
      [form],
    ),
    onDone: useCallback(
      (fileId: number) => form.setFieldValue("fileId", fileId),
      [form],
    ),
    onError: useCallback(() => {
      form.setFieldValue("fileId", undefined);
    }, [form]),
  });

  return (
    <Drawer
      placement={"right"}
      closable
      open={open}
      onClose={closeDrawer}
      getContainer={false}
    >
      <Form
        form={form}
        layout={"vertical"}
        onFinish={onFinish}
        initialValues={{ roles: [EUserRole.USER] }}
      >
        <Form.Item
          name={"username"}
          label={TEXT.createUserForm.username}
          rules={[{ required: true, message: TEXT.common.requiredField }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name={"firstName"}
          label={TEXT.createUserForm.firstName}
          rules={[{ required: true, message: TEXT.common.requiredField }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name={"lastName"}
          label={TEXT.createUserForm.lastName}
          rules={[{ required: true, message: TEXT.common.requiredField }]}
        >
          <Input />
        </Form.Item>

        <Form.Item name={"fileId"}>
          <Upload {...uploadProps}>
            <Button icon={<UploadOutlined />}>Upload</Button>
          </Upload>
        </Form.Item>
        <Form.Item
          name={"roles"}
          rules={[{ required: true, message: TEXT.common.requiredField }]}
        >
          <Select options={USER_ROLES_SELECT_OPTIONS} mode={"multiple"} />
        </Form.Item>
        <Form.Item>
          <Button
            loading={requestStatus === ERequestStatus.loading}
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
});
MangeUserDrawer.displayName = "CreateUserDrawer";

export { MangeUserDrawer };
