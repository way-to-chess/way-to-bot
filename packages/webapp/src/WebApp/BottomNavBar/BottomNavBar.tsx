import classes from "./BottomNavBar.module.css";
import {EventsIcon} from "../../Icons/EventsIcon";
import {LeaderboardIcon} from "../../Icons/LeaderboardIcon";
import {NavLink} from "react-router";
import {FC, ReactNode} from "react";
import {authApi} from "@way-to-bot/shared/redux/authApi";
import {UserIcon} from "lucide-react";

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
    const {data: auth} = authApi.useAuthByTelegramQuery({
        tgId: Telegram.WebApp.initDataUnsafe.user?.id,
        username: Telegram.WebApp.initDataUnsafe.user?.username,
    })


    if (auth?.id) {
        const path = `/users/${auth.id}`

        return <NavBarItem path={path} icon={<UserIcon width={29} height={28}/>} title={"Профиль"}/>

    }

    return <span className={classes.item}><UserIcon width={29} height={28}/>{"Профиль"}</span>
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
