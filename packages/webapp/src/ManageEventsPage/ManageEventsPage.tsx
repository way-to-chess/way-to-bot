import { List } from "antd";
import { ManageEventsDrawer } from "./ManageEventsDrawer";
import { EventsListItem } from "./EventsListItem";
import { useSelector } from "react-redux";
import { eventsSlice } from "../Store/Events/EventsSlice";

const ManageEventsPage = () => {
  const events = useSelector(eventsSlice.selectors.events);

  return (
    <>
      <ManageEventsDrawer />
      <List
        itemLayout={"vertical"}
        style={{ padding: 16 }}
        dataSource={events}
        renderItem={(event) => <EventsListItem {...event} key={event.id} />}
      />
    </>
  );
};

export { ManageEventsPage };
