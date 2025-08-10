import {useParams} from "react-router";
import {EEventType} from "@way-to-bot/shared/api/enums/EEventType";

const EVENT_TYPES = Object.values(EEventType)

const EVENT_TYPE_NAME_MAP: Record<EEventType, string> = {
    [EEventType.CHESS]: "Шахматы",
    [EEventType.FESTIVAL]: "Фестивали",
    [EEventType.OTHER]: "Другое"
}

const EVENT_TYPE_COLOR_MAP: Record<EEventType, string> = {
    [EEventType.CHESS]: "#007AFF",
    [EEventType.FESTIVAL]: "#FF8500",
    [EEventType.OTHER]: "#d36ae6"
}


const isEventType = (candidate: string | undefined): candidate is EEventType => {
    return EVENT_TYPES.includes(candidate as EEventType)
}

const useEventType = () => {
    const params = useParams()

    if (isEventType(params.type)) {
        return params.type

    }
    return null

}

export {useEventType, EVENT_TYPES, EVENT_TYPE_NAME_MAP, EVENT_TYPE_COLOR_MAP}
