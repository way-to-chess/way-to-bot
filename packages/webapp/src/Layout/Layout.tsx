import classes from "./Layout.module.css";
import { NavLink, Outlet, Route, Routes } from "react-router-dom";
import { FC } from "react";
import { WEBAPP_ROUTES } from "@way-to-bot/shared/constants/webappRoutes";
import {
  MenuOutlined,
  MoreOutlined,
  PlusOutlined,
  UserAddOutlined,
  UsergroupAddOutlined,
} from "@ant-design/icons";
import { Drawer, Dropdown, MenuProps } from "antd";
import { useActionCreator } from "../Hooks/UseActionCreator";
import { appSlice } from "../Store/App/AppSlice";
import { useSelector } from "react-redux";
import { TEXT } from "@way-to-bot/shared/constants/text";
import { userSlice } from "../Store/User/UserSlice";
import { eventsSlice } from "../Store/Events/EventsSlice";
import { locationsSlice } from "../Store/Locations/LocationsSlice";
import { drawerSlice, EDrawerType } from "../Store/Drawer/DrawerSlice";

interface ILink {
  to: string;
  title: string;
}

const LinkComponent: FC<ILink> = ({ title, to }) => {
  const closeDrawer = useActionCreator(
    appSlice.actions.mainMenuDrawerVisibleChanged,
    false,
  );

  return (
    <NavLink to={to} className={classes.link} onClick={closeDrawer}>
      {title}
    </NavLink>
  );
};

const MenuDrawer = () => {
  const open = useSelector(appSlice.selectors.mainMenuDrawerVisible);
  const closeDrawer = useActionCreator(
    appSlice.actions.mainMenuDrawerVisibleChanged,
    false,
  );

  return (
    <Drawer
      title={TEXT.mainMenu.title}
      styles={{ body: { padding: 0 } }}
      placement={"left"}
      closable={false}
      open={open}
      onClose={closeDrawer}
      getContainer={false}
    >
      <LinkComponent
        title={TEXT.mainMenu.users}
        to={WEBAPP_ROUTES.manageUsersRoute}
      />
      <LinkComponent
        title={TEXT.mainMenu.events}
        to={WEBAPP_ROUTES.manageEventsRoute}
      />
      <LinkComponent
        title={TEXT.mainMenu.locations}
        to={WEBAPP_ROUTES.manageLocationsRoute}
      />
      <LinkComponent
        title={TEXT.mainMenu.leagues}
        to={WEBAPP_ROUTES.manageLeaguesRoute}
      />
    </Drawer>
  );
};

const MenuButton = () => {
  const openDrawer = useActionCreator(
    appSlice.actions.mainMenuDrawerVisibleChanged,
    true,
  );

  return <MenuOutlined className={classes.headerButton} onClick={openDrawer} />;
};

const AddUserButton = () => {
  const openDrawer = useActionCreator(
    userSlice.actions.manageUsersDrawerVisibilityChanged,
    true,
  );

  return <PlusOutlined className={classes.headerButton} onClick={openDrawer} />;
};

const AddLocationButton = () => {
  const openDrawer = useActionCreator(
    locationsSlice.actions.manageLocationsDrawerVisibilityChanged,
    true,
  );

  return <PlusOutlined className={classes.headerButton} onClick={openDrawer} />;
};

const AddEventButton = () => {
  const openDrawer = useActionCreator(
    eventsSlice.actions.manageEventsDrawerVisibilityChanged,
    true,
  );

  return <PlusOutlined className={classes.headerButton} onClick={openDrawer} />;
};

const AddUserToEventButton = () => {
  return (
    <span>
      <UserAddOutlined />
      &nbsp;
      {TEXT.manageEvents.addUser}
    </span>
  );
};

const AddLeagueToEventButton = () => {
  return (
    <span>
      <UsergroupAddOutlined />
      &nbsp;
      {TEXT.manageEvents.addLeague}
    </span>
  );
};

const EVENT_MENU_ITEMS: MenuProps["items"] = [
  { key: 1, label: <AddUserToEventButton /> },
  { key: 2, label: <AddLeagueToEventButton /> },
];

const EventMenuButton = () => {
  return (
    <Dropdown
      menu={{ items: EVENT_MENU_ITEMS }}
      placement="bottomRight"
      trigger={["click"]}
    >
      <MoreOutlined className={classes.headerButton} />
    </Dropdown>
  );
};

const AddLeagueButton = () => {
  const openDrawer = useActionCreator(drawerSlice.actions.openDrawer, {
    drawerType: EDrawerType.MANAGE_LEAGUES_DRAWER,
  });

  return <PlusOutlined className={classes.headerButton} onClick={openDrawer} />;
};

const Layout = () => {
  return (
    <div className={classes.layout}>
      <MenuDrawer />

      <header className={classes.header}>
        <MenuButton />

        <Routes>
          <Route
            path={WEBAPP_ROUTES.manageUsersRoute}
            element={<AddUserButton />}
          />

          <Route
            path={WEBAPP_ROUTES.manageEventsRoute}
            element={<AddEventButton />}
          />

          <Route
            path={WEBAPP_ROUTES.manageEventsIdRoute}
            element={<EventMenuButton />}
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
      </header>

      <div className={classes.content}>
        <Outlet />
      </div>
    </div>
  );
};

export { Layout };
