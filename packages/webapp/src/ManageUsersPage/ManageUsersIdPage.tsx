import { Avatar, Button, Empty, Flex, List, Typography } from "antd";
import { NavLink, useParams } from "react-router-dom";
import { useParamSelector } from "../Hooks/UseParamSelector";
import { userSlice } from "../Store/User/UserSlice";
import { ArrowLeftOutlined, UserOutlined } from "@ant-design/icons";
import { getUserFullName } from "../Utils/GetUserFullName";
import { WEBAPP_ROUTES } from "@way-to-bot/shared/constants/webappRoutes";
import { TEXT } from "@way-to-bot/shared/constants/text";
import { getPreviewSrc } from "../Utils/GetPreviewSrc";
import { requestManagerSlice } from "../Store/RequestManager/RequestManagerSlice";
import { GET_USER_BY_ID_REQUEST_SYMBOL } from "../Store/User/UserVariables";
import { ERequestStatus } from "../Store/RequestManager/RequestManagerModels";

const ManageUsersIdPage = () => {
  const { userId } = useParams();

  const user = useParamSelector(userSlice.selectors.userById, Number(userId));
  const status = useParamSelector(
    requestManagerSlice.selectors.statusBySymbol,
    GET_USER_BY_ID_REQUEST_SYMBOL,
  );

  if (!user) {
    return <Empty style={{ padding: 16 }} />;
  }

  return (
    <List
      style={{ padding: 16 }}
      itemLayout={"vertical"}
      loading={status === ERequestStatus.loading}
    >
      <List.Item>
        <NavLink to={`/${WEBAPP_ROUTES.manageUsersRoute}`}>
          <Button icon={<ArrowLeftOutlined />} type={"text"}>
            {TEXT.common.users}
          </Button>
        </NavLink>
      </List.Item>

      <List.Item>
        <Flex gap={8}>
          <Avatar
            size={80}
            icon={<UserOutlined />}
            src={getPreviewSrc(user.photo?.url)}
          />

          <Flex vertical style={{ fontSize: 16 }}>
            <Typography.Text style={{ fontWeight: "bold" }}>
              {getUserFullName(user.firstName, user.lastName)}
            </Typography.Text>
            <div style={{ color: "grey" }}>{user.username}</div>
          </Flex>
        </Flex>
      </List.Item>
      <List.Item>
        <Flex vertical gap={8}>
          <Flex gap={8} style={{ fontSize: 20 }}>
            <div
              style={{ color: "green" }}
            >{`${TEXT.users.wins}: ${user.wins}`}</div>
            <div>{`${TEXT.users.draws}: ${user.draws}`}</div>
            <div
              style={{ color: "red" }}
            >{`${TEXT.users.loses}: ${user.losses}`}</div>
          </Flex>

          <div>{`${TEXT.users.total}: ${user.total}`}</div>
          <div>{`${TEXT.users.winRate}: ${user.winRate}`}</div>
          <div>{`${TEXT.users.rating}: ${user.rating}`}</div>
        </Flex>
      </List.Item>

      <List.Item>
        <Empty description={TEXT.common.underDevelopment} />
      </List.Item>
    </List>
  );
};

export { ManageUsersIdPage };
