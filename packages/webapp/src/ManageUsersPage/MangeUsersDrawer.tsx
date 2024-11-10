import { memo, useCallback } from "react";
import { Button, Drawer, Form, FormProps, Input, Select, Upload } from "antd";
import { useDispatch } from "react-redux";
import { userSlice } from "../Store/User/UserSlice";
import { TEXT } from "@way-to-bot/shared/constants/text";
import { IUserCreatePayload } from "@way-to-bot/shared/interfaces/user.interface";
import { EUserRole } from "@way-to-bot/shared/enums";
import { useParamSelector } from "../Hooks/UseParamSelector";
import { requestManagerSlice } from "../Store/RequestManager/RequestManagerSlice";
import {
  USER_CREATE_REQUEST_SYMBOL,
  USER_UPDATE_REQUEST_SYMBOL,
} from "../Store/User/UserVariables";
import { ERequestStatus } from "../Store/RequestManager/RequestManagerModels";
import { useFileUpload } from "../Hooks/UseFileUpload";
import { UploadOutlined } from "@ant-design/icons";
import { drawerSlice, EDrawerType } from "../Store/Drawer/DrawerSlice";
import { useDrawer } from "../Hooks/UseDrawer";

const USER_ROLES_SELECT_OPTIONS = Object.values(EUserRole).map((value) => ({
  label: value,
  value,
}));

const MangeUsersDrawer = memo(() => {
  const data = useParamSelector(
    drawerSlice.selectors.drawerData,
    EDrawerType.MANAGE_USERS_DRAWER,
  );

  const drawer = useDrawer(EDrawerType.MANAGE_USERS_DRAWER);

  const dispatch = useDispatch();

  const requestStatus = useParamSelector(
    requestManagerSlice.selectors.statusBySymbol,
    data ? USER_UPDATE_REQUEST_SYMBOL : USER_CREATE_REQUEST_SYMBOL,
  );

  const initialValues = data
    ? {
        username: data.username,
        roles: data.roles,
        firstName: data.firstName,
        lastName: data.lastName,
      }
    : {
        roles: [EUserRole.USER],
      };

  const [form] = Form.useForm<IUserCreatePayload>();

  const onFinish: FormProps<IUserCreatePayload>["onFinish"] = (values) => {
    dispatch(
      data
        ? userSlice.actions.updateUser({ ...initialValues, ...values })
        : userSlice.actions.createUser(values),
    );
  };

  const afterOpenChange = () => {
    form.resetFields();
  };

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
      getContainer={false}
      {...drawer}
      afterOpenChange={afterOpenChange}
    >
      <Form
        form={form}
        layout={"vertical"}
        onFinish={onFinish}
        initialValues={initialValues}
      >
        <Form.Item
          name={"username"}
          label={TEXT.users.username}
          rules={[{ required: true, message: TEXT.common.requiredField }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name={"firstName"}
          label={TEXT.users.firstName}
          rules={[{ required: true, message: TEXT.common.requiredField }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name={"lastName"}
          label={TEXT.users.lastName}
          rules={[{ required: true, message: TEXT.common.requiredField }]}
        >
          <Input />
        </Form.Item>

        <Form.Item name={"fileId"}>
          <Upload {...uploadProps}>
            <Button icon={<UploadOutlined />}>{TEXT.common.upload}</Button>
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
            {data ? TEXT.common.edit : TEXT.common.create}
          </Button>
        </Form.Item>
      </Form>
    </Drawer>
  );
});
MangeUsersDrawer.displayName = "CreateUserDrawer";

export { MangeUsersDrawer };
