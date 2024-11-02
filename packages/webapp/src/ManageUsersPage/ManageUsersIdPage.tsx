import { Avatar, Empty, Flex, List } from "antd";
import { NavLink, useParams } from "react-router-dom";
import { useParamSelector } from "../Hooks/UseParamSelector";
import { userSlice } from "../Store/User/UserSlice";
import { ArrowLeftOutlined, UserOutlined } from "@ant-design/icons";
import { getUserFullName } from "../Utils/GetUserFullName";
import { EventsListItem } from "../ManageEventsPage/EventsListItem";
import { withProps } from "../Utils/WithProps";
import { WEBAPP_ROUTES } from "@way-to-bot/shared/constants/webappRoutes";
import { TEXT } from "@way-to-bot/shared/constants/text";

const ManageUsersIdPage = () => {
  const { userId } = useParams();

  const user = useParamSelector(userSlice.selectors.userById, Number(userId));

  if (!user) {
    return <Empty />;
  }

  return (
    <List style={{ padding: 16 }} itemLayout={"vertical"}>
      <List.Item>
        <Flex
          style={{ color: "black" }}
          gap={8}
          component={withProps(NavLink)({
            to: `/${WEBAPP_ROUTES.manageUsersRoute}`,
          })}
        >
          <ArrowLeftOutlined />

          <div>{TEXT.common.users}</div>
        </Flex>
      </List.Item>

      <List.Item>
        <Flex gap={8}>
          <Avatar size={80} icon={<UserOutlined />} src={user.photo?.url} />

          <Flex vertical style={{ fontSize: 16 }}>
            <div style={{ fontWeight: "bold" }}>
              {getUserFullName(user.firstName, user.lastName)}
            </div>
            <div style={{ color: "grey" }}>{user.username}</div>
          </Flex>
        </Flex>
      </List.Item>
      <List.Item>
        <Flex vertical gap={8}>
          <Flex gap={8} style={{ fontSize: 20 }}>
            <div style={{ color: "green" }}>W {user.wins}</div>
            <div>D {user.draws}</div>
            <div>L {user.losses}</div>
          </Flex>

          <div>
            {"WR"}
            &nbsp;
            {user.winRate}
          </div>
        </Flex>
      </List.Item>

      <List.Item>
        <List
          itemLayout={"vertical"}
          dataSource={user.events}
          renderItem={(event) => <EventsListItem {...event} key={event.id} />}
        />
      </List.Item>
    </List>
  );
};

export { ManageUsersIdPage };
