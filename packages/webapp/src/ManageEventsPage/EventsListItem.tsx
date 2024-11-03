import { memo } from "react";
import { IEvent } from "@way-to-bot/shared/interfaces/event.interface";
import { Badge, Card, Flex, List } from "antd";
import { generatePath, Link } from "react-router-dom";
import { WEBAPP_ROUTES } from "@way-to-bot/shared/constants/webappRoutes";
import {
  ClockCircleOutlined,
  DollarOutlined,
  EnvironmentOutlined,
  UserOutlined,
} from "@ant-design/icons";

const EventsListItem = memo<IEvent>(
  ({
    id,
    preview,
    name,
    participantsLimit,
    eventsUsersLeagues,
    price,
    status,
    location,
    dateTime,
  }) => {
    return (
      <List.Item>
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
                  src={preview?.url}
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
      </List.Item>
    );
  },
);

export { EventsListItem };
