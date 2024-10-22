import { eventsSlice } from "../../Store/Events/EventsSlice.ts";
import { useAppDispatch } from "../../Hooks/UseAppDispatch.ts";
import {
  ISingleEventTeamFromFinishValues,
  ISingleEventTeamFromInitialValues,
  SingleEventTeamPageFactory,
} from "./SingleEventTeamPageFactory.tsx";
import { RequestStatusToComponent } from "../../Components/RequestStatusToComponent.tsx";
import { withProps } from "../../Utils/WithProps.ts";
import { CREATE_EVENT_TEAM_REQUEST_SYMBOL } from "../../Store/Events/EventsVariables.ts";

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
