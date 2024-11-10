import classes from "./Layout.module.css";
import {
  generatePath,
  Link,
  NavLink,
  Outlet,
  Route,
  Routes,
  useParams,
} from "react-router-dom";
import { FC } from "react";
import { WEBAPP_ROUTES } from "@way-to-bot/shared/constants/webappRoutes";
import { MenuOutlined, PlusOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Drawer } from "antd";
import { useActionCreator } from "../Hooks/UseActionCreator";
import { appSlice } from "../Store/App/AppSlice";
import { useSelector } from "react-redux";
import { TEXT } from "@way-to-bot/shared/constants/text";
import { userSlice } from "../Store/User/UserSlice";
import { locationsSlice } from "../Store/Locations/LocationsSlice";
import { drawerSlice, EDrawerType } from "../Store/Drawer/DrawerSlice";
import { ACL } from "../ACL/ACL";
import { EUserRole } from "@way-to-bot/shared/enums";

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
      <Button
        type={"text"}
        style={{ width: "100%", justifyContent: "left", height: "100%" }}
      >
        {title}
      </Button>
    </NavLink>
  );
};

const MenuDrawer = () => {
  const open = useSelector(appSlice.selectors.mainMenuDrawerVisible);
  const closeDrawer = useActionCreator(
    appSlice.actions.mainMenuDrawerVisibleChanged,
    false,
  );

  const userFullName = useSelector(userSlice.selectors.userFullName);

  return (
    <Drawer
      title={userFullName ?? TEXT.mainMenu.title}
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
      <ACL roles={[EUserRole.ADMIN]}>
        <LinkComponent
          title={TEXT.mainMenu.leagues}
          to={WEBAPP_ROUTES.manageLeaguesRoute}
        />
      </ACL>
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
  const openDrawer = useActionCreator(drawerSlice.actions.openDrawer, {
    drawerType: EDrawerType.MANAGE_EVENTS_DRAWER,
  });

  return <PlusOutlined className={classes.headerButton} onClick={openDrawer} />;
};

const AddUsersToEventButton = () => {
  const params = useParams();

  const openDrawer = useActionCreator(drawerSlice.actions.openDrawer, {
    drawerType: EDrawerType.MANAGE_EVENT_USERS_DRAWER,
    data: { eventId: params.eventId },
  });

  return <PlusOutlined className={classes.headerButton} onClick={openDrawer} />;
};

const AddLeagueButton = () => {
  const openDrawer = useActionCreator(drawerSlice.actions.openDrawer, {
    drawerType: EDrawerType.MANAGE_LEAGUES_DRAWER,
  });

  return <PlusOutlined className={classes.headerButton} onClick={openDrawer} />;
};

const UserAccountButton = () => {
  const userId = useSelector(userSlice.selectors.userId);

  if (!userId) {
    return null;
  }

  const to = generatePath(WEBAPP_ROUTES.manageUsersIdRoute, { userId });

  return (
    <Link to={to}>
      <UserOutlined className={classes.headerButton} />
    </Link>
  );
};

const Layout = () => {
  return (
    <div className={classes.layout}>
      <MenuDrawer />

      <header className={classes.header}>
        <MenuButton />

        <UserAccountButton />

        <ACL roles={[EUserRole.ADMIN]}>
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
    </div>
  );
};

export { Layout };
