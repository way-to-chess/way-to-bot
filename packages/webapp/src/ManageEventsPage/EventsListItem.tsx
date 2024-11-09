import { FC, memo, useCallback } from "react";
import {
  IEvent,
  IEventDeletePayload,
} from "@way-to-bot/shared/interfaces/event.interface";
import { Badge, Button, Card, Flex, List, Modal } from "antd";
import { generatePath, Link } from "react-router-dom";
import { WEBAPP_ROUTES } from "@way-to-bot/shared/constants/webappRoutes";
import {
  ClockCircleOutlined,
  DollarOutlined,
  EnvironmentOutlined,
  ExclamationCircleFilled,
  UserOutlined,
} from "@ant-design/icons";
import { getPreviewSrc } from "../Utils/GetPreviewSrc";
import { useActionCreator } from "../Hooks/UseActionCreator";
import { drawerSlice, EDrawerType } from "../Store/Drawer/DrawerSlice";
import { TEXT } from "@way-to-bot/shared/constants/text";
import { eventsSlice } from "../Store/Events/EventsSlice";

const EditButton = () => {
  const open = useActionCreator(drawerSlice.actions.openDrawer, {
    drawerType: EDrawerType.MANAGE_EVENTS_DRAWER,
  });

  return <Button onClick={open}>{TEXT.common.edit}</Button>;
};

const DeleteButton: FC<IEventDeletePayload> = ({ eventId }) => {
  const deleteEvent = useActionCreator(eventsSlice.actions.deleteEvent, {
    eventId,
  });

  const showDeleteConfirm = useCallback(() => {
    return Modal.confirm({
      title: TEXT.events.deleteWarn,
      icon: <ExclamationCircleFilled />,
      okText: TEXT.common.yes,
      okType: "danger",
      cancelText: TEXT.common.no,
      onOk: deleteEvent,
    });
  }, [deleteEvent]);

  return (
    <Button danger onClick={showDeleteConfirm}>
      {TEXT.common.delete}
    </Button>
  );
};

const EventsListItem = memo<IEvent>(
  ({
    eventsUsersLeagues,
    price,
    status,
    location,
    dateTime,
    preview,
    id,
    name,
    participantsLimit,
  }) => {
    return (
      <List.Item>
        <Flex vertical gap={8}>
          <Link
            to={`/${generatePath(WEBAPP_ROUTES.manageEventsIdRoute, { eventId: id })}`}
          >
            <Badge.Ribbon text={status}>
              <Card
                styles={{ cover: { height: 200 } }}
                style={{ width: "100%" }}
                hoverable
                cover={
                  <img
                    alt="example"
                    src={getPreviewSrc(preview?.url)}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                }
              >
                <Card.Meta
                  title={name}
                  description={
                    <Flex vertical gap={4}>
                      <Flex gap={8}>
                        <span>
                          <ClockCircleOutlined />
                          &nbsp;
                          {new Date(dateTime).toLocaleDateString("ru-RU")}
                        </span>
                        <span>
                          <DollarOutlined />
                          &nbsp;
                          {price}
                        </span>
                        <span>
                          <UserOutlined />
                          &nbsp;
                          {`${eventsUsersLeagues.length} / ${participantsLimit}`}
                        </span>
                      </Flex>
                      <span>
                        <EnvironmentOutlined />
                        &nbsp;
                        {`${location?.title} | ${location?.address}`}
                      </span>
                    </Flex>
                  }
                />
              </Card>
            </Badge.Ribbon>
          </Link>

          <Flex gap={8} justify={"flex-end"}>
            <EditButton />
            <DeleteButton eventId={id} />
          </Flex>
        </Flex>
      </List.Item>
    );
  },
);

export { EventsListItem };
