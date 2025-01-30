import { drawerSlice, EDrawerType } from "../Store/Drawer/DrawerSlice";
import { useDrawer } from "../Hooks/UseDrawer";
import { Button, Drawer, Form } from "antd";
import { TEXT } from "@way-to-bot/shared/constants/text";
import { ERequestStatus } from "../Store/RequestManager/RequestManagerModels";
import { useDispatch } from "react-redux";
import { useParamSelector } from "../Hooks/UseParamSelector";
import { requestManagerSlice } from "../Store/RequestManager/RequestManagerSlice";
import { eventsSlice } from "../Store/Events/EventsSlice";
import { IAddUsersToEventPayload } from "@way-to-bot/shared/interfaces/event.interface";
import { ADD_USERS_TO_EVENT_REQUEST_SYMBOL } from "../Store/Events/EventsVariables";
import { UsersSelect } from "../ManageUsersPage/UsersSelect";
import { LeaguesSelect } from "../ManageLeaguesPage/LeaguesSelect";

const ManageEventUsersDrawer = () => {
  const drawer = useDrawer(EDrawerType.MANAGE_EVENT_USERS_DRAWER);

  const requestStatus = useParamSelector(
    requestManagerSlice.selectors.statusBySymbol,
    ADD_USERS_TO_EVENT_REQUEST_SYMBOL,
  );

  const data = useParamSelector(
    drawerSlice.selectors.drawerData,
    EDrawerType.MANAGE_EVENT_USERS_DRAWER,
  );

  const event = useParamSelector(
    eventsSlice.selectors.eventById,
    data?.eventId,
  );

  const [form] = Form.useForm();

  const dispatch = useDispatch();

  const onFinish = (payload: Omit<IAddUsersToEventPayload, "eventId">) => {
    dispatch(
      eventsSlice.actions.addUsersToEvent({
        ...payload,
        eventId: data.eventId,
      }),
    );
    form.resetFields();
  };

  return (
    <Drawer {...drawer} getContainer={false} placement={"right"} closable>
      <Form onFinish={onFinish} layout={"vertical"} form={form}>
        <Form.Item
          name={"leagueId"}
          label={TEXT.events.leagueId}
          rules={[{ required: true, message: TEXT.common.requiredField }]}
        >
          <LeaguesSelect />
        </Form.Item>

        <Form.Item
          name={"userIds"}
          label={TEXT.events.userIds}
          rules={[{ required: true, message: TEXT.common.requiredField }]}
        >
          <UsersSelect
            filterUsers={({ id }) => {
              if (!event) {
                return true;
              }

              return !event.eventsUsersLeagues.find((it) => {
                return it.user.id === id;
              });
            }}
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

export { ManageEventUsersDrawer };
