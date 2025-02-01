import { memo } from "react";
import { IUser } from "@way-to-bot/shared/interfaces/user.interface";
import { withProps } from "../Utils/WithProps";
import { generatePath, Link } from "react-router-dom";
import { WEBAPP_ROUTES } from "@way-to-bot/shared/constants/webappRoutes";
import { Avatar, Flex, Typography } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { getPreviewSrc } from "@way-to-bot/shared/utils/GetPreviewSrc";
import { getUserFullName } from "@way-to-bot/shared/utils/GetUserFullName";

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
      <Typography.Text style={{ fontWeight: "bold" }}>
        {index + 1}
      </Typography.Text>

      <Avatar
        size={"large"}
        src={getPreviewSrc(user.photo?.url)}
        icon={<UserOutlined />}
      />

      <Flex vertical flex={1}>
        <Typography.Text style={{ fontWeight: "bold" }}>
          {getUserFullName(user.firstName, user.lastName)}
        </Typography.Text>

        <div style={{ color: "grey" }}>{user.username}</div>
      </Flex>

      <Typography.Text>{user.rating}</Typography.Text>
    </Flex>
  );
});

export { UsersListItem };
