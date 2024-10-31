import { Avatar, Button, List, Modal } from "antd";
import { MangeUserDrawer } from "./MangeUserDrawer";
import { TEXT } from "@way-to-bot/shared/constants/text";
import { userSlice } from "../Store/User/UserSlice";
import { useActionCreator } from "../Hooks/UseActionCreator";
import { FC, useCallback } from "react";
import { IUserDeletePayload } from "@way-to-bot/shared/interfaces/user.interface";
import { ExclamationCircleFilled } from "@ant-design/icons";

const data = [
  {
    title: "Ant Design Title 1",
    userId: 1,
  },
  {
    title: "Ant Design Title 2",
    userId: 2,
  },
  {
    title: "Ant Design Title 3",
    userId: 3,
  },
  {
    title: "Ant Design Title 4",
    userId: 4,
  },
];

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
  return (
    <>
      <MangeUserDrawer />
      <List
        style={{ padding: 16 }}
        itemLayout="vertical"
        dataSource={data}
        renderItem={(item, index) => (
          <List.Item
            actions={[
              <EditButton key={1} />,
              <DeleteButton key={2} userId={item.userId} />,
            ]}
          >
            <List.Item.Meta
              avatar={
                <Avatar
                  size={"small"}
                  src={`https://api.dicebear.com/7.x/miniavs/svg?seed=${index}`}
                />
              }
              title={<a href="https://ant.design">{item.title}</a>}
              description="Ant Design, a design language for background applications, is refined by Ant UED Team"
            />
          </List.Item>
        )}
      />
    </>
  );
};

export { ManageUsersPage };
