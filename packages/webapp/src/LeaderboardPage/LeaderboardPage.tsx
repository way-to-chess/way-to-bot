import classes from "./LeaderboardPage.module.css";
import {userApi} from "../Store/User/UserApi";
import {UserListItem} from "../UserListItem/UserListItem";
import {BottomSheet, TBottomSheetTrigger} from "../BottomSheet/BottomSheet";
import {Typography} from "../Typography/Typography";
import {Input} from "../Input/Input";
import {ChangeEvent, useRef, useState} from "react";
import {ClientDTOUserGetMany} from "@way-to-bot/shared/api/DTO/client/user.DTO";
import {Skeleton} from "../Skeleton/Skeleton";
import {Error, RefetchError} from "../Error/Error";
import {Options} from "../Options/Options";
import {TCommonGetManyOptions} from "@way-to-bot/shared/api/zod/common/get-many-options.schema";
import clsx from "clsx";
import {ESortDirection} from "@way-to-bot/shared/api/enums/ESortDirection";
import {EOperandPredicate} from "@way-to-bot/shared/api/enums/EOperandPredicate";
import {EPredicate} from "@way-to-bot/shared/api/enums/EPredicate";
import {ArrowDownUpIcon, SearchIcon} from "lucide-react";
import {useEventType} from "../Hooks/UseEventType";
import {EEventType} from "@way-to-bot/shared/api/enums/EEventType";
import {Navigate} from "react-router";

const renderSortButton: TBottomSheetTrigger = (props) => {
    return (
        <button className={classes.sortButton} {...props}>
            <ArrowDownUpIcon size={24} color={"var(--main-color)"}/>
        </button>
    );
};

type TISortOptionValue = [keyof ClientDTOUserGetMany, ESortDirection];

interface ISortOption {
    title: string;
    value: TISortOptionValue;
}

const DEFAULT_SORT_OPTION: ISortOption = {
    title: "Выше рейтинг",
    value: ["rating", ESortDirection.DESC],
};

const SORT_OPTIONS: ISortOption[] = [
    DEFAULT_SORT_OPTION,
    {
        title: "Выше процент побед",
        value: ["winRate", ESortDirection.DESC],
    },
    {
        title: "Больше игр",
        value: ["total", ESortDirection.DESC],
    },
] as const;

const FAKE_USERS = Array(10).fill(null);

const Loading = () => {
    return (
        <div className={classes.users}>
            <Skeleton style={{height: 60, borderRadius: 12}}/>
            <Skeleton style={{height: 60, borderRadius: 12}}/>
            <Skeleton style={{height: 60, borderRadius: 12, marginBottom: 16}}/>
            {FAKE_USERS.map((_, i) => (
                <Skeleton key={i} style={{height: 60, borderRadius: 12}}/>
            ))}
        </div>
    );
};

const Page = () => {
    const [sort, setSort] = useState<TISortOptionValue>(
        DEFAULT_SORT_OPTION.value,
    );
    const [searchValue, setSearchValue] = useState("");
    const [open, setOpen] = useState(false);
    const timeout = useRef<ReturnType<typeof setTimeout>>();

    const onSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (timeout.current) {
            clearTimeout(timeout.current);
        }

        timeout.current = setTimeout(() => {
            setSearchValue(e.target.value);
        }, 1000);
    };
    const options: TCommonGetManyOptions = {
        sort: {
            field: sort[0],
            direction: sort[1],
        },
        where: {
            predicate: EPredicate.AND,
            operands: [
                {
                    field: "tgId",
                    predicate: EOperandPredicate.NOT_EQ,
                    value: null,
                },
            ],
        },
    };

    const searchValueToSend = searchValue.trim();

    if (searchValueToSend) {
        options.where = {
            predicate: EPredicate.AND,
            operands: [
                {
                    field: "tgId",
                    predicate: EOperandPredicate.NOT_EQ,
                    value: null,
                },
                {
                    field: ["firstName", "lastName", "username"],
                    predicate: EOperandPredicate.LIKE,
                    value: searchValueToSend,
                },
            ],
        };
    }

    const {
        data: users,
        isFetching,
        isError,
        refetch,
        error,
    } = userApi.useGetAllUsersQuery(options);

    if (isError) {
        const onRefetch = () => {
            setSearchValue("");
            refetch();
        };

        return <RefetchError refetch={onRefetch} error={error}/>;
    }

    const onValueChange = (value: unknown) => {
        setSort(value as TISortOptionValue);
        setOpen(false);
    };

    return (
        <div className={classes.page}>
            <div className={classes.top}>
                <Input
                    placeholder={"Найти участника"}
                    before={<SearchIcon size={24} color={"#D9DDE6"}/>}
                    onChange={onSearchChange}
                    type={"search"}
                    enterKeyHint={"search"}
                    maxLength={30}
                />

                <BottomSheet
                    title={"Сортировка"}
                    trigger={renderSortButton}
                    open={open}
                    onOpenChange={setOpen}
                >
                    <Options
                        options={SORT_OPTIONS}
                        value={sort}
                        onValueChange={onValueChange}
                    />
                </BottomSheet>
            </div>
            {isFetching ? (
                <Loading/>
            ) : (
                <div className={classes.users}>
                    {users?.length ? (
                        users.map((user, index) => (
                            <UserListItem
                                {...user}
                                prefix={searchValue ? null : index + 1}
                                postfix={
                                    <Typography type={"title4"} value={String(user[sort[0]])}/>
                                }
                                className={clsx(classes.user, !searchValue && classes.colored)}
                                key={user.id}
                            />
                        ))
                    ) : (
                        <Error
                            title={"Ничего не нашли"}
                            text={"Имя или фамилия должны точно совпадать"}
                        />
                    )}
                </div>
            )}
        </div>
    );
};

const LeaderboardPage = () => {
    const eventType = useEventType()


    return eventType === EEventType.CHESS ? <Page/> : <Navigate to={`/${eventType}/events`}/>
}

export {LeaderboardPage};
