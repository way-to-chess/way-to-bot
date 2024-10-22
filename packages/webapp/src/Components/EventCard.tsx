import { FC } from "react";
import { TEvent } from "../Models/TEvent.ts";
import { generatePath, Link } from "react-router-dom";
import { WEBAPP_ROUTES } from "@way-to-bot/shared/constants/webappRoutes.ts";
import classes from "../EventsPage/EventsPage.module.css";
import {
  getReadableEventDate,
  getReadableEventTime,
} from "../Utils/GetReadableEventDate.ts";
import { EMOJI } from "@way-to-bot/shared/constants/emoji.ts";

const getEventInfo = (
  participants: any[],
  participantsLimit: number,
  price: string,
  dateTime: string | null,
) => {
  return `
  ${EMOJI.time}${dateTime ? getReadableEventTime(dateTime) : "**-**"}
  ${EMOJI.participants}${participants.length}/${participantsLimit}
   ${EMOJI.price}${price}
    `;
};
const EventCard: FC<TEvent> = ({
  id,
  dateTime,
  participantsLimit,
  participants,
  location,
  price,
  status,
}) => {
  const to = generatePath(WEBAPP_ROUTES.singleEventRoute, { eventId: id });

  return (
    <div className={classes.event}>
      <div className={classes.eventHead}>
        {dateTime ? (
          <h3 className={classes.eventDataTime}>
            {getReadableEventDate(dateTime)}
          </h3>
        ) : null}
        <span className={classes.eventStatus}>{status}</span>
      </div>

      <div className={classes.eventContent}>
        <h2 className={classes.eventLocation}>
          {location ? location.title : "Location is not specified"}
        </h2>
        <p className={classes.eventInfo}>
          {getEventInfo(
            participants,
            participantsLimit ?? 0,
            price ?? "",
            dateTime,
          )}
        </p>

        <Link to={to} className={classes.eventButton}>
          {"See Details"}
        </Link>
      </div>
    </div>
  );
};

export { EventCard };
