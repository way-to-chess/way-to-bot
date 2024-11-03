import { Avatar, Badge, Card, Collapse, Empty, Flex, List } from "antd";
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
  UserOutlined,
} from "@ant-design/icons";
import { TEXT } from "@way-to-bot/shared/constants/text";

const ManageEventsIdPage = () => {
  const { eventId } = useParams();

  const event = useParamSelector(
    eventsSlice.selectors.eventById,
    Number(eventId),
  );

  if (!event) {
    return <Empty />;
  }

  return (
    <List itemLayout={"vertical"} style={{ padding: 16 }}>
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
        <Badge.Ribbon text={event.status}>
          <Card
            bordered={false}
            styles={{ cover: { height: 200 } }}
            style={{ width: "100%", boxShadow: "none" }}
            cover={
              <img
                alt="example"
                src={event.preview?.url}
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
              src={event.location?.url}
              icon={<EnvironmentOutlined />}
            />
          }
          title={event.location?.title}
          description={event.location?.address}
        />
      </List.Item>

      <List.Item>
        <Collapse
          items={event.eventsUsersLeagues.map(({ league }) => ({
            key: 1,
            label: league.name,
          }))}
        />
      </List.Item>
    </List>
  );
};

export { ManageEventsIdPage };
