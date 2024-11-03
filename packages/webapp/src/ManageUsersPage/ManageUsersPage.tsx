import { Button, Flex, List, Modal } from "antd";
import { MangeUsersDrawer } from "./MangeUsersDrawer";
import { TEXT } from "@way-to-bot/shared/constants/text";
import { userSlice } from "../Store/User/UserSlice";
import { useActionCreator } from "../Hooks/UseActionCreator";
import { FC, useCallback } from "react";
import { IUserDeletePayload } from "@way-to-bot/shared/interfaces/user.interface";
import { ExclamationCircleFilled } from "@ant-design/icons";
import { useSelector } from "react-redux";
import { UsersListItem } from "./UsersListItem";

const EditButton = () => {
  const open = useActionCreator(
    userSlice.actions.manageUsersDrawerVisibilityChanged,
    true,
  );

  return <Button onClick={open}>{TEXT.users.edit}</Button>;
};

const DeleteButton: FC<IUserDeletePayload> = ({ userId }) => {
  const deleteUser = useActionCreator(userSlice.actions.deleteUser, { userId });

  const showDeleteConfirm = useCallback(() => {
    return Modal.confirm({
      title: TEXT.users.deleteWarn,
      icon: <ExclamationCircleFilled />,
      okText: TEXT.common.yes,
      okType: "danger",
      cancelText: TEXT.common.no,
      onOk: deleteUser,
    });
  }, [deleteUser]);

  return (
    <Button onClick={showDeleteConfirm} danger>
      {TEXT.users.delete}
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
          <List.Item key={item.id}>
            <Flex vertical gap={8}>
              <UsersListItem {...item} index={index} />
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
