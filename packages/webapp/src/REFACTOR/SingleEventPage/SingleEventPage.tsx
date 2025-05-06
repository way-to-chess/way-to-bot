import { useParams } from "react-router";
import { eventApi } from "../Event/EventApi";
import { getNotNil } from "@way-to-bot/shared/utils/getNotNil";
import classes from "./SingleEventPage.module.css";
import { ImgWithContainer } from "../ImgWithContainer/ImgWithContainer";
import { Typography } from "../Typography/Typography";
import { ShareIcon } from "../Icons/ShareIcon";
import { EventParticipantCount } from "../EventParticipantCount/EventParticipantCount";
import { CalendarIcon } from "../Icons/CalendarIcon";
import { ClockIcon } from "../Icons/ClockIcon";
import { PriceIcon } from "../Icons/PriceIcon";
import dayjs from "dayjs";
import { LocationIcon } from "../Icons/LocationIcon";
import { FoodIcon } from "../Icons/FoodIcon";
import { AlcoholIcon } from "../Icons/AlcoholIcon";
import { CoffeeIcon } from "../Icons/CoffeeIcon";
import { CameraIcon } from "../Icons/CameraIcon";
import { FC } from "react";
import { IUser } from "@way-to-bot/shared/interfaces/user.interface";
import { getUserFullName } from "@way-to-bot/shared/utils/GetUserFullName";
import clsx from "clsx";
import { MessageIcon } from "../Icons/MessageIcon";
import { Button } from "../../Button/Button";

const LOCATION_BENEFITS = [
  { icon: FoodIcon, title: "Еда" },
  { icon: <CameraIcon width={20} height={20} />, title: "Съёмка" },
  { icon: AlcoholIcon, title: "Алкоголь" },
  { icon: CoffeeIcon, title: "Напитки" },
];

interface IParticipantProps
  extends Pick<IUser, "photo" | "username" | "firstName" | "lastName"> {
  isAdmin?: boolean;
}

const Participant: FC<IParticipantProps> = ({
  firstName,
  lastName,
  username,
  photo,
  isAdmin,
}) => {
  return (
    <div className={clsx(classes.participant, isAdmin && classes.admin)}>
      <ImgWithContainer
        className={classes.participantImg}
        previewUrl={photo?.url}
      />
      <div className={classes.participantInfo}>
        <Typography
          type={"title5"}
          value={getUserFullName(firstName, lastName)}
        />
        {isAdmin ? (
          <Typography type={"text2"} value={username} color={"textColor2"} />
        ) : (
          username
        )}
      </div>

      {isAdmin ? (
        <a
          className={classes.adminMessage}
          href={"https://web.telegram.org/k/#@Roman_Comandorb"}
          rel={"noreferrer noopener"}
          target={"_blank"}
        >
          {MessageIcon}
        </a>
      ) : null}
    </div>
  );
};

const SingleEventPage = () => {
  const { id } = useParams();

  const notNilId = getNotNil(id, "SingleEventPage -> id");

  const { data: event } = eventApi.useGetEventByIdQuery(notNilId);

  if (!event) {
    return null;
  }

  const {
    preview,
    name,
    eventsUsersLeagues,
    participantsLimit,
    price,
    dateTime,
    location,
  } = event;

  const date = dayjs(dateTime);

  const formattedDate = date.format("D MMMM, dd").toLowerCase();
  const formattedTime = date.format("HH:mm").toLowerCase();

  const ParticipantCount = (
    <EventParticipantCount
      currentCount={eventsUsersLeagues.length}
      maxCount={participantsLimit}
    />
  );

  return (
    <div className={classes.page}>
      <ImgWithContainer
        previewUrl={preview?.url}
        className={classes.imgContainer}
      />
      <div className={classes.blocks}>
        <div className={classes.block}>
          <div className={classes.nameBlock}>
            <div className={classes.name}>
              <Typography
                type={"title3"}
                value={name ?? "Турнир без названия"}
              />
              <button className={classes.shareLink}>{ShareIcon}</button>
            </div>
            {ParticipantCount}
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
          </div>
        </div>
        <div className={classes.block}>
          <Typography type={"text2"} className={classes.infoItem}>
            {LocationIcon}
            {location?.title}
          </Typography>
        </div>
        <div className={classes.block}>
          <Typography type={"title4"} value={"Детали турнира"} />
          <Typography type={"text2"}>{"Детали не добавлены"}</Typography>
        </div>

        <div className={classes.block}>
          <Typography type={"title4"} value={"Что на локации"} />
          <div className={classes.benefits}>
            {LOCATION_BENEFITS.map(({ icon, title }, index) => (
              <Typography
                type={"text2"}
                key={index}
                className={classes.benefit}
              >
                {icon}
                {title}
              </Typography>
            ))}
          </div>
        </div>
        <div className={classes.block}>
          <Typography type={"title4"} value={"Как всё будет"} />
          <Typography type={"text2"}>{"Описание не добавлено"}</Typography>
        </div>
        <div className={classes.block}>
          <div className={classes.participantBlock}>
            <Typography type={"title4"} value={"Участники"} />
            {ParticipantCount}
            <button className={classes.all}>
              <Typography type={"text1"} value={"Все"} color={"mainColor"} />
            </button>
          </div>
          <div className={classes.participants}>
            {eventsUsersLeagues.slice(0, 5).map(({ user }) => (
              <Participant {...user} key={user.id} />
            ))}
          </div>
        </div>
        <div className={classes.block}>
          <Typography type={"title4"} value={"Организатор"} />
          <Participant
            isAdmin
            firstName={"Роман"}
            lastName={"Радюш"}
            username={"Написать"}
          />
        </div>
        <Button className={classes.button} disabled>
          {"Участвовать"}
        </Button>
      </div>
    </div>
  );
};

export { SingleEventPage };
