import {
  Button,
  Divider,
  Drawer,
  Flex,
  Input,
  List,
  Modal,
  Radio,
  RadioChangeEvent,
  Space,
} from "antd";
import { MangeUsersDrawer } from "./MangeUsersDrawer";
import { TEXT } from "@way-to-bot/shared/constants/text";
import { userSlice } from "../Store/User/UserSlice";
import { useActionCreator } from "../Hooks/UseActionCreator";
import { FC, useCallback } from "react";
import {
  IUser,
  IUserDeletePayload,
} from "@way-to-bot/shared/interfaces/user.interface";
import {
  ExclamationCircleFilled,
  SearchOutlined,
  SwapOutlined,
} from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { UsersListItem } from "./UsersListItem";
import { requestManagerSlice } from "../Store/RequestManager/RequestManagerSlice";
import { USERS_LOAD_REQUEST_SYMBOL } from "../Store/User/UserVariables";
import { useParamSelector } from "../Hooks/UseParamSelector";
import { ERequestStatus } from "../Store/RequestManager/RequestManagerModels";
import { ACL } from "../ACL/ACL";
import { EUserRole } from "@way-to-bot/shared/enums";
import { drawerSlice, EDrawerType } from "../Store/Drawer/DrawerSlice";
import { LAYOUT_STYLE } from "../Variables";
import { useDrawer } from "../Hooks/UseDrawer";
import { EUserSortType } from "../Models/EUserSortType";
import { sortByKey } from "../Utils/SortByKey";
import { ESortDirection } from "../Models/ESortDirection";

const EditButton: FC<IUser> = (user) => {
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

const SORT_TYPE_TO_TEXT_MAP: Record<EUserSortType, string> = {
  [EUserSortType.username]: TEXT.users.sortByUsername,
  [EUserSortType.rating]: TEXT.users.sortByRating,
  [EUserSortType.winRate]: TEXT.users.sortByWinRate,
};

const SORT_TYPE_OPTIONS = Object.values(EUserSortType).map((value) => ({
  value,
  label: SORT_TYPE_TO_TEXT_MAP[value],
}));

const SORT_DIR_TO_TEXT_MAP: Record<ESortDirection, string> = {
  [ESortDirection.asc]: TEXT.common.asc,
  [ESortDirection.desc]: TEXT.common.desc,
};

const SORT_DIR_OPTIONS = Object.values(ESortDirection).map((value) => ({
  value,
  label: SORT_DIR_TO_TEXT_MAP[value],
}));

const SortUsersButton = () => {
  const { trigger, ...drawer } = useDrawer(EDrawerType.SORT_USERS_DRAWER);

  const dispatch = useDispatch();

  const onChangeType = (e: RadioChangeEvent) => {
    dispatch(userSlice.actions.changeSortType(e.target.value));
  };

  const onChangeDir = (e: RadioChangeEvent) => {
    dispatch(userSlice.actions.changeSortDirection(e.target.value));
  };

  const sortType = useSelector(userSlice.selectors.sortType);

  const sortDirection = useSelector(userSlice.selectors.sortDirection);

  return (
    <>
      <Drawer
        placement={"bottom"}
        getContainer={false}
        title={TEXT.users.sortBy}
        height={300}
        {...drawer}
      >
        <Radio.Group value={sortType} onChange={onChangeType}>
          <Space direction={"vertical"}>
            {SORT_TYPE_OPTIONS.map(({ value, label }, index) => (
              <Radio value={value} key={index}>
                {label}
              </Radio>
            ))}
          </Space>
        </Radio.Group>

        <Divider />

        <Radio.Group
          options={SORT_DIR_OPTIONS}
          value={sortDirection}
          onChange={onChangeDir}
        >
          <Space direction={"vertical"}>
            {SORT_DIR_OPTIONS.map(({ value, label }, index) => (
              <Radio value={value} key={index}>
                {label}
              </Radio>
            ))}
          </Space>
        </Radio.Group>
      </Drawer>
      <Button icon={<SwapOutlined />} onClick={trigger} />
    </>
  );
};

const SORT_TYPE_TO_KEY_MAP: Record<EUserSortType, keyof IUser> = {
  [EUserSortType.rating]: "rating",
  [EUserSortType.username]: "username",
  [EUserSortType.winRate]: "winRate",
};

const UsersList = () => {
  const users = useSelector(userSlice.selectors.users);
  const status = useParamSelector(
    requestManagerSlice.selectors.statusBySymbol,
    USERS_LOAD_REQUEST_SYMBOL,
  );

  const sortType = useSelector(userSlice.selectors.sortType);

  const sortDir = useSelector(userSlice.selectors.sortDirection);

  return (
    <List
      loading={status === ERequestStatus.loading}
      dataSource={sortByKey(users, SORT_TYPE_TO_KEY_MAP[sortType], sortDir)}
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
  );
};

const ManageUsersPage = () => {
  return (
    <>
      <MangeUsersDrawer />
      <Flex style={LAYOUT_STYLE} vertical gap={8}>
        <Flex gap={8}>
          <Input prefix={<SearchOutlined />} />
          <SortUsersButton />
        </Flex>
        <UsersList />
      </Flex>
    </>
  );
};

export { ManageUsersPage };
