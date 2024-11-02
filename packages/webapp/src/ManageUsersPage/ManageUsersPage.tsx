import { Avatar, Button, Flex, List, Modal } from "antd";
import { MangeUsersDrawer } from "./MangeUsersDrawer";
import { TEXT } from "@way-to-bot/shared/constants/text";
import { userSlice } from "../Store/User/UserSlice";
import { useActionCreator } from "../Hooks/UseActionCreator";
import { FC, useCallback } from "react";
import { IUserDeletePayload } from "@way-to-bot/shared/interfaces/user.interface";
import { ExclamationCircleFilled, UserOutlined } from "@ant-design/icons";
import { generatePath, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { withProps } from "../Utils/WithProps";
import { WEBAPP_ROUTES } from "@way-to-bot/shared/constants/webappRoutes";

const EditButton = () => {
  const open = useActionCreator(
    userSlice.actions.manageUsersDrawerVisibilityChanged,
    true,
  );

  return <Button onClick={open}>{TEXT.usersList.edit}</Button>;
};

const DeleteButton: FC<IUserDeletePayload> = ({ userId }) => {
  const deleteUser = useActionCreator(userSlice.actions.deleteUser, { userId });

  const showDeleteConfirm = useCallback(() => {
    return Modal.confirm({
      title: TEXT.usersList.deleteWarn,
      icon: <ExclamationCircleFilled />,
      okText: TEXT.common.yes,
      okType: "danger",
      cancelText: TEXT.common.no,
      onOk: deleteUser,
    });
  }, [deleteUser]);

  return (
    <Button onClick={showDeleteConfirm} danger>
      {TEXT.usersList.delete}
    </Button>
  );
};

const ManageUsersPage = () => {
  const users = useSelector(userSlice.selectors.users);

  return (
    <>
      <MangeUsersDrawer />
      <List
        style={{ padding: 16 }}
        dataSource={users}
        itemLayout={"vertical"}
        renderItem={(item, index) => (
          <List.Item>
            <Flex vertical gap={8}>
              <Flex
                gap={8}
                align={"center"}
                component={withProps(Link)({
                  to: `/${generatePath(WEBAPP_ROUTES.manageUsersIdRoute, { userId: item.id })}`,
                })}
                style={{ color: "black" }}
              >
                <div style={{ fontWeight: "bold" }}>{index + 1}</div>

                <Avatar
                  size={"large"}
                  src={item.photo?.url}
                  icon={<UserOutlined />}
                />

                <Flex vertical flex={1}>
                  <div style={{ fontWeight: "bold" }}>
                    {item.firstName + " " + item.lastName}
                  </div>

                  <div style={{ color: "grey" }}>{item.username}</div>
                </Flex>

                <div>{item.rating}</div>
              </Flex>
              <Flex gap={8} justify={"flex-end"}>
                <EditButton key={1} />
                <DeleteButton key={2} userId={item.id} />
              </Flex>
            </Flex>
          </List.Item>
        )}
      />
    </>
  );
};

export { ManageUsersPage };
