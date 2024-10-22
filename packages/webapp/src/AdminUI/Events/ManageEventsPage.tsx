import {eventsSlice} from "../../Store/Events/EventsSlice";
import {useSelector} from "react-redux";
import {withProps} from "../../Utils/WithProps";
import {RequestStatusToComponent} from "../../Components/RequestStatusToComponent";
import {EVENTS_GET_ALL_REQUEST_SYMBOL} from "../../Store/Events/EventsVariables";
import {isEmpty} from "../../Utils/OneLineUtils";
import {Card, Empty, Flex} from "antd";
import {generatePath, Link} from "react-router-dom";
import {WEBAPP_ROUTES} from "@way-to-bot/shared/src/constants/webappRoutes";
import {FixedButton} from "../../Components/FixedButton";
import {EditOutlined, InfoCircleOutlined} from "@ant-design/icons";
import {FC} from "react";
import {TEvent} from "../../Models/TEvent";
import {getPreviewSrc} from "../../Utils/GetPreviewSrc";
import {DeleteButton} from "../../Components/DeleteButton";

const DELETE_EVENT_TITLE = "Delete Event?";

const ManageEventCard: FC<TEvent> = ({id, location}) => {
    return (
        <Card
            cover={<img alt="example" src={getPreviewSrc(location?.preview?.url)}/>}
            actions={[
                <Link
                    to={generatePath(WEBAPP_ROUTES.manageSingleEventRoute, {
                        eventId: id,
                    })}
                >
                    <InfoCircleOutlined key="info"/>
                </Link>,
                <Link
                    to={generatePath(WEBAPP_ROUTES.updateEventRoute, {
                        eventId: id,
                    })}
                >
                    <EditOutlined key="edit"/>
                </Link>,
                <DeleteButton
                    actionCreator={eventsSlice.actions.delete}
                    id={id}
                    title={DELETE_EVENT_TITLE}
                />,
            ]}
        >
            <Card.Meta title={location?.title} description={location?.address}/>
        </Card>
    );
};

const ManageEventsPageSuccess = () => {
    const events = useSelector(eventsSlice.selectors.edges);

    if (isEmpty(events)) {
        return (
            <>
                <Empty style={{paddingTop: 16}} description={"There are no events"}/>
                <Link to={WEBAPP_ROUTES.createEventRoute}>
                    <FixedButton/>
                </Link>
            </>
        );
    }

    return (
        <Flex vertical style={{padding: "16px 16px 62px"}} gap={16}>
            {events.map((event) => (
                <ManageEventCard {...event} key={event.id}/>
            ))}

            <Link to={WEBAPP_ROUTES.createEventRoute}>
                <FixedButton/>
            </Link>
        </Flex>
    );
};

const ManageEventsPage = withProps(RequestStatusToComponent)({
    requestSymbol: EVENTS_GET_ALL_REQUEST_SYMBOL,
    SUCCESS: ManageEventsPageSuccess,
});

export {ManageEventsPage};
