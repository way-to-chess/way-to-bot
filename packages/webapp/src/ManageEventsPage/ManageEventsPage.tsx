import { Button, Flex, List, Modal } from "antd";
import { ManageEventsDrawer } from "./ManageEventsDrawer";
import { EventsListItem } from "./EventsListItem";
import { useSelector } from "react-redux";
import { eventsSlice } from "../Store/Events/EventsSlice";
import { useParamSelector } from "../Hooks/UseParamSelector";
import { requestManagerSlice } from "../Store/RequestManager/RequestManagerSlice";
import { EVENTS_GET_ALL_REQUEST_SYMBOL } from "../Store/Events/EventsVariables";
import { ERequestStatus } from "../Store/RequestManager/RequestManagerModels";
import { sortByKey } from "../Utils/SortByKey";
import { ESortDirection } from "../Models/ESortDirection";
import { ACL } from "../ACL/ACL";
import { EUserRole } from "@way-to-bot/shared/enums";
import {
  IEvent,
  IEventDeletePayload,
} from "@way-to-bot/shared/interfaces/event.interface";
import { useActionCreator } from "../Hooks/UseActionCreator";
import { drawerSlice, EDrawerType } from "../Store/Drawer/DrawerSlice";
import { TEXT } from "@way-to-bot/shared/constants/text";
import { FC, memo, useCallback } from "react";
import { ExclamationCircleFilled } from "@ant-design/icons";

const EditButton = (event: IEvent) => {
  const open = useActionCreator(drawerSlice.actions.openDrawer, {
    drawerType: EDrawerType.MANAGE_EVENTS_DRAWER,
    data: event,
  });

  return <Button onClick={open}>{TEXT.edit}</Button>;
};

const DeleteButton: FC<IEventDeletePayload> = ({ eventId }) => {
  const deleteEvent = useActionCreator(eventsSlice.actions.deleteEvent, {
    eventId,
  });

  const showDeleteConfirm = useCallback(() => {
    return Modal.confirm({
      title: TEXT.deleteWarn,
      icon: <ExclamationCircleFilled />,
      okText: TEXT.yes,
      okType: "danger",
      cancelText: TEXT.no,
      onOk: deleteEvent,
    });
  }, [deleteEvent]);

  return (
    <Button danger onClick={showDeleteConfirm}>
      {TEXT.delete}
    </Button>
  );
};

const EventListItemExtra = memo<IEvent>((event) => {
  return (
    <ACL roles={[EUserRole.ADMIN]}>
      <Flex gap={8} justify={"flex-end"}>
        <EditButton {...event} />
        <DeleteButton eventId={event.id} />
      </Flex>
    </ACL>
  );
});

const ManageEventsPage = () => {
  const events = useSelector(eventsSlice.selectors.events);
  const status = useParamSelector(
    requestManagerSlice.selectors.statusBySymbol,
    EVENTS_GET_ALL_REQUEST_SYMBOL,
  );

  return (
    <>
      <ManageEventsDrawer />
      <List
        loading={status === ERequestStatus.loading}
        itemLayout={"vertical"}
        style={{ padding: 16 }}
        dataSource={sortByKey(events, "dateTime", ESortDirection.desc)}
        renderItem={(event) => {
          return (
            <EventsListItem
              {...event}
              key={event.id}
              extra={<EventListItemExtra {...event} />}
            />
          );
        }}
      />
    </>
  );
};

export { ManageEventsPage };
