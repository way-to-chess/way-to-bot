import "dayjs/locale/ru.js";
import { EventFormFactory } from "./EventFormFactory";
import { eventsSlice } from "../../Store/Events/EventsSlice";
import { useDispatch } from "react-redux";
import { IEventFormFinishValues } from "./EventsCommon";

const initialValues = {
  price: "5 BYN",
  description: "Regular Match",
};

const CreateEventForm = () => {
  const dispatch = useDispatch();

  const onFormFinish = ({ status, ...values }: IEventFormFinishValues) => {
    dispatch(eventsSlice.actions.createEvent(values));
  };

  return (
    <EventFormFactory initialValues={initialValues} onFinish={onFormFinish} />
  );
};

export { CreateEventForm };
