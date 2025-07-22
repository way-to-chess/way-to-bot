import {Button} from "../../Button/Button";
import classes from "./ParticipateEventButton.module.css";
import {FC, memo} from "react";
import {eventApi} from "../../Store/Event/EventApi";
import {useSelector} from "react-redux";
import {authSlice} from "@way-to-bot/shared/redux/authSlice";
import {participateRequestApi} from "../../Store/ParticipateRequest/ParticipateRequestApi";
import {EEventStatus} from "@way-to-bot/shared/api/enums/EEventStatus";
import {HasRequestView} from "./HasRequestView";
import {CreateRequestForm} from "./CreateRequestForm";

interface IWithEventId {
    eventId: string;
}


const Participate: FC<{ authId: number } & IWithEventId> = ({eventId}) => {
    const {data, isLoading} = participateRequestApi.useGetAllParticipateRequestsQuery();

    const lastRequest = data?.find(
        (request) => String(request.eventId) === eventId,
    );

    if (isLoading) {
        return null;
    }

    return lastRequest ? <HasRequestView {...lastRequest}/> : <CreateRequestForm eventId={eventId}/>
};

const ParticipateEventButton = memo<IWithEventId>(({eventId}) => {
    const {data: event} = eventApi.useGetEventByIdQuery(eventId);
    const authId = useSelector(authSlice.selectors.id);

    if (event?.status !== EEventStatus.WAITING) {
        return null;
    }

    if (event.host.id === authId) {
        return null;
    }

    if (event.users.length >= Number(event.participantsLimit)) {
        return null;
    }

    if (!authId) {
        return (
            <Button
                as={"link"}
                className={classes.button}
                value={"Создать профиль"}
                to={"/profile"}
            />
        );
    }

    return <Participate eventId={eventId} authId={authId}/>;
});

export {ParticipateEventButton};
