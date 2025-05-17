import {Button} from "../../../Button/Button";
import classes from "./ParticipateEventButton.module.css";
import {memo} from "react";
import {eventApi} from "../../Store/Event/EventApi";
import {EEventStatus} from "@way-to-bot/shared/api/enums";
import {BottomSheet} from "../../BottomSheet/BottomSheet";
import {webAppAuthApi} from "../../Store/WebAppAuthApi";

interface IWithEventId {
    eventId: string
}

const ParticipateEventButton = memo<IWithEventId>(({eventId}) => {
    const {data: event} = eventApi.useGetEventByIdQuery(eventId)
    const {data: tgAuth} = webAppAuthApi.useAuthByTelegramQuery()

    if (event?.status !== EEventStatus.WAITING) {
        return null
    }

    return <BottomSheet trigger={<Button className={classes.button} value={"Участвовать"}/>} title={"Участники заявки"}>
    </BottomSheet>

})

export {ParticipateEventButton}