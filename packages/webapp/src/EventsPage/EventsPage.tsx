import { eventApi } from "../Store/Event/EventApi";
import classes from "./EventsPage.module.css";
import { Typography } from "../Typography/Typography";
import { FC } from "react";
import dayjs from "dayjs";
import "dayjs/locale/ru";
import { CalendarIcon } from "../Icons/CalendarIcon";
import { ClockIcon } from "../Icons/ClockIcon";
import { PriceIcon } from "../Icons/PriceIcon";
import { LocationIcon } from "../Icons/LocationIcon";
import { Button } from "../Button/Button";
import { generatePath, Link } from "react-router";
import clsx from "clsx";
import { Skeleton } from "../Skeleton/Skeleton";
import { ImgWithContainer } from "../ImgWithContainer/ImgWithContainer";
import { EventParticipantCount } from "../EventParticipantCount/EventParticipantCount";
import { ClientDTOEventGetMany } from "@way-to-bot/shared/api/DTO/client/event.DTO";
import { Error, RefetchError } from "../Error/Error";
import { ESortDirection } from "@way-to-bot/shared/api/enums/ESortDirection";
import { EEventStatus } from "@way-to-bot/shared/api/enums/EEventStatus";

dayjs.locale("ru");

const groupByDateTime = (events: ClientDTOEventGetMany[]) =>
  events.reduce<Record<string, ClientDTOEventGetMany[]>>((acc, event) => {
    const key = event.dateTime;

    if (acc[key]) {
      acc[key].push(event);
      return acc;
    }

    acc[key] = [event];

    return acc;
  }, {});

interface IEventProps extends ClientDTOEventGetMany {
  formattedDate: string;
  formattedTime: string;
}

const Event: FC<IEventProps> = ({
  preview,
  name,
  participantsLimit,
  formattedDate,
  formattedTime,
  price,
  location,
  id,
  status,
  participantsCount,
}) => {
  const eventPath = generatePath("/events/:id", { id: id.toString() });

  const isFinished = status === EEventStatus.FINISHED;

  return (
    <Link
      to={eventPath}
      className={clsx(classes.event, isFinished && classes.finished)}
    >
      <ImgWithContainer
        previewUrl={preview?.url}
        className={classes.imgContainer}
      />

      {isFinished ? (
        <Typography
          type={"text2"}
          className={classes.status}
          color={"textColor5"}
        >
          {"Завершено"}
        </Typography>
      ) : null}

      <div className={classes.nameBlock}>
        <Typography type={"title3"} className={classes.name}>
          {name}
        </Typography>

        <EventParticipantCount
          currentCount={participantsCount}
          maxCount={participantsLimit}
        />
      </div>

      <div className={classes.infoBlock}>
        <div className={classes.infoGroup}>
          <Typography type={"text2"} className={classes.infoItem}>
            {CalendarIcon}
            {formattedDate}
          </Typography>
          <Typography type={"text2"} className={classes.infoItem}>
            {ClockIcon}
            {formattedTime}
          </Typography>
        </div>
        <Typography type={"text2"} className={classes.infoItem}>
          {PriceIcon}
          {price}
        </Typography>
        <Typography type={"text2"} className={classes.infoItem}>
          {LocationIcon}
          {location?.title}
        </Typography>
      </div>

      <Button>{"Узнать больше"}</Button>
    </Link>
  );
};

interface IEventGroupProps {
  dateTimeString: string;
  events: ClientDTOEventGetMany[];
}

const EventGroup: FC<IEventGroupProps> = ({ dateTimeString, events }) => {
  const date = dayjs(dateTimeString);

  const formattedDate = date.format("D MMMM, dd").toLowerCase();
  const formattedTime = date.format("HH:mm").toLowerCase();

  return (
    <div className={classes.eventGroup}>
      <Typography type={"title3"} value={formattedDate} />
      {events.map((event) => (
        <Event
          {...event}
          formattedDate={formattedDate}
          formattedTime={formattedTime}
          key={event.id}
        />
      ))}
    </div>
  );
};

const FAKE_EVENTS = Array(5)
  .fill(null)
  .map((_, i) => i);

const FakeEventGroup = () => {
  return (
    <div className={classes.eventGroup}>
      <Skeleton style={{ width: "50%", height: 25, borderRadius: 16 }} />
      {FAKE_EVENTS.map((event) => (
        <Skeleton
          style={{ width: "100%", height: 380, borderRadius: 16 }}
          key={event}
        />
      ))}
    </div>
  );
};

const Events = () => {
  const { data, isFetching, isError, refetch, error } =
    eventApi.useGetAllEventsQuery({
      sort: {
        field: "dateTime",
        direction: ESortDirection.ASC,
      },
    });

  if (isFetching) {
    return <FakeEventGroup />;
  }

  if (isError) {
    return <RefetchError refetch={refetch} error={error} />;
  }

  if (!data) {
    return <Error title={"Нет событий"} text={"Зайдите сюда позже"} />;
  }

  const grouped = groupByDateTime(data);

  return Object.entries(grouped)
    .reverse()
    .map(([key, value]) => (
      <EventGroup events={value} dateTimeString={key} key={key} />
    ));
};

const EventsPage = () => {
  return (
    <div className={classes.page}>
      <div className={classes.top}>
        <Typography type={"title2"} value={"Шахматы"} />
        <Typography type={"text2"} color={"textColor2"}>
          {"Текущие и прошедшие турниры"}
        </Typography>
      </div>
      <Events />
    </div>
  );
};

export { EventsPage };
