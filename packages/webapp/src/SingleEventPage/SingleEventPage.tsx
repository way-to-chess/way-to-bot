import {useParams} from "react-router";
import {eventApi} from "../Store/Event/EventApi";
import {getNotNil} from "@way-to-bot/shared/utils/getNotNil";
import classes from "./SingleEventPage.module.css";
import {ImgWithContainer} from "../ImgWithContainer/ImgWithContainer";
import {Typography} from "../Typography/Typography";
import {ShareIcon} from "../Icons/ShareIcon";
import {EventParticipantCount} from "../EventParticipantCount/EventParticipantCount";
import {CalendarIcon} from "../Icons/CalendarIcon";
import {ClockIcon} from "../Icons/ClockIcon";
import {PriceIcon} from "../Icons/PriceIcon";
import dayjs from "dayjs";
import {LocationIcon} from "../Icons/LocationIcon";
import {FoodIcon} from "../Icons/FoodIcon";
import {AlcoholIcon} from "../Icons/AlcoholIcon";
import {CoffeeIcon} from "../Icons/CoffeeIcon";
import {CameraIcon} from "../Icons/CameraIcon";
import {getUserFullName} from "@way-to-bot/shared/utils/GetUserFullName";
import {MessageIcon} from "../Icons/MessageIcon";
import {Button} from "../Button/Button";
import {UserListItem} from "../UserListItem/UserListItem";
import {FC} from "react";
import {ClientDTOEventGetOne} from "@way-to-bot/shared/api/DTO/client/event.DTO";
import {Skeleton} from "../Skeleton/Skeleton";
import {Error, RefetchError} from "../Error/Error";
import {ParticipateEventButton} from "./ParticipateEventButton/ParticipateEventButton";
import {BottomSheet} from "../BottomSheet/BottomSheet";
import {IUserEntity} from "@way-to-bot/shared/api/interfaces/entities/user-entity.interface";

const LOCATION_BENEFITS = [
    {icon: FoodIcon, title: "Еда"},
    {icon: <CameraIcon width={20} height={20}/>, title: "Съёмка"},
    {icon: AlcoholIcon, title: "Алкоголь"},
    {icon: CoffeeIcon, title: "Напитки"},
];

const Host: FC<ClientDTOEventGetOne["host"]> = ({firstName, lastName, username}) => {
    return (
        <a
            className={classes.host}
            href={`https://t.me/${username?.replace("@", "")}`}
            rel={"noreferrer noopener"}
            target={"_blank"}
        >
            <ImgWithContainer className={classes.hostImg}/>
            <div className={classes.hostInfo}>
                <Typography type={"title5"} value={getUserFullName(firstName, lastName)}/>
                <Typography type={"text2"} value={"Написать"} color={"textColor2"}/>
            </div>

            {MessageIcon}
        </a>
    );
};

const Loading = () => {
    return <div className={classes.page}>
        <Skeleton className={classes.imgContainer}/>
        <div className={classes.blocks}>
            <Skeleton className={classes.blockLoading} style={{height: 190}}/>
            <Skeleton className={classes.blockLoading} style={{height: 76}}/>
            <Skeleton className={classes.blockLoading} style={{height: 184}}/>
        </div>
    </div>
}

const AllParticipants: FC<{ users: IUserEntity[] }> = ({users}) => {
    const trigger = (
        <button className={classes.all}>
            <Typography type={"text1"} value={"Все"} color={"mainColor"}/>
        </button>
    )

    return <BottomSheet trigger={trigger} title={"Все участники"}>
        <div className={classes.participants}>
            {users.map((user) => (
                <UserListItem
                    {...user}
                    className={classes.participant}
                    key={user.id}
                />
            ))}
        </div>
    </BottomSheet>
}


const Participants: FC<{ eventId: string }> = ({eventId}) => {
    const {data} = eventApi.useGetEventByIdQuery(eventId);

    const event = getNotNil(data, "SingleEventPage -> Participants -> event can't be null")

    const {
        users,
        participantsLimit
    } = event

    const sliced = users.slice(0, 5)

    return <div className={classes.block}>
        <div className={classes.participantBlock}>
            <Typography type={"title4"} value={"Участники"}/>
            <EventParticipantCount
                currentCount={users.length}
                maxCount={participantsLimit}
            />
            {sliced.length > 0 ? <AllParticipants users={users}/> : null}

        </div>
        {
            sliced.length > 0 ?
                <div className={classes.participants}>
                    {sliced.map((user) => (
                        <UserListItem
                            {...user}
                            className={classes.participant}
                            key={user.id}
                        />
                    ))}
                </div> : null
        }
    </div>
}

const SingleEventPage = () => {
    const {id} = useParams();

    const notNilId = getNotNil(id, "SingleEventPage -> id");

    const {data: event, isFetching, isError, error, refetch} = eventApi.useGetEventByIdQuery(notNilId);

    if (isFetching) {
        return <Loading/>
    }

    if (isError) {
        return <RefetchError refetch={refetch} error={error}/>
    }

    if (!event) {
        return <Error title={"Ой!"} text={"Похоже такого события нет"}>
            <Button as={"link"} to={"/events"}>{"Вернуться к событиям"}</Button>
        </Error>
    }

    const {
        preview,
        name,
        users,
        participantsLimit,
        price,
        dateTime,
        location,
        host,
        description,
    } = event;

    const date = dayjs(dateTime);

    const formattedDate = date.format("D MMMM, dd").toLowerCase();
    const formattedTime = date.format("HH:mm").toLowerCase();

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
                        <EventParticipantCount
                            currentCount={users.length}
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
                    </div>
                </div>
                {location ? (
                    <a
                        className={classes.block}
                        href={location.url ?? undefined}
                        target={"_blank"}
                        rel={"noreferrer noopener"}
                    >
                        <Typography type={"text2"} className={classes.infoItem}>
                            {LocationIcon}
                            {location.title}
                        </Typography>
                    </a>
                ) : null}

                <div className={classes.block}>
                    <Typography type={"title4"} value={"Что на локации"}/>
                    <div className={classes.benefits}>
                        {LOCATION_BENEFITS.map(({icon, title}, index) => (
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
                    <Typography type={"title4"} value={"Как всё будет"}/>
                    <Typography type={"text2"}>{description ?? "Описание не добавлено"}</Typography>
                </div>
                <Participants eventId={notNilId}/>
                <div className={classes.block}>
                    <Typography type={"title4"} value={"Организатор"}/>
                    <Host {...host}/>
                </div>
                <ParticipateEventButton eventId={notNilId}/>
            </div>
        </div>
    );
};

export {SingleEventPage};
