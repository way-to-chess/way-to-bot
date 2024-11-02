import { memo } from "react";
import { IEvent } from "@way-to-bot/shared/interfaces/event.interface";
import { Card, List } from "antd";
import { generatePath, Link } from "react-router-dom";
import { WEBAPP_ROUTES } from "@way-to-bot/shared/constants/webappRoutes";

const EventsListItem = memo<IEvent>(({ location, id }) => {
  return (
    <List.Item>
      <Link
        to={`/${generatePath(WEBAPP_ROUTES.manageEventsIdRoute, { eventId: id })}`}
      >
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
          <Card.Meta title={location?.title} description={location?.address} />
        </Card>
      </Link>
    </List.Item>
  );
});

export { EventsListItem };
