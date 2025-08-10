import classes from "./RootPage.module.css";
import {Typography} from "../Typography/Typography";
import {EEventType} from "@way-to-bot/shared/api/enums/EEventType";
import {Link} from "react-router";
import {FC} from "react";
import {ChevronRightIcon} from "lucide-react";
import {EVENT_TYPE_NAME_MAP, EVENT_TYPES} from "../Hooks/UseEventType";


interface IEventTypeProps {
    type: EEventType,
}

const EventType: FC<IEventTypeProps> = ({type}) => {
    const to = `/${type}/events`

    const title = EVENT_TYPE_NAME_MAP[type]

    return <Link to={to} className={classes.type}>

        <Typography type={"title4"} value={title} className={classes.typeTitle}/>

        <ChevronRightIcon/>
    </Link>
}


const RootPage = () => {
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