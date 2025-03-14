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
  Typography,
} from "antd";
import { useParams } from "react-router-dom";
import { useParamSelector } from "../Hooks/UseParamSelector";
import { eventsSlice } from "../Store/Events/EventsSlice";
import {
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
import { getPreviewSrc } from "@way-to-bot/shared/utils/GetPreviewSrc";
import { ManageEventUsersDrawer } from "./ManageEventUsersDrawer";
import { EVENT_STATUS_TO_TEXT_MAP } from "./EVENT_STATUS_TO_TEXT_MAP";
import { ILeague } from "@way-to-bot/shared/interfaces/league.interface";
import { IUser } from "@way-to-bot/shared/interfaces/user.interface";
import { FC, useCallback } from "react";
import { useActionCreator } from "../Hooks/UseActionCreator";
import { IRemoveUsersFromEventPayload } from "@way-to-bot/shared/interfaces/event.interface";
import { ACL } from "../ACL/ACL";
import { EUserRole } from "@way-to-bot/shared/enums";
import { ParticipateEventButton } from "./ParticipateEventButton";

const DeleteButton: FC<IRemoveUsersFromEventPayload> = (payload) => {
  const removeUserFromEvent = useActionCreator(
    eventsSlice.actions.removeUsersFromEvent,
    payload,
  );

  const showDeleteConfirm = useCallback(() => {
    return Modal.confirm({
      title: TEXT.usersDeleteWarn,
      icon: <ExclamationCircleFilled />,
      okText: TEXT.yes,
      okType: "danger",
      cancelText: TEXT.no,
      onOk: removeUserFromEvent,
    });
  }, [removeUserFromEvent]);

  return (
    <Button onClick={showDeleteConfirm} danger>
      {TEXT.delete}
    </Button>
  );
};

interface INormalizedLeague extends Pick<ILeague, "name" | "id"> {
  users: IUser[];
}

const ManageEventsIdPage = () => {
  const { eventId } = useParams();

  const event = useParamSelector(eventsSlice.selectors.eventById, eventId);

  const loading = useParamSelector(
    requestManagerSlice.selectors.loadingBySymbol,
    EVENTS_GET_BY_ID_REQUEST_SYMBOL,
  );

  if (!event) {
    return <Empty style={{ padding: 16 }} />;
  }

  const leagues = event.eventsUsersLeagues.reduce<INormalizedLeague[]>(
    (acc, { league, user }) => {
      const leagueIndex = acc.findIndex((it) => it.id === league.id);

      if (leagueIndex !== -1) {
        acc[leagueIndex]?.users.push(user);
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
        style={{
          padding: "16px 16px calc(var(--ant-control-height) + 32px)",
          position: "relative",
        }}
        loading={loading}
      >
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
                size={60}
                src={getPreviewSrc(event.location?.preview?.url ?? "")}
                icon={<EnvironmentOutlined />}
              />
            }
            title={<Typography.Text>{event.location?.title}</Typography.Text>}
            description={
              <Typography.Link
                href={event.location?.url ?? ""}
                target={"_blank"}
                rel="noreferrer"
              >
                {event.location?.address}
              </Typography.Link>
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

                        <ACL roles={[EUserRole.ADMIN]}>
                          <DeleteButton
                            leagueId={id}
                            eventId={event.id}
                            userIds={[user.id]}
                          />
                        </ACL>
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
        {loading ? null : <ParticipateEventButton eventId={event.id} />}
      </List>
    </>
  );
};

export { ManageEventsIdPage };
