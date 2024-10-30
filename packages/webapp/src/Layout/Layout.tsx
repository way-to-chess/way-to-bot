import classes from "./Layout.module.css";
import { NavLink, Outlet, Route, Routes } from "react-router-dom";
import { FC } from "react";
import { WEBAPP_ROUTES } from "@way-to-bot/shared/constants/webappRoutes";
import { MenuOutlined, PlusOutlined } from "@ant-design/icons";
import { Drawer } from "antd";
import { useActionCreator } from "../Hooks/UseActionCreator";
import { appSlice } from "../Store/App/AppSlice";
import { useSelector } from "react-redux";
import { TEXT } from "@way-to-bot/shared/constants/text";
import { userSlice } from "../Store/User/UserSlice";

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
    userSlice.actions.createUserDrawerVisibilityChanged,
    true,
  );

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
        </Routes>
      </header>

      <div className={classes.content}>
        <Outlet />
      </div>
    </div>
  );
};

export { Layout };
