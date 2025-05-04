import { eventApi } from "../Store/Event/EventApi";
import classes from "./EventsPage.module.css";
import { Typography } from "../Typography/Typography";
import { IEvent } from "@way-to-bot/shared/interfaces/event.interface";
import { EEventStatus } from "@way-to-bot/shared/enums";
import { FC } from "react";
import dayjs from "dayjs";
import "dayjs/locale/ru";
import { getPreviewSrc } from "@way-to-bot/shared/utils/GetPreviewSrc";
import { ParticipantsIcon } from "../Icons/ParticipantsIcon";
import { CalendarIcon } from "../Icons/CalendarIcon";
import { ClockIcon } from "../Icons/ClockIcon";
import { PriceIcon } from "../Icons/PriceIcon";
import { LocationIcon } from "../Icons/LocationIcon";
import { Button } from "../Button/Button";
import { generatePath } from "react-router";
import clsx from "clsx";
import { Skeleton } from "../Skeleton/Skeleton";
import { CameraIcon } from "../Icons/CameraIcon";

dayjs.locale("ru");

const groupByDateTime = (events: IEvent[]) =>
  events.reduce<Record<string, IEvent[]>>((acc, event) => {
    const key =
      event.status === EEventStatus.FINISHED ? event.dateTime : event.dateTime;

    if (acc[key]) {
      acc[key].push(event);
      return acc;
    }

    acc[key] = [event];

    return acc;
  }, {});

const getParticipantsClassName = (
  participantsCount: number,
  participantsLimit?: number | null,
) => {
  const percent = participantsLimit
    ? Math.min((participantsCount * 100) / participantsLimit, 100)
    : 0;

  if (percent === 100) {
    return classes.full;
  }

  if (percent >= 70 && percent < 100) {
    return classes.danger;
  }

  if (percent >= 30 && percent < 70) {
    return classes.warning;
  }

  return undefined;
};

interface IEventProps extends IEvent {
  formattedDate: string;
  formattedTime: string;
}

const Event: FC<IEventProps> = ({
  preview,
  name,
  eventsUsersLeagues,
  participantsLimit,
  formattedDate,
  formattedTime,
  price,
  location,
  id,
  status,
}) => {
  const eventPath = generatePath("/events/:id", { id: id.toString() });

  const isFinished = status === EEventStatus.FINISHED;

  const participantsClassName = getParticipantsClassName(
    eventsUsersLeagues.length,
    participantsLimit,
  );

  return (
    <div className={clsx(classes.event, isFinished && classes.finished)}>
      <div className={classes.imgContainer}>
        {preview ? (
          <img alt={"event cover"} src={getPreviewSrc(preview.url)} />
        ) : (
          <div className={classes.emptyImg}>{CameraIcon}</div>
        )}
      </div>

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
        <div className={clsx(classes.participantsBlock, participantsClassName)}>
          {ParticipantsIcon}
          {`${eventsUsersLeagues.length} / ${participantsLimit}`}
        </div>
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

      <Button as={"link"} to={eventPath}>
        {"Узнать больше"}
      </Button>
    </div>
  );
};

interface IEventGroupProps {
  dateTimeString: string;
  events: IEvent[];
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
  const { data, isLoading } = eventApi.useGetAllEventsQuery();

  if (isLoading) {
    return <FakeEventGroup />;
  }

  if (!data) {
    return null;
  }

  const grouped = groupByDateTime(data);

  return Object.entries(grouped).map(([key, value]) => (
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
