import classes from "./LeaderboardPage.module.css";
import {userApi} from "../User/UserApi";
import {UserListItem} from "../UserListItem/UserListItem";
import {sortByKey} from "../../Utils/SortByKey";
import {BottomSheet, TBottomSheetTrigger} from "../BottomSheet/BottomSheet";
import {Typography} from "../Typography/Typography";
import {Input} from "../Input/Input";
import {SearchIcon} from "../Icons/SearchIcon";
import {SortIcon} from "../Icons/SortIcon";
import {Radio, RadioGroup} from "@base-ui-components/react";
import {ESortDirection} from "../../Models/ESortDirection";
import {useState} from "react";
import {ClientDTOUserGetMany} from "@way-to-bot/shared/api/DTO/client/user.DTO";

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

const UsersList = () => {

}

const LeaderboardPage = () => {
    const {data: users} = userApi.useGetAllUsersQuery();

    const [sort, setSort] = useState<TISortOptionValue>(DEFAULT_SORT_OPTION.value)

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
                    <RadioGroup className={classes.options} value={sort} onValueChange={onValueChange}>
                        {SORT_OPTIONS.map(({title, value}) => (
                            <label className={classes.option}>
                                <Typography type={"title6"} value={title}/>
                                <Radio.Root value={value} className={classes.radio}>
                                    <Radio.Indicator className={classes.indicator}/>
                                </Radio.Root>
                            </label>
                        ))}
                    </RadioGroup>
                </BottomSheet>
            </div>


            <div className={classes.users}>
                {sorted.map((user, index) => (
                    <UserListItem
                        {...user}
                        prefix={index + 1}
                        className={classes.user}
                        key={user.id}
                    />
                ))}
            </div>
        </div>
    );
};

export {LeaderboardPage};
