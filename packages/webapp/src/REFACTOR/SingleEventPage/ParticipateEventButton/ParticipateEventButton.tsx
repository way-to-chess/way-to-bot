import {Button} from "../../../Button/Button";
import classes from "./ParticipateEventButton.module.css";
import {memo} from "react";
import {eventApi} from "../../Event/EventApi";

interface IWithEventId {
    eventId: string
}

const ParticipateEventButton = memo<IWithEventId>(({eventId}) => {
    const {data} = eventApi.useGetEventByIdQuery(eventId)

    console.log(data, 123)

    return <Button className={classes.button} disabled>
        {"Участвовать"}
    </Button>
})

export {ParticipateEventButton}