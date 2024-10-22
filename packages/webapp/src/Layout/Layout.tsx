import classes from "./Layout.module.css";
import { generatePath, NavLink, Outlet } from "react-router-dom";
import { FC } from "react";
import { EMOJI } from "@way-to-bot/shared/src/constants/emoji";
import { useSelector } from "react-redux";
import { userInfoUserIdSelector } from "../Store/User/UserSelectors";
import { WEBAPP_ROUTES } from "@way-to-bot/shared/src/constants/webappRoutes";

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
  return (
    <NavLink to={to} className={classes.link}>
      {title}
    </NavLink>
  );
};

const Layout = () => {
  const userId = useSelector(userInfoUserIdSelector);

  return (
    <div className={classes.layout}>
      <div className={classes.content}>
        <Outlet />
      </div>
      <div className={classes.bottomNavigation}>
        {getLinks(userId).map((link) => (
          <LinkComponent {...link} key={link.to} />
        ))}
      </div>
    </div>
  );
};

export { Layout };
