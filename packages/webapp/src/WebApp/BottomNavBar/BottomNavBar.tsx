import classes from "./BottomNavBar.module.css";
import {FC, ReactNode, useEffect} from "react";
import {authApi} from "@way-to-bot/shared/redux/authApi";
import {CalendarClockIcon, TrophyIcon, UserIcon} from "lucide-react";
import {AppNavLink} from "../../AppLink";
import {EEventType} from "@way-to-bot/shared/api/enums/EEventType";
import {EVENT_TYPE_COLOR_MAP, useEventType} from "../../Hooks/UseEventType";

interface INavBarItem {
    title: string;
    icon: ReactNode;
    path: string;
}


const NavBarItem: FC<INavBarItem> = ({title, icon, path}) => {
    return (
        <AppNavLink to={path} className={classes.item}>
            {icon}
            {title}
        </AppNavLink>
    );
};

const ProfileNavBarItem = () => {
    const {data: auth} = authApi.useAuthByTelegramQuery({
        tgId: Telegram.WebApp.initDataUnsafe.user?.id,
        username: Telegram.WebApp.initDataUnsafe.user?.username,
    })


    if (auth?.id) {
        const path = `/:type/users/${auth.id}`

        return <NavBarItem path={path} icon={<UserIcon width={29} height={28}/>} title={"Профиль"}/>

    }

    return <span className={classes.item}><UserIcon width={29} height={28}/>{"Профиль"}</span>
}

const getNavBarItems = (type: EEventType): ReactNode[] => {
    const items = [
        <NavBarItem path={"/:type/events"} key={1} title={"События"} icon={<CalendarClockIcon/>}/>,
        type === EEventType.CHESS ?
            <NavBarItem path={"/:type/leaderboard"} key={2} title={"Лидерборд"} icon={<TrophyIcon/>}/> : null,
        <ProfileNavBarItem key={3}/>
    ]

    return items.filter(Boolean)
}

const BottomNavBar = () => {
    const eventType = useEventType()

    useEffect(() => {
        if (eventType) {
            document.documentElement.style.setProperty("--main-color", EVENT_TYPE_COLOR_MAP[eventType])
        }
    }, [eventType]);

    if (!eventType) {
        return null
    }

    const navBarItems = getNavBarItems(eventType)

    return (
        <nav className={classes.bottom}>
            {...navBarItems}
        </nav>
    );
};

export {BottomNavBar};
