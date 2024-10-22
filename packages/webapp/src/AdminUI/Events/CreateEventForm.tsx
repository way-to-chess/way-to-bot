import "dayjs/locale/ru.js";
import { EventFormFactory } from "./EventFormFactory.tsx";
import { eventsSlice } from "../../Store/Events/EventsSlice.ts";
import { useDispatch } from "react-redux";
import { IEventFormFinishValues } from "./EventsCommon.ts";

const initialValues = {
  price: "5 BYN",
  description: "Regular Match",
};

const CreateEventForm = () => {
  const dispatch = useDispatch();

  const onFormFinish = ({ status, ...values }: IEventFormFinishValues) => {
    dispatch(eventsSlice.actions.create(values));
  };

  return (
    <EventFormFactory initialValues={initialValues} onFinish={onFormFinish} />
  );
};

export { CreateEventForm };
