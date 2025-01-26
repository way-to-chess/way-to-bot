import { Button, DatePicker, Drawer, Form, Input, Select, Upload } from "antd";
import { EEventStatus } from "@way-to-bot/shared/enums";
import { TEXT } from "@way-to-bot/shared/constants/text";
import { ERequestStatus } from "../Store/RequestManager/RequestManagerModels";
import { IEventCreatePayload } from "@way-to-bot/shared/interfaces/event.interface";
import { useDispatch, useSelector } from "react-redux";
import { useActionCreator } from "../Hooks/UseActionCreator";
import { useParamSelector } from "../Hooks/UseParamSelector";
import { requestManagerSlice } from "../Store/RequestManager/RequestManagerSlice";
import { eventsSlice } from "../Store/Events/EventsSlice";
import {
  EVENTS_CREATE_REQUEST_SYMBOL,
  EVENTS_UPDATE_REQUEST_SYMBOL,
} from "../Store/Events/EventsVariables";
import { locationsSlice } from "../Store/Locations/LocationsSlice";
import { LOCATIONS_GET_ALL_REQUEST_SYMBOL } from "../Store/Locations/LocationsVariables";
import { IFileUploadResponse, useFileUpload } from "../Hooks/UseFileUpload";
import { useCallback } from "react";
import { UploadOutlined } from "@ant-design/icons";
import { drawerSlice, EDrawerType } from "../Store/Drawer/DrawerSlice";
import dayjs from "dayjs";
import { EVENT_STATUS_TO_TEXT_MAP } from "./EVENT_STATUS_TO_TEXT_MAP";

const EVENT_STATUS_SELECT_OPTIONS = Object.values(EEventStatus).map(
  (value) => ({
    label: EVENT_STATUS_TO_TEXT_MAP[value],
    value,
  }),
);

const ManageEventsDrawer = () => {
  const data = useParamSelector(
    drawerSlice.selectors.drawerData,
    EDrawerType.MANAGE_EVENTS_DRAWER,
  );

  const open = useParamSelector(
    drawerSlice.selectors.drawerOpen,
    EDrawerType.MANAGE_EVENTS_DRAWER,
  );

  const closeDrawer = useActionCreator(drawerSlice.actions.closeDrawer, {
    drawerType: EDrawerType.MANAGE_EVENTS_DRAWER,
  });

  const locations = useSelector(locationsSlice.selectors.locations);

  const locationsStatus = useParamSelector(
    requestManagerSlice.selectors.statusBySymbol,
    LOCATIONS_GET_ALL_REQUEST_SYMBOL,
  );

  const dispatch = useDispatch();

  const requestStatus = useParamSelector(
    requestManagerSlice.selectors.statusBySymbol,
    data ? EVENTS_UPDATE_REQUEST_SYMBOL : EVENTS_CREATE_REQUEST_SYMBOL,
  );

  const onFinish = (values: IEventCreatePayload) => {
    dispatch(
      data
        ? eventsSlice.actions.updateEvent({
            ...data,
            ...values,
          })
        : eventsSlice.actions.createEvent({
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
      ({ id }: IFileUploadResponse) => form.setFieldValue("fileId", id),
      [form],
    ),
    onError: useCallback(() => {
      form.setFieldValue("fileId", undefined);
    }, [form]),
  });

  const initialValues = data
    ? {
        name: data.name,
        linkToTable: data.linkToTable,
        locationId: data.location?.id,
        participantsLimit: data.participantsLimit,
        price: data.price,
        status: data.status,
        dateTime: dayjs(data.dateTime),
      }
    : { status: EEventStatus.WAITING };

  return (
    <Drawer
      getContainer={false}
      placement={"right"}
      closable
      open={open}
      onClose={closeDrawer}
    >
      <Form<IEventCreatePayload>
        form={form}
        layout={"vertical"}
        onFinish={onFinish}
        initialValues={initialValues}
      >
        <Form.Item
          name={"name"}
          label={TEXT.events.name}
          rules={[{ required: true, message: TEXT.common.requiredField }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name={"dateTime"}
          label={TEXT.events.dateTime}
          rules={[{ required: true, message: TEXT.common.requiredField }]}
        >
          <DatePicker style={{ width: "100%" }} placeholder={""} showTime />
        </Form.Item>

        <Form.Item
          name={"price"}
          label={TEXT.events.price}
          rules={[{ required: true, message: TEXT.common.requiredField }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name={"status"}
          label={TEXT.events.status}
          rules={[{ required: true, message: TEXT.common.requiredField }]}
        >
          <Select
            value={EEventStatus.WAITING}
            options={EVENT_STATUS_SELECT_OPTIONS}
          />
        </Form.Item>
        <Form.Item
          name={"participantsLimit"}
          label={TEXT.events.participantsLimit}
        >
          <Input type={"number"} />
        </Form.Item>
        <Form.Item name={"linkToTable"} label={TEXT.events.linkToTable}>
          <Input />
        </Form.Item>
        <Form.Item
          name={"locationId"}
          label={TEXT.events.locationId}
          rules={[{ required: true, message: TEXT.common.requiredField }]}
        >
          <Select
            loading={locationsStatus === ERequestStatus.loading}
            options={locations.map(({ id, title }) => ({
              value: id,
              label: title,
            }))}
          />
        </Form.Item>
        <Form.Item name={"fileId"} label={TEXT.events.fileId}>
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
            {data ? TEXT.common.edit : TEXT.common.create}
          </Button>
        </Form.Item>
      </Form>
    </Drawer>
  );
};

export { ManageEventsDrawer };
