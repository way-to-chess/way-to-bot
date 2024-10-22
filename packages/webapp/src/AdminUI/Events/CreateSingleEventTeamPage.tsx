import { eventsSlice } from "../../Store/Events/EventsSlice";
import { useAppDispatch } from "../../Hooks/UseAppDispatch";
import {
  ISingleEventTeamFromFinishValues,
  ISingleEventTeamFromInitialValues,
  SingleEventTeamPageFactory,
} from "./SingleEventTeamPageFactory";
import { RequestStatusToComponent } from "../../Components/RequestStatusToComponent";
import { withProps } from "../../Utils/WithProps";
import { CREATE_EVENT_TEAM_REQUEST_SYMBOL } from "../../Store/Events/EventsVariables";

const initialValues: ISingleEventTeamFromInitialValues = {
  name: "",
  participantIds: [],
};

const CreateSingleEventTeamPageIdle = () => {
  const dispatch = useAppDispatch();
  const onFinish = (values: ISingleEventTeamFromFinishValues) => {
    dispatch(eventsSlice.actions.createSingleEventTeam(values));
  };

  return (
    <SingleEventTeamPageFactory
      onFinish={onFinish}
      initialValues={initialValues}
    />
  );
};

const CreateSingleEventTeamPage = withProps(RequestStatusToComponent)({
  requestSymbol: CREATE_EVENT_TEAM_REQUEST_SYMBOL,
  IDLE: CreateSingleEventTeamPageIdle,
  backButtonPath: "../..",
});

export { CreateSingleEventTeamPage };
