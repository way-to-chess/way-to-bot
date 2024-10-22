import {EventFormFactory} from "./EventFormFactory";
import {eventsSlice} from "../../Store/Events/EventsSlice";
import {useDispatch, useSelector} from "react-redux";
import {withProps} from "../../Utils/WithProps";
import {RequestStatusToComponent} from "../../Components/RequestStatusToComponent";
import {EVENTS_GET_BY_ID_REQUEST_SYMBOL} from "../../Store/Events/EventsVariables";
import {IEventFormFinishValues} from "./EventsCommon";
import {WEBAPP_ROUTES} from "@way-to-bot/shared/src/constants/webappRoutes";

const UpdateEventFormSuccess = () => {
    const {
        location,
        status,
        dateTime,
        price,
        description,
        participantsLimit,
        id,
    } = useSelector(eventsSlice.selectors.singleEventNotNil);

    const dispatch = useDispatch();

    const onFinish = (values: IEventFormFinishValues) => {
        dispatch(eventsSlice.actions.update({...values, id}));
    };

    return (
        <EventFormFactory
            initialValues={{
                location,
                status,
                dateTime,
                price,
                description,
                participantsLimit,
            }}
            onFinish={onFinish}
            backPath={WEBAPP_ROUTES.manageEventsRoute}
        />
    );
};

const UpdateEventForm = withProps(RequestStatusToComponent)({
    requestSymbol: EVENTS_GET_BY_ID_REQUEST_SYMBOL,
    SUCCESS: UpdateEventFormSuccess,
});

export {UpdateEventForm};
