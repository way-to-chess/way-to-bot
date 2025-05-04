import { eventApi } from "../Store/Event/EventApi";
import classes from "./EventsPage.module.css";
import { Typography } from "../Typography/Typography";

const EventsPage = () => {
  const { data } = eventApi.useGetAllEventsQuery();

  if (!data) {
    return null;
  }

  return (
    <div className={classes.page}>
      <Typography type={"title2"} value={"Шахматы"} />
      <Typography type={"text2"} color={"textColor2"}>
        {"Текущие и прошедшие турниры"}
      </Typography>
    </div>
  );
};

export { EventsPage };
