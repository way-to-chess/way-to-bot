import classes from "./SingleUserPage.module.css";
import {ImgWithContainer} from "../ImgWithContainer/ImgWithContainer";
import {generatePath, Link, useParams} from "react-router";
import {getNotNil} from "@way-to-bot/shared/utils/getNotNil";
import {userApi} from "../Store/User/UserApi";
import {TTypographyProps, Typography} from "../Typography/Typography";
import {getUserFullName} from "@way-to-bot/shared/utils/GetUserFullName";
import {FC, PropsWithChildren, ReactNode} from "react";
import {ChartIcon} from "../Icons/ChartIcon";
import {TrophyIcon} from "../Icons/TrophyIcon";
import {GamePadIcon} from "../Icons/GamePadIcon";
import {ClientDTOUserGetOne} from "@way-to-bot/shared/api/DTO/client/user.DTO";
import dayjs from "dayjs";
import {Skeleton} from "../Skeleton/Skeleton";
import {Error, RefetchError} from "../Error/Error";
import {Button} from "../Button/Button";
import {sortByKey} from "../Utils/SortByKey";

interface IStatItem {
    icon: ReactNode;
    title: string;
    value: number | string;
    color: TTypographyProps["color"]
}

const StatItem: FC<IStatItem> = ({icon, title, value, color}) => {
    return <div className={classes.statItem}>
        {icon}
        <div className={classes.statItemContent}>
            <Typography type={"title3"} value={value} color={color}/>
            <Typography type={"title5"} value={title}/>
        </div>
    </div>

}

interface IBlockProps extends PropsWithChildren {
    title: string
}

const Block: FC<IBlockProps> = ({title, children}) => {
    return <div className={classes.block}>
        <Typography type={"title4"} value={title}/>
        {children}
    </div>
}

const HistoryItem: FC<ClientDTOUserGetOne["events"][number]> = ({preview, name, dateTime, location, id}) => {
    const to = generatePath("/events/:id", {id: id.toString()})
    const date = dayjs(dateTime);
    const formattedDate = date.format("D MMMM, dd").toLowerCase();

    return <Link to={to} className={classes.historyItem}>
        <ImgWithContainer previewUrl={preview?.url} className={classes.historyItemImg}/>
        <div>
            <Typography type={"title6"} value={name}/>
            <Typography type={"text2"} value={formattedDate}/>
            {
                location?.address ?
                    <Typography type={"text2"} color={"textColor2"} value={location.address}/> :
                    null
            }

        </div>
    </Link>
}

const Loading = () => {
    return <div className={classes.page}>
        <Skeleton style={{height: 240}}/>
        <div className={classes.content}>
            <div className={classes.stats}>
                <Skeleton style={{height: 110, flex: 1, borderRadius: 16}}/>
                <Skeleton style={{height: 110, flex: 1, borderRadius: 16}}/>
                <Skeleton style={{height: 110, flex: 1, borderRadius: 16}}/>
            </div>

            <Skeleton style={{height: 376, borderRadius: 16}}/>
        </div>
    </div>
}


const SingleUserPage = () => {
    const {id} = useParams()

    const notNilId = getNotNil(id, "SingleUserPage -> id")

    const {data: user, isFetching, isError, refetch, error} = userApi.useGetUserByIdQuery(notNilId)

    if (isError) {
        return <RefetchError refetch={refetch} error={error}/>
    }

    if (isFetching) {
        return <Loading/>
    }

    if (!user) {
        return <Error title={"Хмм..."} text={"Похоже такого пользователя нет"}>
            <Button as={"link"} to={"/leaderboard"}>
                {"Все пользователи"}
            </Button>
        </Error>
    }

    const {
        photo,
        firstName,
        lastName,
        username,
        rating,
        winRate,
        total,
        events
    } = user

    return <div className={classes.page}>
        <div className={classes.top}>
            <ImgWithContainer previewUrl={photo?.url} className={classes.img}/>
            <div className={classes.name}>
                <Typography type={"title3"} value={getUserFullName(firstName, lastName)}/>
                {username ? <a href={`https://t.me/${username?.replace("@", "")}`}
                               rel={"noreferrer noopener"}
                               target={"_blank"}>
                    <Typography type={"text1"} value={username} color={"textColor2"}/>
                </a> : null}
            </div>
        </div>
        <div className={classes.content}>
            <div className={classes.stats}>
                <StatItem icon={ChartIcon} title={"Рейтинг"} value={rating} color={"mainColor"}/>
                <StatItem icon={TrophyIcon} title={"Побед"} value={`${winRate}%`} color={"greenColor"}/>
                <StatItem icon={GamePadIcon} title={"Игр"} value={total} color={"textColor1"}/>
            </div>
            <Block title={"Награды"}>
                <Typography type={"text2"} value={"Нет наград"}/>
            </Block>

            <Block title={"История событий"}>
                {sortByKey(events, "dateTime").map((event) => <HistoryItem {...event} key={event.id}/>)}
            </Block>
        </div>
    </div>
}

export {SingleUserPage}