import classes from "./Layout.module.css";
import { generatePath, NavLink, Outlet } from "react-router-dom";
import { FC } from "react";
import { EMOJI } from "@way-to-bot/shared/src/constants/emoji";
import { WEBAPP_ROUTES } from "@way-to-bot/shared/constants/webappRoutes";
import { MenuOutlined } from "@ant-design/icons";
import { Drawer } from "antd";
import { useActionCreator } from "../Hooks/UseActionCreator";
import { appSlice } from "../Store/App/AppSlice";
import { useSelector } from "react-redux";

interface ILink {
  to: string;
  title: string;
}

const getLinks = (userId: number | undefined): ILink[] => [
  {
    title: EMOJI.calendar,
    to: WEBAPP_ROUTES.eventsRoute,
  },
  {
    title: EMOJI.barChart,
    to: WEBAPP_ROUTES.statisticsRoute,
  },
  {
    title: EMOJI.clipboard,
    to: generatePath(WEBAPP_ROUTES.profileRoute, { id: userId ?? 1 }),
  },
];

const LinkComponent: FC<ILink> = ({ title, to }) => {
  const closeDrawer = useActionCreator(
    appSlice.actions.mainMenuDrawerVisibilityChanged,
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
    appSlice.actions.mainMenuDrawerVisibilityChanged,
    false,
  );

  return (
    <Drawer
      styles={{ body: { padding: 0 } }}
      title="Basic Drawer"
      placement={"left"}
      closable={false}
      open={open}
      onClose={closeDrawer}
      getContainer={false}
    >
      <LinkComponent title={"Users"} to={WEBAPP_ROUTES.manageUsersRoute} />
    </Drawer>
  );
};

const MenuButton = () => {
  const openDrawer = useActionCreator(
    appSlice.actions.mainMenuDrawerVisibilityChanged,
    true,
  );

  return <MenuOutlined className={classes.menuButton} onClick={openDrawer} />;
};

const Layout = () => {
  return (
    <div className={classes.layout}>
      <MenuDrawer />

      <header className={classes.header}>
        <MenuButton />
      </header>

      <div className={classes.content}>
        <Outlet />
      </div>
    </div>
  );
};

export { Layout };
