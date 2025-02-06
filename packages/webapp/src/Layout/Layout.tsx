import classes from "./Layout.module.css";
import {
  generatePath,
  NavLink,
  Outlet,
  Route,
  Routes,
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
import { Button, Dropdown, Flex, Layout as AntLayout, Typography } from "antd";
import { useActionCreator } from "../Hooks/UseActionCreator";
import { useSelector } from "react-redux";
import { TEXT } from "@way-to-bot/shared/constants/text";
import { userSlice } from "../Store/User/UserSlice";
import { locationsSlice } from "../Store/Locations/LocationsSlice";
import { drawerSlice, EDrawerType } from "../Store/Drawer/DrawerSlice";
import { ACL } from "../ACL/ACL";
import { EUserRole } from "@way-to-bot/shared/enums";

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

const ICON_STYLE = { fontSize: 20 };

const UserAccountButton = () => {
  const userId = useSelector(userSlice.selectors.userId);

  const to = userId
    ? generatePath(WEBAPP_ROUTES.manageUsersIdRoute, { userId })
    : WEBAPP_ROUTES.registrationRoute;

  return (
    <NavLink to={to} className={classes.link} end>
      <Flex vertical align={"center"}>
        <UserOutlined size={60} style={ICON_STYLE} />
        <Typography>{TEXT.profile}</Typography>
      </Flex>
    </NavLink>
  );
};

const LINKS = [
  {
    to: WEBAPP_ROUTES.manageEventsRoute,
    title: TEXT.events,
    icon: <NotificationOutlined style={ICON_STYLE} />,
  },
  {
    to: WEBAPP_ROUTES.manageUsersRoute,
    title: TEXT.users,
    icon: <TeamOutlined style={ICON_STYLE} />,
  },
];

const BottomNavBar = () => {
  return (
    <div className={classes.header}>
      {LINKS.map((link) => (
        <NavLink key={link.to} to={link.to} className={classes.link} end>
          <Flex vertical align={"center"}>
            {link.icon}
            <Typography.Text>{link.title}</Typography.Text>
          </Flex>
        </NavLink>
      ))}
      <UserAccountButton />
    </div>
  );
};

const Layout = () => {
  return (
    <AntLayout className={classes.layout}>
      <header className={classes.header}>
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
