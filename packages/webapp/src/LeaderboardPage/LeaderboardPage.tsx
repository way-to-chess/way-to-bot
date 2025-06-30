import classes from "./LeaderboardPage.module.css";
import { userApi } from "../Store/User/UserApi";
import { UserListItem } from "../UserListItem/UserListItem";
import { BottomSheet, TBottomSheetTrigger } from "../BottomSheet/BottomSheet";
import { Typography } from "../Typography/Typography";
import { Input } from "../Input/Input";
import { SearchIcon } from "../Icons/SearchIcon";
import { SortIcon } from "../Icons/SortIcon";
import { ChangeEvent, useRef, useState } from "react";
import { ClientDTOUserGetMany } from "@way-to-bot/shared/api/DTO/client/user.DTO";
import { Skeleton } from "../Skeleton/Skeleton";
import { Error, RefetchError } from "../Error/Error";
import { Options } from "../Options/Options";
import { TCommonGetManyOptions } from "@way-to-bot/shared/api/zod/common/get-many-options.schema";
import clsx from "clsx";
import { ESortDirection } from "@way-to-bot/shared/api/enums/ESortDirection";
import { EOperandPredicate } from "@way-to-bot/shared/api/enums/EOperandPredicate";
import { EPredicate } from "@way-to-bot/shared/api/enums/EPredicate";

const renderSortButton: TBottomSheetTrigger = (props) => {
  return (
    <button className={classes.sortButton} {...props}>
      {SortIcon}
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
      <Skeleton style={{ height: 60, borderRadius: 12 }} />
      <Skeleton style={{ height: 60, borderRadius: 12 }} />
      <Skeleton style={{ height: 60, borderRadius: 12, marginBottom: 16 }} />
      {FAKE_USERS.map((_, i) => (
        <Skeleton key={i} style={{ height: 60, borderRadius: 12 }} />
      ))}
    </div>
  );
};

const LeaderboardPage = () => {
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

    return <RefetchError refetch={onRefetch} error={error} />;
  }

  const onValueChange = (value: unknown) => {
    setSort(value as TISortOptionValue);
    setOpen(false);
  };

  return (
    <div className={classes.page}>
      <Typography type={"title2"} value={"Лидерборд"} />

      <div className={classes.top}>
        <Input
          placeholder={"Найти участника"}
          before={SearchIcon}
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
        <Loading />
      ) : (
        <div className={classes.users}>
          {users?.length ? (
            users.map((user, index) => (
              <UserListItem
                {...user}
                prefix={searchValue ? null : index + 1}
                postfix={
                  <Typography type={"title4"} value={String(user[sort[0]])} />
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

export { LeaderboardPage };
