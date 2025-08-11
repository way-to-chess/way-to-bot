import classes from "./RootPage.module.css";
import {Typography} from "../Typography/Typography";
import {EEventType} from "@way-to-bot/shared/api/enums/EEventType";
import {Link, useNavigate} from "react-router";
import {FC, useEffect} from "react";
import {ChevronRightIcon} from "lucide-react";
import {EVENT_TYPE_NAME_MAP, EVENT_TYPES, isEventType} from "../Hooks/UseEventType";


interface IEventTypeProps {
    type: EEventType,
}

const EventType: FC<IEventTypeProps> = ({type}) => {
    const to = `/${type}/events`

    const title = EVENT_TYPE_NAME_MAP[type]

    const store = () => {
        localStorage.setItem("lastSelectedType", type)
    }

    return <Link to={to} className={classes.type} onClick={store}>

        <Typography type={"title4"} value={title} className={classes.typeTitle}/>

        <ChevronRightIcon/>
    </Link>
}


const RootPage = () => {
    const navigate = useNavigate()

    useEffect(() => {
        const lastSelectedType = localStorage.getItem("lastSelectedType")

        if (lastSelectedType && isEventType(lastSelectedType)) {
            navigate(`/${lastSelectedType}/events`, {replace: true})
        }

    }, [navigate]);


    return <div className={classes.page}>
        <Typography type={"title2"} value={"Выберите события"}/>

        <div className={classes.types}>
            {
                EVENT_TYPES.map((eventType) => <EventType type={eventType} key={eventType}/>)
            }
        </div>
    </div>
}

export {RootPage}