import {
  Avatar,
  Badge,
  Button,
  Card,
  Collapse,
  Empty,
  Flex,
  List,
  Modal,
} from "antd";
import { NavLink, useParams } from "react-router-dom";
import { useParamSelector } from "../Hooks/UseParamSelector";
import { eventsSlice } from "../Store/Events/EventsSlice";
import { withProps } from "../Utils/WithProps";
import { WEBAPP_ROUTES } from "@way-to-bot/shared/constants/webappRoutes";
import {
  ArrowLeftOutlined,
  ClockCircleOutlined,
  DollarOutlined,
  EnvironmentOutlined,
  ExclamationCircleFilled,
  UserOutlined,
} from "@ant-design/icons";
import { TEXT } from "@way-to-bot/shared/constants/text";
import { UsersListItem } from "../ManageUsersPage/UsersListItem";
import { requestManagerSlice } from "../Store/RequestManager/RequestManagerSlice";
import { EVENTS_GET_BY_ID_REQUEST_SYMBOL } from "../Store/Events/EventsVariables";
import { ERequestStatus } from "../Store/RequestManager/RequestManagerModels";
import { getPreviewSrc } from "../Utils/GetPreviewSrc";
import { ManageEventUsersDrawer } from "./ManageEventUsersDrawer";
import { EVENT_STATUS_TO_TEXT_MAP } from "./EVENT_STATUS_TO_TEXT_MAP";
import { ILeague } from "@way-to-bot/shared/interfaces/league.interface";
import { IUser } from "@way-to-bot/shared/interfaces/user.interface";
import { FC, useCallback } from "react";
import { useActionCreator } from "../Hooks/UseActionCreator";
import { IRemoveUsersFromEventPayload } from "@way-to-bot/shared/interfaces/event.interface";

const DeleteButton: FC<IRemoveUsersFromEventPayload> = (payload) => {
  const removeUserFromEvent = useActionCreator(
    eventsSlice.actions.removeUsersFromEvent,
    payload,
  );

  const showDeleteConfirm = useCallback(() => {
    return Modal.confirm({
      title: TEXT.users.deleteWarn,
      icon: <ExclamationCircleFilled />,
      okText: TEXT.common.yes,
      okType: "danger",
      cancelText: TEXT.common.no,
      onOk: removeUserFromEvent,
    });
  }, [removeUserFromEvent]);

  return (
    <Button onClick={showDeleteConfirm} danger>
      {TEXT.common.delete}
    </Button>
  );
};

interface INormalizedLeague extends Pick<ILeague, "name" | "id"> {
  users: IUser[];
}

const ManageEventsIdPage = () => {
  const { eventId } = useParams();

  const event = useParamSelector(eventsSlice.selectors.eventById, eventId);

  const status = useParamSelector(
    requestManagerSlice.selectors.statusBySymbol,
    EVENTS_GET_BY_ID_REQUEST_SYMBOL,
  );

  if (!event) {
    return <Empty style={{ padding: 16 }} />;
  }

  const leagues = event.eventsUsersLeagues.reduce<INormalizedLeague[]>(
    (acc, { league, user }) => {
      const leagueIndex = acc.findIndex((it) => it.id === league.id);

      if (leagueIndex !== -1) {
        acc[leagueIndex].users.push(user);
        return acc;
      }

      acc.push({
        id: league.id,
        name: league.name,
        users: [user],
      });

      return acc;
    },
    [],
  );

  return (
    <>
      <ManageEventUsersDrawer />
      <List
        itemLayout={"vertical"}
        style={{ padding: 16 }}
        loading={status === ERequestStatus.loading}
      >
        <List.Item>
          <Flex
            style={{ color: "black" }}
            gap={8}
            component={withProps(NavLink)({
              to: `/${WEBAPP_ROUTES.manageEventsRoute}`,
            })}
          >
            <ArrowLeftOutlined />

            <div>{TEXT.common.events}</div>
          </Flex>
        </List.Item>

        <List.Item>
          <Badge.Ribbon text={EVENT_STATUS_TO_TEXT_MAP[event.status]}>
            <Card
              bordered={false}
              styles={{ cover: { height: 200 } }}
              style={{ width: "100%", boxShadow: "none" }}
              cover={
                <img
                  alt="example"
                  src={getPreviewSrc(event.preview?.url)}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
              }
            >
              <Card.Meta
                title={event.name}
                description={
                  <Flex vertical gap={4}>
                    <Flex gap={8}>
                      <span>
                        <ClockCircleOutlined />
                        &nbsp;
                        {new Date(event.dateTime).toLocaleDateString("ru-RU")}
                      </span>
                      <span>
                        <DollarOutlined />
                        &nbsp;
                        {event.price}
                      </span>
                      <span>
                        <UserOutlined />
                        &nbsp;
                        {`${event.eventsUsersLeagues.length} / ${event.participantsLimit}`}
                      </span>
                    </Flex>
                  </Flex>
                }
              />
            </Card>
          </Badge.Ribbon>
        </List.Item>

        <List.Item>
          <List.Item.Meta
            avatar={
              <Avatar
                shape={"square"}
                size={"large"}
                src={getPreviewSrc(event.location?.url)}
                icon={<EnvironmentOutlined />}
              />
            }
            title={event.location?.title}
            description={
              <a href={event.location?.url} target={"_blank"} rel="noreferrer">
                {event.location?.address}
              </a>
            }
          />
        </List.Item>

        <List.Item>
          {leagues.length ? (
            <Collapse
              items={leagues.map(({ name, id, users }) => ({
                key: id,
                label: name,
                children: (
                  <List
                    itemLayout={"vertical"}
                    dataSource={users}
                    renderItem={(user, index) => (
                      <Flex vertical gap={8}>
                        <List.Item>
                          <UsersListItem {...user} index={index} />
                        </List.Item>

                        <DeleteButton
                          leagueId={id}
                          eventId={event.id}
                          userIds={[user.id]}
                        />
                      </Flex>
                    )}
                  />
                ),
              }))}
            />
          ) : (
            <Empty />
          )}
        </List.Item>
      </List>
    </>
  );
};

export { ManageEventsIdPage };
