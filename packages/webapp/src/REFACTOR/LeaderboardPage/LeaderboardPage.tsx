import classes from "./LeaderboardPage.module.css";
import { userApi } from "../User/UserApi";
import { UserListItem } from "../UserListItem/UserListItem";
import { sortByKey } from "../../Utils/SortByKey";
import { BottomSheet } from "../BottomSheet/BottomSheet";
import { Typography } from "../Typography/Typography";

const LeaderboardPage = () => {
  const { data: users } = userApi.useGetAllUsersQuery();

  const sorted = users ? sortByKey(users, "rating") : [];

  return (
    <div className={classes.page}>
      <Typography type={"title2"} value={"Лидерборд"} />

      <BottomSheet title={"Сортировка"}>{"Hello world"}</BottomSheet>

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

export { LeaderboardPage };
