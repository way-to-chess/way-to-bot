import { Avatar, Empty, Flex, List, Typography } from "antd";
import { Navigate, useParams } from "react-router-dom";
import { useParamSelector } from "../Hooks/UseParamSelector";
import { userSlice } from "../Store/User/UserSlice";
import { UserOutlined } from "@ant-design/icons";
import { getUserFullName } from "@way-to-bot/shared/utils/GetUserFullName";
import { WEBAPP_ROUTES } from "@way-to-bot/shared/constants/webappRoutes";
import { TEXT } from "@way-to-bot/shared/constants/text";
import { getPreviewSrc } from "@way-to-bot/shared/utils/GetPreviewSrc";
import { requestManagerSlice } from "../Store/RequestManager/RequestManagerSlice";
import { GET_USER_BY_ID_REQUEST_SYMBOL } from "../Store/User/UserVariables";
import { useSelector } from "react-redux";
import { IUser } from "@way-to-bot/shared/interfaces/user.interface";
import { IWithId } from "@way-to-bot/shared/interfaces/with.interface";

const UserPageBase = ({
  isLoading,
  ...user
}: IUser & { isLoading?: boolean }) => {
  return (
    <List style={{ padding: 16 }} itemLayout={"vertical"} loading={isLoading}>
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
            <div style={{ color: "green" }}>{`${TEXT.wins}: ${user.wins}`}</div>
            <div>{`${TEXT.draws}: ${user.draws}`}</div>
            <div
              style={{ color: "red" }}
            >{`${TEXT.loses}: ${user.losses}`}</div>
          </Flex>

          <div>{`${TEXT.total}: ${user.total}`}</div>
          <div>{`${TEXT.winRate}: ${user.winRate}`}</div>
          <div>{`${TEXT.rating}: ${user.rating}`}</div>
        </Flex>
      </List.Item>

      <List.Item>
        <Empty description={TEXT.underDevelopment} />
      </List.Item>
    </List>
  );
};

const MyUserPage = () => {
  const user = useSelector(userSlice.selectors.user);

  if (!user) {
    return <Navigate to={`/${WEBAPP_ROUTES.registrationRoute}`} replace />;
  }

  return <UserPageBase {...user} />;
};

const UserPage = ({ id }: IWithId) => {
  const user = useParamSelector(userSlice.selectors.userById, id);
  const isLoading = useParamSelector(
    requestManagerSlice.selectors.loadingBySymbol,
    GET_USER_BY_ID_REQUEST_SYMBOL,
  );

  if (!user) {
    return <Empty />;
  }

  return <UserPageBase isLoading={isLoading} {...user} />;
};

const ManageUsersIdPage = () => {
  const { userId } = useParams();

  const myUserId = useSelector(userSlice.selectors.userId);

  if (myUserId === userId) {
    return <MyUserPage />;
  }

  return <UserPage id={Number(userId)} />;
};

export { ManageUsersIdPage };
