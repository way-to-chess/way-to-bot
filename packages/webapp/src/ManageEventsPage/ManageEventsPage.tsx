import { eventsSlice } from "../Store/Events/EventsSlice";
import { useSelector } from "react-redux";
import { isEmpty } from "../Utils/OneLineUtils";
import { Card, Empty, Flex, List } from "antd";
import { generatePath, Link } from "react-router-dom";
import { WEBAPP_ROUTES } from "@way-to-bot/shared/constants/webappRoutes";
import { FixedButton } from "../Components/FixedButton";
import { EditOutlined, InfoCircleOutlined } from "@ant-design/icons";
import { FC } from "react";
import { TEvent } from "../Models/TEvent";
import { getPreviewSrc } from "../Utils/GetPreviewSrc";
import { DeleteButton } from "../Components/DeleteButton";
import { IEvent } from "@way-to-bot/shared/interfaces/event.interface";
import { EEventStatus, EUserRole } from "@way-to-bot/shared/enums";
import { LOCATIONS } from "../LOCATIONS";
import { ManageEventsDrawer } from "./ManageEventsDrawer";

const DELETE_EVENT_TITLE = "Delete Event?";

const ManageEventCard: FC<TEvent> = ({ id, location }) => {
  return (
    <Card
      cover={<img alt="example" src={getPreviewSrc(location?.preview?.url)} />}
      actions={[
        <Link
          to={generatePath(WEBAPP_ROUTES.manageSingleEventRoute, {
            eventId: id,
          })}
        >
          <InfoCircleOutlined key="info" />
        </Link>,
        <Link
          to={generatePath(WEBAPP_ROUTES.updateEventRoute, {
            eventId: id,
          })}
        >
          <EditOutlined key="edit" />
        </Link>,
        <DeleteButton
          actionCreator={eventsSlice.actions.delete}
          id={id}
          title={DELETE_EVENT_TITLE}
        />,
      ]}
    >
      <Card.Meta title={location?.title} description={location?.address} />
    </Card>
  );
};

const ManageEventsPageSuccess = () => {
  const events = useSelector(eventsSlice.selectors.edges);

  if (isEmpty(events)) {
    return (
      <>
        <Empty style={{ paddingTop: 16 }} description={"There are no events"} />
        <Link to={WEBAPP_ROUTES.createEventRoute}>
          <FixedButton />
        </Link>
      </>
    );
  }

  return (
    <Flex vertical style={{ padding: "16px 16px 62px" }} gap={16}>
      {events.map((event) => (
        <ManageEventCard {...event} key={event.id} />
      ))}

      <Link to={WEBAPP_ROUTES.createEventRoute}>
        <FixedButton />
      </Link>
    </Flex>
  );
};

const EVENTS: IEvent[] = [
  {
    id: 1,
    dateTime: Date.now(),
    location: LOCATIONS[0],
    participantsLimit: 20,
    price: "40 BYN",
    status: EEventStatus.WAITING,
    users: [
      {
        id: 1,
        events: [],
        firstName: "Sasha",
        lastName: "Nuke",
        username: "privetenn",
        total: 3,
        wins: 1,
        draws: 1,
        losses: 1,
        rating: 123,
        roles: [EUserRole.USER],
        winRate: 0.5,
        photo: null,
        createdAt: 123,
        updatedAt: 123,
      },
    ],
    updatedAt: 123,
    createdAt: 123,
  },
];

const ManageEventsPage = () => {
  return (
    <>
      <ManageEventsDrawer />
      <List
        style={{ padding: 16 }}
        dataSource={EVENTS}
        renderItem={({ location }) => {
          return (
            <List.Item>
              <Card
                styles={{ cover: { height: 200 } }}
                style={{ width: "100%" }}
                hoverable
                cover={
                  <img
                    alt="example"
                    src={location?.preview?.url}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                }
              >
                <Card.Meta
                  title={location?.title}
                  description={location?.address}
                />
              </Card>
            </List.Item>
          );
        }}
      />
    </>
  );
};

export { ManageEventsPage };
