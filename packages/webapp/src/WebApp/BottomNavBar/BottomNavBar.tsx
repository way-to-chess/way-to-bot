import classes from "./BottomNavBar.module.css";
import {EventsIcon} from "../../Icons/EventsIcon";
import {LeaderboardIcon} from "../../Icons/LeaderboardIcon";
import {ProfileIcon} from "../../Icons/ProfileIcon";
import {NavLink} from "react-router";
import {FC, ReactNode} from "react";
import {useSelector} from "react-redux";
import {authSlice} from "@way-to-bot/shared/redux/authSlice";

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
];

const NavBarItem: FC<INavBarItem> = ({title, icon, path}) => {
    return (
        <NavLink to={path} className={classes.item}>
            {icon}
            {title}
        </NavLink>
    );
};

const ProfileNavBarItem = () => {
    const authId = useSelector(authSlice.selectors.id)

    const path = authId ? `/users/${authId}` : "/profile"

    return <NavBarItem path={path} icon={ProfileIcon} title={"Профиль"}/>
}

const BottomNavBar = () => {
    return (
        <nav className={classes.bottom}>
            {NAV_BAR_ITEMS.map((item, index) => (
                <NavBarItem {...item} key={index}/>
            ))}
            <ProfileNavBarItem/>
        </nav>
    );
};

export {BottomNavBar};
