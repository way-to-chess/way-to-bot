import classes from "./Leaderboard.module.css";
import { FC, useState } from "react";
import { clsx } from "clsx";
import { Skeleton } from "antd";
import { ESortDirection } from "../Models/ESortDirection";
import { sortByKey } from "../Utils/SortByKey";
import { generatePath, Link } from "react-router-dom";
import { WEBAPP_ROUTES } from "@way-to-bot/shared/constants/webappRoutes";
import { useHttpRequestOnMount } from "../Hooks/UseHttpRequestOnMount";
import { EmptyLeaderboard } from "../Empty/Empty";
import { isEmpty } from "../Utils/OneLineUtils";
import { TUser } from "../Models/TUser";
import { numberFormatter } from "../Utils/NumberFormatter";

interface ILeaderboardUser extends TUser {
  place: number;
}

interface IHeadTitle {
  title: string;
  sortKey?: keyof ILeaderboardUser;
}

const HEAD_TITLES: IHeadTitle[] = [
  { title: "#", sortKey: "place" },
  { title: "Name", sortKey: "name" },
  { title: "Elo", sortKey: "Elo" },
  { title: "G", sortKey: "goals" },
  { title: "W/R", sortKey: "winRate" },
];

const normalizeUsers = ({ users }: { users: TUser[] }) => {
  const distributedUsers: ILeaderboardUser[] = [];

  for (let i = 0; i < users.length; i++) {
    const user = users[i];

    if (i === 0) {
      distributedUsers.push({ ...user, place: 1 });
      continue;
    }

    let distributedUserPlace: number | undefined;

    const distributedUsersCount = distributedUsers.length;

    for (let k = 0; k < distributedUsersCount; k++) {
      const distributedUser = distributedUsers[k];
      if (distributedUser.Elo < user.Elo) {
        distributedUserPlace = distributedUser.place;
      }
    }

    if (distributedUserPlace === undefined) {
      distributedUsers.push({
        ...user,
        place: distributedUsersCount + 1,
      });
      continue;
    }

    for (let k = 0; k < distributedUsersCount; k++) {
      if (distributedUsers[k].place < distributedUserPlace) {
        continue;
      }
      distributedUsers[k].place = distributedUsers[k].place + 1;
    }

    distributedUsers.push({ ...user, place: distributedUserPlace });
  }

  return sortByKey(distributedUsers, "place");
};

const Row: FC<ILeaderboardUser> = ({
  id,
  place,
  name,
  surname,
  goals,
  winRate,
  Elo,
}) => {
  return (
    <Link
      to={generatePath(WEBAPP_ROUTES.profileRoute, { id })}
      className={classes.row}
    >
      <span>{place}</span>
      <span>{`${name ?? "No"} ${surname ?? "Name"}`}</span>
      <span>{Elo}</span>
      <span>{goals}</span>
      <span>{`${numberFormatter.format(winRate)}%`}</span>
    </Link>
  );
};

const Leaderboard = () => {
  const [sortDirection, setSortDirection] = useState(ESortDirection.asc);

  const { data: allUsers, setData: setAllUsers } = useHttpRequestOnMount(
    "getAllUsers",
    [],
    normalizeUsers,
  );

  if (allUsers === null || isEmpty(allUsers)) {
    return <EmptyLeaderboard />;
  }

  const onHeadClickHandler = (sortKey: keyof ILeaderboardUser) => {
    return () => {
      setSortDirection((it) =>
        it === ESortDirection.asc ? ESortDirection.desc : ESortDirection.asc,
      );
      setAllUsers(sortByKey(allUsers, sortKey, sortDirection));
    };
  };

  return (
    <div className={classes.leaderboard}>
      <div className={clsx(classes.row, classes.head)}>
        {HEAD_TITLES.map(({ title, sortKey }) => (
          <span
            onClick={sortKey ? onHeadClickHandler(sortKey) : undefined}
            key={title}
          >
            {title}
          </span>
        ))}
      </div>

      <div className={classes.body}>
        {allUsers.length === 0 ? (
          <Skeleton style={{ padding: 20 }} />
        ) : (
          allUsers.map((row) => <Row {...row} key={row.username} />)
        )}
      </div>
    </div>
  );
};

export { Leaderboard };
