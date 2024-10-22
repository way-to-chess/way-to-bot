import { Empty } from "antd";
import classes from "./EventsPage.module.css";
import { isEmpty } from "../Utils/OneLineUtils";
import { withProps } from "../Utils/WithProps";
import { RequestStatusToComponent } from "../Components/RequestStatusToComponent";
import { EVENTS_GET_ALL_REQUEST_SYMBOL } from "../Store/Events/EventsVariables";
import { useSelector } from "react-redux";
import { eventsSlice } from "../Store/Events/EventsSlice";
import { EventCard } from "../Components/EventCard";

const EventsPageSuccess = () => {
  const events = useSelector(eventsSlice.selectors.edges);

  if (isEmpty(events)) {
    return <Empty description={"There are no events"} />;
  }

  return (
    <div className={classes.eventsPage}>
      {events.map((event) => (
        <EventCard {...event} key={event.id} />
      ))}
    </div>
  );
};

const EventsPage = withProps(RequestStatusToComponent)({
  requestSymbol: EVENTS_GET_ALL_REQUEST_SYMBOL,
  SUCCESS: EventsPageSuccess,
});

export { EventsPage };
