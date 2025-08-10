import {Typography} from "../../Typography/Typography";
import classes from "./Header.module.css";
import {ChevronDownIcon} from "lucide-react";
import {EVENT_TYPE_NAME_MAP, EVENT_TYPES, useEventType} from "../../Hooks/UseEventType";
import {BottomSheet} from "../../BottomSheet/BottomSheet";
import {Options} from "../../Options/Options";
import {useLocation, useNavigate} from "react-router";
import {EEventType} from "@way-to-bot/shared/api/enums/EEventType";
import {useBoolean} from "@way-to-bot/shared/utils/UseBoolean";
import {FC} from "react";

const OPTIONS = EVENT_TYPES.map((type) => ({
    value: type,
    title: EVENT_TYPE_NAME_MAP[type]
}))

const TypeSwitch: FC<{ eventType: EEventType }> = ({eventType}) => {
    const location = useLocation()
    const navigate = useNavigate();
    const [open, {setFalse, toggle}] = useBoolean()

    const handleTypeChange = (newType: EEventType) => {
        const pathSegments = location.pathname.split('/').filter(Boolean);

        const restPath = pathSegments.slice(1).join('/')

        const newPath = restPath
            ? `/${newType}/${restPath}`
            : `/${newType}`;

        navigate(newPath);
        setFalse()
    };

    const trigger = (
        <div className={classes.title}>
            <Typography type={"title2"} value={EVENT_TYPE_NAME_MAP[eventType]}/>

            <ChevronDownIcon size={24}/>
        </div>
    )

    return <>
        <header className={classes.header} id={"header"}>
            <BottomSheet open={open} trigger={trigger} title={"Сменить события"} onOpenChange={toggle}>
                <Options options={OPTIONS} value={eventType} onValueChange={handleTypeChange}/>
            </BottomSheet>
        </header>

    </>

}

const Header = () => {
    const eventType = useEventType()

    if (!eventType) {
        return null
    }

    return <TypeSwitch eventType={eventType}/>
}

export {Header}