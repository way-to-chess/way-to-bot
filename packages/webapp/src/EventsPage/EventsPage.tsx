import {eventApi} from "../Store/Event/EventApi";
import classes from "./EventsPage.module.css";
import {Typography} from "../Typography/Typography";
import {FC} from "react";
import dayjs from "dayjs";
import "dayjs/locale/ru";
import {Button} from "../Button/Button";
import {generatePath, Link} from "react-router";
import clsx from "clsx";
import {Skeleton} from "../Skeleton/Skeleton";
import {ImgWithContainer} from "../ImgWithContainer/ImgWithContainer";
import {EventParticipantCount} from "../EventParticipantCount/EventParticipantCount";
import {ClientDTOEventGetMany} from "@way-to-bot/shared/api/DTO/client/event.DTO";
import {Error, RefetchError} from "../Error/Error";
import {ESortDirection} from "@way-to-bot/shared/api/enums/ESortDirection";
import {EEventStatus} from "@way-to-bot/shared/api/enums/EEventStatus";
import {CalendarIcon, CircleDollarSignIcon, ClockIcon, MapPinIcon} from "lucide-react";
import {useEventType} from "../Hooks/UseEventType";
import {EPredicate} from "@way-to-bot/shared/api/enums/EPredicate";
import {EOperandPredicate} from "@way-to-bot/shared/api/enums/EOperandPredicate";

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
    durationTime: string | null
}

const Event: FC<IEventProps> = (
    {
        preview,
        name,
        participantsLimit,
        formattedDate,
        price,
        location,
        id,
        status,
        participantsCount,
        type,
        duration,
        dateTime
    }) => {
    const eventPath = generatePath("/:type/events/:id", {id: id.toString(), type});

    const isFinished = status === EEventStatus.FINISHED;

    const date = dayjs(dateTime)

    const formattedTime = date.format("HH:mm").toLowerCase();

    const durationTime = duration ? " - " + date.add(duration, "milliseconds").format("HH:mm").toLowerCase() : null

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
                        <CalendarIcon color={"var(--main-color)"} size={20}/>
                        {formattedDate}
                    </Typography>
                    <Typography type={"text2"} className={classes.infoItem}>
                        <ClockIcon color={"var(--main-color)"} size={20}/>
                        {formattedTime}
                        {durationTime}
                    </Typography>
                </div>
                <Typography type={"text2"} className={classes.infoItem}>
                    <CircleDollarSignIcon color={"var(--main-color)"} size={20}/>
                    {price}
                </Typography>
                <Typography type={"text2"} className={classes.infoItem}>
                    <MapPinIcon color={"var(--main-color)"} size={20}/>
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

const EventGroup: FC<IEventGroupProps> = ({dateTimeString, events}) => {
    const date = dayjs(dateTimeString);

    const formattedDate = date.format("D MMMM, dd").toLowerCase();

    return (
        <div className={classes.eventGroup}>
            <Typography type={"title3"} value={formattedDate}/>
            {events.map((event) => (
                <Event
                    {...event}
                    formattedDate={formattedDate}
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
            <Skeleton style={{width: "50%", height: 25, borderRadius: 16}}/>
            {FAKE_EVENTS.map((event) => (
                <Skeleton
                    style={{width: "100%", height: 380, borderRadius: 16}}
                    key={event}
                />
            ))}
        </div>
    );
};

const Events = () => {
    const eventType = useEventType()

    const {data, isFetching, isError, refetch, error} =
        eventApi.useGetAllEventsQuery({
            sort: {
                field: "dateTime",
                direction: ESortDirection.ASC,
            },
            where: {
                predicate: EPredicate.OR,
                operands: [{
                    field: "type",
                    predicate: EOperandPredicate.EQ,
                    value: eventType
                }]
            }
        });


    if (isFetching) {
        return <FakeEventGroup/>;
    }

    if (isError) {
        return <RefetchError refetch={refetch} error={error}/>;
    }

    if (!data || data.length <= 0) {
        return <Error title={"Пока нет событий этого типа"} text={"Зайдите сюда позже"}/>;
    }

    const grouped = groupByDateTime(data);

    return Object.entries(grouped)
        .reverse()
        .map(([key, value]) => (
            <EventGroup events={value} dateTimeString={key} key={key}/>
        ));
};

const EventsPage = () => {
    return (
        <div className={classes.page}>
            <Events/>
        </div>
    );
};

export {EventsPage};
