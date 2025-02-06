import classes from "./Layout.module.css";
import {
  generatePath,
  Outlet,
  Route,
  Routes,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import { WEBAPP_ROUTES } from "@way-to-bot/shared/constants/webappRoutes";
import {
  MoreOutlined,
  NotificationOutlined,
  PlusOutlined,
  TeamOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Button, Dropdown, Layout as AntLayout } from "antd";
import { useActionCreator } from "../Hooks/UseActionCreator";
import { useSelector } from "react-redux";
import { TEXT } from "@way-to-bot/shared/constants/text";
import { userSlice } from "../Store/User/UserSlice";
import { locationsSlice } from "../Store/Locations/LocationsSlice";
import { drawerSlice, EDrawerType } from "../Store/Drawer/DrawerSlice";
import { ACL } from "../ACL/ACL";
import { EUserRole } from "@way-to-bot/shared/enums";
import { TabBar } from "antd-mobile";

const DEFAULT_BUTTON_PROPS = {
  size: "large",
  type: "text",
} as const;

const USER_MENU_TRIGGER: ("click" | "hover" | "contextMenu")[] = ["click"];

const UsersDropdown = () => {
  const openAddUserDrawer = useActionCreator(drawerSlice.actions.openDrawer, {
    drawerType: EDrawerType.MANAGE_USERS_DRAWER,
  });

  const openSendMessageDrawer = useActionCreator(
    drawerSlice.actions.openDrawer,
    {
      drawerType: EDrawerType.SEND_MESSAGE_DRAWER,
    },
  );

  const menu = {
    items: [
      {
        key: 1,
        label: TEXT.addUser,
        onClick: openAddUserDrawer,
      },
      {
        key: 2,
        label: TEXT.sendMessage,
        onClick: openSendMessageDrawer,
      },
    ],
  };

  return (
    <Dropdown menu={menu} placement={"topRight"} trigger={USER_MENU_TRIGGER}>
      <Button icon={<MoreOutlined />} {...DEFAULT_BUTTON_PROPS} />
    </Dropdown>
  );
};

const AddLocationButton = () => {
  const openDrawer = useActionCreator(
    locationsSlice.actions.manageLocationsDrawerVisibilityChanged,
    true,
  );
  return (
    <Button
      icon={<PlusOutlined />}
      onClick={openDrawer}
      {...DEFAULT_BUTTON_PROPS}
    />
  );
};

const AddEventButton = () => {
  const openDrawer = useActionCreator(drawerSlice.actions.openDrawer, {
    drawerType: EDrawerType.MANAGE_EVENTS_DRAWER,
  });

  return (
    <Button
      icon={<PlusOutlined />}
      onClick={openDrawer}
      {...DEFAULT_BUTTON_PROPS}
    />
  );
};

const AddUsersToEventButton = () => {
  const params = useParams();

  const openDrawer = useActionCreator(drawerSlice.actions.openDrawer, {
    drawerType: EDrawerType.MANAGE_EVENT_USERS_DRAWER,
    data: { eventId: params.eventId },
  });

  return (
    <Button
      icon={<PlusOutlined />}
      onClick={openDrawer}
      {...DEFAULT_BUTTON_PROPS}
    />
  );
};

const AddLeagueButton = () => {
  const openDrawer = useActionCreator(drawerSlice.actions.openDrawer, {
    drawerType: EDrawerType.MANAGE_LEAGUES_DRAWER,
  });

  return (
    <Button
      icon={<PlusOutlined />}
      onClick={openDrawer}
      {...DEFAULT_BUTTON_PROPS}
    />
  );
};

const UserAccountButton = () => {
  const userId = useSelector(userSlice.selectors.userId);

  const key = userId
    ? generatePath(WEBAPP_ROUTES.manageUsersIdRoute, { userId })
    : WEBAPP_ROUTES.registrationRoute;

  return <TabBar.Item icon={<UserOutlined />} title={TEXT.profile} key={key} />;
};

const TABS = [
  {
    key: WEBAPP_ROUTES.manageEventsRoute,
    title: TEXT.events,
    icon: <NotificationOutlined />,
  },
  {
    key: WEBAPP_ROUTES.manageUsersRoute,
    title: TEXT.users,
    icon: <TeamOutlined />,
  },
];

const BottomNavBar = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const onChange = (value: string) => navigate(value);

  const userId = useSelector(userSlice.selectors.userId);

  const profileKey = userId
    ? generatePath(WEBAPP_ROUTES.manageUsersIdRoute, { userId })
    : WEBAPP_ROUTES.registrationRoute;

  return (
    <TabBar safeArea activeKey={pathname.replace("/", "")} onChange={onChange}>
      {TABS.map((item) => (
        <TabBar.Item icon={item.icon} title={item.title} key={item.key} />
      ))}
      <TabBar.Item
        icon={<UserOutlined />}
        title={TEXT.profile}
        key={profileKey}
      />
    </TabBar>
  );
};

const Layout = () => {
  return (
    <AntLayout className={classes.layout}>
      <header className={classes.header}>
        <UserAccountButton />

        <ACL roles={[EUserRole.ADMIN]}>
          <Routes>
            <Route
              path={WEBAPP_ROUTES.manageUsersRoute}
              element={<UsersDropdown />}
            />

            <Route
              path={WEBAPP_ROUTES.manageEventsRoute}
              element={<AddEventButton />}
            />

            <Route
              path={WEBAPP_ROUTES.manageEventsIdRoute}
              element={<AddUsersToEventButton />}
            />

            <Route
              path={WEBAPP_ROUTES.manageLocationsRoute}
              element={<AddLocationButton />}
            />
            <Route
              path={WEBAPP_ROUTES.manageLocationsRoute}
              element={<AddLocationButton />}
            />

            <Route
              path={WEBAPP_ROUTES.manageLeaguesRoute}
              element={<AddLeagueButton />}
            />
          </Routes>
        </ACL>
      </header>

      <div className={classes.content}>
        <Outlet />
      </div>

      <BottomNavBar />
    </AntLayout>
  );
};

export { Layout };
