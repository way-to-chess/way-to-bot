import { Avatar, Card, Flex, Result, Skeleton, Space, Typography } from "antd";
import { numberFormatter } from "../Utils/NumberFormatter.ts";
import { EditOutlined, UserOutlined } from "@ant-design/icons";
import { useSelector } from "react-redux";
import {
  userInfoUserIdSelector,
  userProfilePageErrorNotNilSelector,
  userProfilePageNotNilSelector,
  userSelectors,
} from "../Store/User/UserSelectors.ts";
import { ComponentType, createElement, Fragment } from "react";
import { withProps } from "../Utils/WithProps.ts";
import { generatePath, Link } from "react-router-dom";
import { WEBAPP_ROUTES } from "@way-to-bot/shared/constants/webappRoutes.ts";
import { ERequestStatus } from "../Store/RequestManager/RequestManagerModels.ts";

const Error = () => {
  const error = useSelector(userProfilePageErrorNotNilSelector);

  return (
    <Result
      status={"error"}
      title={error}
      subTitle={"Это может произойти например, если вашего id нет в базе"}
    />
  );
};

const ProfilePageSuccess = () => {
  const profilePage = useSelector(userProfilePageNotNilSelector);
  const userId = useSelector(userInfoUserIdSelector);

  const {
    id,
    goals,
    losses,
    Elo,
    winRate,
    wins,
    name,
    surname,
    assists,
    draws,
    total,
    username,
  } = profilePage;

  return (
    <Flex vertical style={{ padding: 10 }}>
      <Typography.Title level={2}>{"Profile"}</Typography.Title>

      <Card>
        <Space size={16}>
          <Avatar shape={"circle"} icon={<UserOutlined />} size={80} />
          <Typography>
            <Typography.Title
              level={3}
            >{`${name} ${surname}`}</Typography.Title>
            <Typography.Text>{username}</Typography.Text>
          </Typography>

          {userId === id ? (
            <Link to={generatePath(WEBAPP_ROUTES.updateProfileRoute, { id })}>
              <EditOutlined />
            </Link>
          ) : null}
        </Space>
      </Card>

      <Typography>
        <h5>{`Games: ${total}`}</h5>
        <h5>{`Wins: ${wins}`}</h5>
        <h5>{`Losses: ${losses}`}</h5>
        <h5>{`Draws: ${draws}`}</h5>
        <h5>{`Win Rate: ${numberFormatter.format(winRate)}%`}</h5>
        <h5>{`Goals: ${goals}`}</h5>
        <h5>{`Assists: ${assists}`}</h5>
        <h5>{`Elo: ${Elo}`}</h5>
      </Typography>
    </Flex>
  );
};

const SLICE_STATUS_TO_COMPONENT_TYPE_MAP: Record<
  ERequestStatus,
  ComponentType
> = {
  [ERequestStatus.idle]: Fragment,
  [ERequestStatus.loading]: withProps(Skeleton)({ style: { padding: 16 } }),
  [ERequestStatus.error]: Error,
  [ERequestStatus.success]: ProfilePageSuccess,
};

const ProfilePage = () => {
  const status = useSelector(userSelectors.profilePageStatus);

  return createElement(SLICE_STATUS_TO_COMPONENT_TYPE_MAP[status]);
};

export { ProfilePage };
