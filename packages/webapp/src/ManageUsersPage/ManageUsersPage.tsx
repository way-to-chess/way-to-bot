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
import { requestManagerSlice } from "../Store/RequestManager/RequestManagerSlice";
import { USERS_LOAD_REQUEST_SYMBOL } from "../Store/User/UserVariables";
import { useParamSelector } from "../Hooks/UseParamSelector";
import { ERequestStatus } from "../Store/RequestManager/RequestManagerModels";
import { ACL } from "../ACL/ACL";
import { EUserRole } from "@way-to-bot/shared/enums";
import { drawerSlice, EDrawerType } from "../Store/Drawer/DrawerSlice";
import { UserEntity } from "@way-to-bot/shared/entities/user.entity";

const EditButton: FC<UserEntity> = (user) => {
  const open = useActionCreator(drawerSlice.actions.openDrawer, {
    drawerType: EDrawerType.MANAGE_USERS_DRAWER,
    data: user,
  });

  return <Button onClick={open}>{TEXT.common.edit}</Button>;
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
      {TEXT.common.delete}
    </Button>
  );
};

const ManageUsersPage = () => {
  const users = useSelector(userSlice.selectors.users);
  const status = useParamSelector(
    requestManagerSlice.selectors.statusBySymbol,
    USERS_LOAD_REQUEST_SYMBOL,
  );

  return (
    <>
      <MangeUsersDrawer />
      <List
        loading={status === ERequestStatus.loading}
        style={{ padding: 16 }}
        dataSource={users}
        itemLayout={"vertical"}
        renderItem={(item, index) => (
          <List.Item key={item.id}>
            <Flex vertical gap={8}>
              <UsersListItem {...item} index={index} />
              <ACL roles={[EUserRole.ADMIN]}>
                <Flex gap={8} justify={"flex-end"}>
                  <EditButton {...item} />
                  <DeleteButton userId={item.id} />
                </Flex>
              </ACL>
            </Flex>
          </List.Item>
        )}
      />
    </>
  );
};

export { ManageUsersPage };
