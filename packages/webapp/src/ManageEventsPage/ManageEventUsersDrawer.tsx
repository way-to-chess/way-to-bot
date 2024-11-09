import { drawerSlice, EDrawerType } from "../Store/Drawer/DrawerSlice";
import { useDrawer } from "../Hooks/UseDrawer";
import { Button, Drawer, Form, Select } from "antd";
import { TEXT } from "@way-to-bot/shared/constants/text";
import { ERequestStatus } from "../Store/RequestManager/RequestManagerModels";
import { useDispatch, useSelector } from "react-redux";
import { leaguesSlice } from "../Store/Leagues/LeaguesSlice";
import { useParamSelector } from "../Hooks/UseParamSelector";
import { requestManagerSlice } from "../Store/RequestManager/RequestManagerSlice";
import { LEAGUES_LOAD_REQUEST_SYMBOL } from "../Store/Leagues/LeaguesVariables";
import { userSlice } from "../Store/User/UserSlice";
import { USERS_LOAD_REQUEST_SYMBOL } from "../Store/User/UserVariables";
import { getUserFullName } from "../Utils/GetUserFullName";
import { eventsSlice } from "../Store/Events/EventsSlice";
import { IAddUsersToEventPayload } from "@way-to-bot/shared/interfaces/event.interface";
import { ADD_USERS_TO_EVENT_REQUEST_SYMBOL } from "../Store/Events/EventsVariables";

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

  const leagues = useSelector(leaguesSlice.selectors.leagues);

  const leaguesStatus = useParamSelector(
    requestManagerSlice.selectors.statusBySymbol,
    LEAGUES_LOAD_REQUEST_SYMBOL,
  );

  const users = useSelector(userSlice.selectors.users);

  const usersStatus = useParamSelector(
    requestManagerSlice.selectors.statusBySymbol,
    USERS_LOAD_REQUEST_SYMBOL,
  );

  const dispatch = useDispatch();

  const onFinish = (payload: Omit<IAddUsersToEventPayload, "eventId">) => {
    dispatch(
      eventsSlice.actions.addUsersToEvent({
        ...payload,
        eventId: data.eventId,
      }),
    );
  };

  return (
    <Drawer {...drawer} getContainer={false} placement={"right"} closable>
      <Form onFinish={onFinish} layout={"vertical"}>
        <Form.Item
          name={"leagueId"}
          label={TEXT.events.leagueId}
          rules={[{ required: true, message: TEXT.common.requiredField }]}
        >
          <Select
            loading={leaguesStatus === ERequestStatus.loading}
            options={leagues.map(({ id, name }) => ({
              value: id,
              label: name,
            }))}
          />
        </Form.Item>

        <Form.Item
          name={"userIds"}
          label={TEXT.events.userIds}
          rules={[{ required: true, message: TEXT.common.requiredField }]}
        >
          <Select
            mode={"multiple"}
            loading={usersStatus === ERequestStatus.loading}
            options={users.map(({ id, firstName, lastName }) => ({
              value: id,
              label: getUserFullName(firstName, lastName),
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

export { ManageEventUsersDrawer };
