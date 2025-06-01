import classes from "./LeaderboardPage.module.css";
import {userApi} from "../Store/User/UserApi";
import {UserListItem} from "../UserListItem/UserListItem";
import {sortByKey} from "../../Utils/SortByKey";
import {BottomSheet, TBottomSheetTrigger} from "../BottomSheet/BottomSheet";
import {Typography} from "../Typography/Typography";
import {Input} from "../Input/Input";
import {SearchIcon} from "../Icons/SearchIcon";
import {SortIcon} from "../Icons/SortIcon";
import {ESortDirection} from "../../Models/ESortDirection";
import {useState} from "react";
import {ClientDTOUserGetMany} from "@way-to-bot/shared/api/DTO/client/user.DTO";
import {Skeleton} from "../Skeleton/Skeleton";
import {RefetchError} from "../Error/Error";
import {Options} from "../Options/Options";

const renderSortButton: TBottomSheetTrigger = (props) => {
    return <button className={classes.sortButton} {...props}>
        {SortIcon}
    </button>
}

type TISortOptionValue = [keyof ClientDTOUserGetMany, ESortDirection]

interface ISortOption {
    title: string
    value: TISortOptionValue
}

const DEFAULT_SORT_OPTION: ISortOption = {
    title: "Выше рейтинг",
    value: ["rating", ESortDirection.asc]
}

const SORT_OPTIONS: ISortOption[] = [
    DEFAULT_SORT_OPTION,
    {
        title: "Ниже рейтиг",
        value: ["rating", ESortDirection.desc]

    },
    {
        title: "А - Я",
        value: ["lastName", ESortDirection.desc]

    },
    {
        title: "Я - А",
        value: ["lastName", ESortDirection.asc]
    }
] as const


const FAKE_USERS = Array(10).fill(null)

const Loading = () => {
    return <div className={classes.users}>
        <Skeleton style={{height: 60, borderRadius: 12}}/>
        <Skeleton style={{height: 60, borderRadius: 12}}/>
        <Skeleton style={{height: 60, borderRadius: 12, marginBottom: 16}}/>
        {FAKE_USERS.map((_, i) => (<Skeleton style={{height: 60, borderRadius: 12}}/>))}
    </div>
}

const LeaderboardPage = () => {
    const {data: users, isFetching, isError, refetch, error} = userApi.useGetAllUsersQuery();

    const [sort, setSort] = useState<TISortOptionValue>(DEFAULT_SORT_OPTION.value)

    if (isError) {
        return <RefetchError refetch={refetch} error={error}/>
    }

    const sorted = users && sort ? sortByKey(users, ...sort) : [];

    const onValueChange = (value: unknown) => {
        setSort(value as TISortOptionValue)
    }

    return (
        <div className={classes.page}>
            <Typography type={"title2"} value={"Лидерборд"}/>

            <div className={classes.top}>
                <Input placeholder={"Найти участника"} before={SearchIcon}/>

                <BottomSheet title={"Сортировка"} trigger={renderSortButton}>
                    <Options options={SORT_OPTIONS} value={sort} onValueChange={onValueChange}/>
                </BottomSheet>
            </div>
            {
                isFetching ? <Loading/> : <div className={classes.users}>
                    {sorted.map((user, index) => (
                        <UserListItem
                            {...user}
                            prefix={index + 1}
                            className={classes.user}
                            key={user.id}
                        />
                    ))}
                </div>
            }

        </div>
    );
};

export {LeaderboardPage};
