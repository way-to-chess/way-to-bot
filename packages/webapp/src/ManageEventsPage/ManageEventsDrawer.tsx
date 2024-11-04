import {
  Button,
  DatePicker,
  Drawer,
  Form,
  FormProps,
  Input,
  Select,
  Upload,
} from "antd";
import { EEventStatus } from "@way-to-bot/shared/enums";
import { TEXT } from "@way-to-bot/shared/constants/text";
import { ERequestStatus } from "../Store/RequestManager/RequestManagerModels";
import { IEventCreatePayload } from "@way-to-bot/shared/interfaces/event.interface";
import { useDispatch, useSelector } from "react-redux";
import { useActionCreator } from "../Hooks/UseActionCreator";
import { useParamSelector } from "../Hooks/UseParamSelector";
import { requestManagerSlice } from "../Store/RequestManager/RequestManagerSlice";
import { eventsSlice } from "../Store/Events/EventsSlice";
import { EVENTS_CREATE_REQUEST_SYMBOL } from "../Store/Events/EventsVariables";
import { locationsSlice } from "../Store/Locations/LocationsSlice";
import { LOCATIONS_GET_ALL_REQUEST_SYMBOL } from "../Store/Locations/LocationsVariables";
import { useFileUpload } from "../Hooks/UseFileUpload";
import { useCallback } from "react";
import { UploadOutlined } from "@ant-design/icons";

const EVENT_STATUS_SELECT_OPTIONS = Object.values(EEventStatus).map(
  (value) => ({
    label: value,
    value,
  }),
);

const ManageEventsDrawer = () => {
  const open = useSelector(eventsSlice.selectors.manageEventsDrawerVisible);
  const closeDrawer = useActionCreator(
    eventsSlice.actions.manageEventsDrawerVisibilityChanged,
    false,
  );

  const locations = useSelector(locationsSlice.selectors.locations);

  const status = useParamSelector(
    requestManagerSlice.selectors.statusBySymbol,
    LOCATIONS_GET_ALL_REQUEST_SYMBOL,
  );

  const dispatch = useDispatch();

  const requestStatus = useParamSelector(
    requestManagerSlice.selectors.statusBySymbol,
    EVENTS_CREATE_REQUEST_SYMBOL,
  );

  const onFinish: FormProps<IEventCreatePayload>["onFinish"] = (values) => {
    dispatch(
      eventsSlice.actions.createEvent({
        ...values,
        dateTime: values.dateTime.toString(),
      }),
    );
  };

  const [form] = Form.useForm<IEventCreatePayload>();

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
      <Form<IEventCreatePayload>
        form={form}
        layout={"vertical"}
        onFinish={onFinish}
        initialValues={{ status: EEventStatus.WAITING }}
      >
        <Form.Item
          name={"name"}
          label={TEXT.manageEvents.name}
          rules={[{ required: true, message: TEXT.common.requiredField }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name={"dateTime"}
          label={TEXT.manageEvents.dateTime}
          rules={[{ required: true, message: TEXT.common.requiredField }]}
        >
          <DatePicker style={{ width: "100%" }} placeholder={""} showTime />
        </Form.Item>

        <Form.Item
          name={"price"}
          label={TEXT.manageEvents.price}
          rules={[{ required: true, message: TEXT.common.requiredField }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name={"status"}
          label={TEXT.manageEvents.status}
          rules={[{ required: true, message: TEXT.common.requiredField }]}
        >
          <Select
            value={EEventStatus.WAITING}
            options={EVENT_STATUS_SELECT_OPTIONS}
            disabled
          />
        </Form.Item>

        <Form.Item
          name={"participantsLimit"}
          label={TEXT.manageEvents.participantsLimit}
        >
          <Input type={"number"} />
        </Form.Item>

        <Form.Item name={"linkToTable"} label={TEXT.manageEvents.linkToTable}>
          <Input />
        </Form.Item>

        <Form.Item
          name={"locationId"}
          label={TEXT.manageEvents.locationId}
          rules={[{ required: true, message: TEXT.common.requiredField }]}
        >
          <Select
            loading={status === ERequestStatus.loading}
            options={locations.map(({ id, title }) => ({
              value: id,
              label: title,
            }))}
          />
        </Form.Item>

        <Form.Item
          name={"fileId"}
          label={TEXT.manageEvents.fileId}
          rules={[{ required: true, message: TEXT.common.requiredField }]}
        >
          <Upload {...uploadProps}>
            <Button icon={<UploadOutlined />}>{TEXT.common.upload}</Button>
          </Upload>
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
};

export { ManageEventsDrawer };
