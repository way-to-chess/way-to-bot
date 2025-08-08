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


const Participate: FC<IWithEventId> = ({eventId}) => {
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

    if (event.participantsCount >= Number(event.participantsLimit)) {
        return null;
    }

    return <Participate eventId={eventId}/>;
});

export {ParticipateEventButton};
