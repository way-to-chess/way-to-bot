import classes from "./BottomNavBar.module.css";
import { EventsIcon } from "../../Icons/EventsIcon";
import { LeaderboardIcon } from "../../Icons/LeaderboardIcon";
import { ProfileIcon } from "../../Icons/ProfileIcon";
import { NavLink } from "react-router";
import { FC, ReactNode } from "react";

interface INavBarItem {
  title: string;
  icon: ReactNode;
  path: string;
}

const NAV_BAR_ITEMS: INavBarItem[] = [
  {
    icon: EventsIcon,
    title: "События",
    path: "/events",
  },
  {
    icon: LeaderboardIcon,
    title: "Лидерборд",
    path: "/leaderboard",
  },
  {
    icon: ProfileIcon,
    title: "Профиль",
    path: "/profile",
  },
];

const NavBarItem: FC<INavBarItem> = ({ title, icon, path }) => {
  return (
    <NavLink to={path} className={classes.item}>
      {icon}
      {title}
    </NavLink>
  );
};

const BottomNavBar = () => {
  return (
    <nav className={classes.bottom}>
      {NAV_BAR_ITEMS.map((item, index) => (
        <NavBarItem {...item} key={index} />
      ))}
    </nav>
  );
};

export { BottomNavBar };
