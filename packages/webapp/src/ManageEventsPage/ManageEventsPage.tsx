import { Card, List } from "antd";
import { IEvent } from "@way-to-bot/shared/interfaces/event.interface";
import { EEventStatus, EUserRole } from "@way-to-bot/shared/enums";
import { LOCATIONS } from "../LOCATIONS";
import { ManageEventsDrawer } from "./ManageEventsDrawer";

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
