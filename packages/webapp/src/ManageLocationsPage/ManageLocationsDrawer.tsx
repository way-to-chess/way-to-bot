import { Button, Drawer, Form, FormProps, Input, Upload } from "antd";
import { TEXT } from "@way-to-bot/shared/constants/text";
import { ERequestStatus } from "../Store/RequestManager/RequestManagerModels";
import { useDispatch, useSelector } from "react-redux";
import { useActionCreator } from "../Hooks/UseActionCreator";
import { useParamSelector } from "../Hooks/UseParamSelector";
import { requestManagerSlice } from "../Store/RequestManager/RequestManagerSlice";
import { locationsSlice } from "../Store/Locations/LocationsSlice";
import { LOCATIONS_CREATE_REQUEST_SYMBOL } from "../Store/Locations/LocationsVariables";
import { ILocationCreatePayload } from "@way-to-bot/shared/interfaces/location.interface";
import { UploadOutlined } from "@ant-design/icons";
import { IFileUploadResponse, useFileUpload } from "../Hooks/UseFileUpload";
import { useCallback } from "react";

const ManageLocationsDrawer = () => {
  const open = useSelector(
    locationsSlice.selectors.manageLocationsDrawerVisible,
  );
  const closeDrawer = useActionCreator(
    locationsSlice.actions.manageLocationsDrawerVisibilityChanged,
    false,
  );

  const dispatch = useDispatch();

  const requestStatus = useParamSelector(
    requestManagerSlice.selectors.statusBySymbol,
    LOCATIONS_CREATE_REQUEST_SYMBOL,
  );

  const onFinish: FormProps<ILocationCreatePayload>["onFinish"] = (values) => {
    dispatch(locationsSlice.actions.createLocation(values));
  };

  const [form] = Form.useForm<ILocationCreatePayload>();

  const uploadProps = useFileUpload({
    onRemove: useCallback(
      () => form.setFieldValue("fileId", undefined),
      [form],
    ),
    onDone: useCallback(
      ({ id }: IFileUploadResponse) => form.setFieldValue("fileId", id),
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
      <Form<ILocationCreatePayload>
        form={form}
        layout={"vertical"}
        onFinish={onFinish}
      >
        <Form.Item
          name={"title"}
          label={TEXT.name}
          rules={[{ required: true, message: TEXT.requiredField }]}
        >
          <Input />
        </Form.Item>

        <Form.Item name={"url"} label={TEXT.url}>
          <Input />
        </Form.Item>

        <Form.Item name={"address"} label={TEXT.address}>
          <Input />
        </Form.Item>

        <Form.Item name={"fileId"} label={TEXT.formItemNameFileId}>
          <Upload {...uploadProps}>
            <Button icon={<UploadOutlined />}>{TEXT.upload}</Button>
          </Upload>
        </Form.Item>

        <Form.Item>
          <Button
            loading={requestStatus === ERequestStatus.loading}
            type={"primary"}
            htmlType={"submit"}
            style={{ float: "right" }}
          >
            {TEXT.create}
          </Button>
        </Form.Item>
      </Form>
    </Drawer>
  );
};

export { ManageLocationsDrawer };
