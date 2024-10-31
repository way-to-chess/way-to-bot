import { Button, Flex, Form, Input, Result, Skeleton } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { locationsSelectors } from "../../../Store/Locations/LocationsSelector";
import { Link } from "react-router-dom";
import { locationsSlice } from "../../../Store/Locations/LocationsSlice";
import { ComponentType, createElement } from "react";
import { withProps } from "../../../Utils/WithProps";
import { ERequestStatus } from "../../../Store/RequestManager/RequestManagerModels";
import { UploadLocationPreview } from "../UploadLoctionPreview";
import { WEBAPP_ROUTES } from "@way-to-bot/shared/constants/webappRoutes";

//todo get type from server
type TLocationCreatePayload = any;

const GoToLocations = () => {
  const dispatch = useDispatch();

  const onClick = () => {
    dispatch(locationsSlice.actions.createClear());
  };

  return (
    <Link to={WEBAPP_ROUTES.locationsRoute} onClick={onClick}>
      <Button>{"Go to locations"}</Button>
    </Link>
  );
};

const CreateLocationForm = () => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const onFinish = (values: TLocationCreatePayload) => {
    console.log(values);
    dispatch(locationsSlice.actions.createLocation(values));
  };

  return (
    <Flex style={{ padding: 16 }} vertical>
      <Flex justify={"end"}>
        <Link to={WEBAPP_ROUTES.locationsRoute}>
          <Button>{"Back"}</Button>
        </Link>
      </Flex>
      <Form form={form} onFinish={onFinish}>
        <Form.Item
          required
          label={"Title"}
          name={"title"}
          rules={[{ required: true }]}
        >
          <Input />
        </Form.Item>

        <Form.Item label={"Address"} name={"address"}>
          <Input />
        </Form.Item>

        <Form.Item label={"Url"} name={"url"}>
          <Input />
        </Form.Item>

        <Form.Item label={"Preview"} name={"previewId"}>
          <UploadLocationPreview setFieldValue={form.setFieldValue} />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType={"submit"}>
            {"Submit"}
          </Button>
        </Form.Item>
      </Form>
    </Flex>
  );
};

const SLICE_STATUS_TO_COMPONENT_TYPE_MAP: Record<
  ERequestStatus,
  ComponentType
> = {
  [ERequestStatus.idle]: CreateLocationForm,
  [ERequestStatus.loading]: withProps(Skeleton)({ style: { padding: 16 } }),
  [ERequestStatus.error]: withProps(Result)({
    status: "error",
    title: "Update failed",
    extra: <GoToLocations />,
  }),
  [ERequestStatus.success]: withProps(Result)({
    status: "success",
    title: "Success",
    extra: <GoToLocations />,
  }),
};

const CreateLocationPage = () => {
  const status = useSelector(locationsSelectors.createStatus);

  return createElement(SLICE_STATUS_TO_COMPONENT_TYPE_MAP[status]);
};

export { CreateLocationPage };
