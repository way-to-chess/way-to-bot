import { TEXT } from "@way-to-bot/shared/constants/text";
import { userSlice } from "../Store/User/UserSlice";
import { useActionCreator } from "../Hooks/UseActionCreator";
import { FC, useCallback } from "react";
import {
  IUser,
  IUserDeletePayload,
} from "@way-to-bot/shared/interfaces/user.interface";
import { ExclamationCircleFilled } from "@ant-design/icons";
import { useSelector } from "react-redux";
import { requestManagerSlice } from "../Store/RequestManager/RequestManagerSlice";
import { USERS_LOAD_REQUEST_SYMBOL } from "../Store/User/UserVariables";
import { useParamSelector } from "../Hooks/UseParamSelector";
import { drawerSlice, EDrawerType } from "../Store/Drawer/DrawerSlice";
import {
  Button,
  CircularProgress,
  Listbox,
  ListboxItem,
  User,
} from "@nextui-org/react";
import { generatePath, Link } from "react-router-dom";
import { WEBAPP_ROUTES } from "@way-to-bot/shared/constants/webappRoutes";
import { getUserFullName } from "../Utils/GetUserFullName";
import { getPreviewSrc } from "../Utils/GetPreviewSrc";
import { Modal } from "antd";
import { ERequestStatus } from "../Store/RequestManager/RequestManagerModels";

const EditButton: FC<IUser> = (user) => {
  const open = useActionCreator(drawerSlice.actions.openDrawer, {
    drawerType: EDrawerType.MANAGE_USERS_DRAWER,
    data: user,
  });

  return (
    <Button onClick={open} variant={"light"}>
      {TEXT.common.edit}
    </Button>
  );
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
    <Button onClick={showDeleteConfirm} variant={"light"} color={"danger"}>
      {TEXT.common.delete}
    </Button>
  );
};

const ManageUsersPage = () => {
  const status = useParamSelector(
    requestManagerSlice.selectors.statusBySymbol,
    USERS_LOAD_REQUEST_SYMBOL,
  );
  const users = useSelector(userSlice.selectors.users);

  if (status === ERequestStatus.loading) {
    return (
      <div className={"w-full h-screen flex justify-center items-center"}>
        <CircularProgress color="secondary" />
      </div>
    );
  }

  return (
    <Listbox variant={"light"}>
      {users.map((user, index) => {
        const to = `/${generatePath(WEBAPP_ROUTES.manageUsersIdRoute, { userId: user.id })}`;

        return (
          <ListboxItem
            as={Link}
            to={to}
            key={user.id}
            startContent={index + 1}
            endContent={user.rating}
          >
            <User
              name={getUserFullName(user.firstName, user.lastName)}
              description={user.username}
              avatarProps={{
                src: getPreviewSrc(user.photo?.url),
                isBordered: true,
              }}
            />
          </ListboxItem>
        );
      })}
    </Listbox>
  );
};

export { ManageUsersPage };
