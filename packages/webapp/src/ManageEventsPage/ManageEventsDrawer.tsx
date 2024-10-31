import {
  Button,
  DatePicker,
  Drawer,
  Form,
  FormProps,
  Input,
  Select,
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
import { LOCATIONS } from "../LOCATIONS";
import { EVENTS_CREATE_REQUEST_SYMBOL } from "../Store/Events/EventsVariables";

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

  const dispatch = useDispatch();

  const requestStatus = useParamSelector(
    requestManagerSlice.selectors.statusBySymbol,
    EVENTS_CREATE_REQUEST_SYMBOL,
  );

  const onFinish: FormProps<IEventCreatePayload>["onFinish"] = (values) => {
    dispatch(eventsSlice.actions.createEvent(values));
  };

  const [form] = Form.useForm<IEventCreatePayload>();

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
          name={"dateTime"}
          label={TEXT.manageEventsForm.dateTime}
          rules={[{ required: true, message: TEXT.common.requiredField }]}
        >
          <DatePicker style={{ width: "100%" }} placeholder={""} showTime />
        </Form.Item>

        <Form.Item
          name={"price"}
          label={TEXT.manageEventsForm.price}
          rules={[{ required: true, message: TEXT.common.requiredField }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name={"status"}
          label={TEXT.manageEventsForm.status}
          rules={[{ required: true, message: TEXT.common.requiredField }]}
        >
          <Select
            inputValue={EEventStatus.WAITING}
            options={EVENT_STATUS_SELECT_OPTIONS}
            disabled
          />
        </Form.Item>

        <Form.Item
          name={"participantsLimit"}
          label={TEXT.manageEventsForm.participantsLimit}
        >
          <Input type={"number"} />
        </Form.Item>

        <Form.Item
          name={"linkToTable"}
          label={TEXT.manageEventsForm.linkToTable}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name={"locationId"}
          label={TEXT.manageEventsForm.locationId}
          rules={[{ required: true, message: TEXT.common.requiredField }]}
        >
          <Select
            options={LOCATIONS.map(({ id, title }) => ({
              value: id,
              label: title,
            }))}
          />
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
