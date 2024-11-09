import { List } from "antd";
import { ManageEventsDrawer } from "./ManageEventsDrawer";
import { EventsListItem } from "./EventsListItem";
import { useSelector } from "react-redux";
import { eventsSlice } from "../Store/Events/EventsSlice";
import { useParamSelector } from "../Hooks/UseParamSelector";
import { requestManagerSlice } from "../Store/RequestManager/RequestManagerSlice";
import { EVENTS_GET_ALL_REQUEST_SYMBOL } from "../Store/Events/EventsVariables";
import { ERequestStatus } from "../Store/RequestManager/RequestManagerModels";

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
        dataSource={events}
        renderItem={(event) => {
          return <EventsListItem {...event} key={event.id} />;
        }}
      />
    </>
  );
};

export { ManageEventsPage };
