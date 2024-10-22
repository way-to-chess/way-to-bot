import { EventFormFactory } from "./EventFormFactory.tsx";
import { eventsSlice } from "../../Store/Events/EventsSlice.ts";
import { useDispatch, useSelector } from "react-redux";
import { withProps } from "../../Utils/WithProps.ts";
import { RequestStatusToComponent } from "../../Components/RequestStatusToComponent.tsx";
import { EVENTS_GET_BY_ID_REQUEST_SYMBOL } from "../../Store/Events/EventsVariables.ts";
import { IEventFormFinishValues } from "./EventsCommon.ts";
import { WEBAPP_ROUTES } from "@way-to-bot/shared/constants/webappRoutes.ts";

const UpdateEventFormSuccess = () => {
  const {
    location,
    status,
    dateTime,
    price,
    description,
    participantsLimit,
    id,
  } = useSelector(eventsSlice.selectors.singleEventNotNil);

  const dispatch = useDispatch();

  const onFinish = (values: IEventFormFinishValues) => {
    dispatch(eventsSlice.actions.update({ ...values, id }));
  };

  return (
    <EventFormFactory
      initialValues={{
        location,
        status,
        dateTime,
        price,
        description,
        participantsLimit,
      }}
      onFinish={onFinish}
      backPath={WEBAPP_ROUTES.manageEventsRoute}
    />
  );
};

const UpdateEventForm = withProps(RequestStatusToComponent)({
  requestSymbol: EVENTS_GET_BY_ID_REQUEST_SYMBOL,
  SUCCESS: UpdateEventFormSuccess,
});

export { UpdateEventForm };
