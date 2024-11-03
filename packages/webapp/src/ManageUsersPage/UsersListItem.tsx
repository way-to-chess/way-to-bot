import { memo } from "react";
import { IUser } from "@way-to-bot/shared/interfaces/user.interface";
import { withProps } from "../Utils/WithProps";
import { generatePath, Link } from "react-router-dom";
import { WEBAPP_ROUTES } from "@way-to-bot/shared/constants/webappRoutes";
import { Avatar, Flex } from "antd";
import { UserOutlined } from "@ant-design/icons";

const UsersListItem = memo<IUser & { index: number }>(({ index, ...user }) => {
  return (
    <Flex
      gap={8}
      align={"center"}
      component={withProps(Link)({
        to: `/${generatePath(WEBAPP_ROUTES.manageUsersIdRoute, { userId: user.id })}`,
      })}
      style={{ color: "black" }}
    >
      <div style={{ fontWeight: "bold" }}>{index + 1}</div>

      <Avatar size={"large"} src={user.photo?.url} icon={<UserOutlined />} />

      <Flex vertical flex={1}>
        <div style={{ fontWeight: "bold" }}>
          {user.firstName + " " + user.lastName}
        </div>

        <div style={{ color: "grey" }}>{user.username}</div>
      </Flex>

      <div>{user.rating}</div>
    </Flex>
  );
});

export { UsersListItem };
