import { useParams } from "react-router-dom";
import { eventsSlice } from "../../Store/Events/EventsSlice";
import { withProps } from "../../Utils/WithProps";
import { RequestStatusToComponent } from "../../Components/RequestStatusToComponent";
import { UPDATE_EVENT_TEAM_REQUEST_SYMBOL } from "../../Store/Events/EventsVariables";
import {
  ISingleEventTeamFromFinishValues,
  ISingleEventTeamFromInitialValues,
  SingleEventTeamPageFactory,
} from "./SingleEventTeamPageFactory";
import { useDispatch } from "react-redux";
import { useAppSelector } from "../../Hooks/UseAppSelector";

const UpdateSingleEventTeamPageIdle = () => {
  const { teamId } = useParams();

  const teamIdNum = Number(teamId);

  const team = useAppSelector((state) =>
    eventsSlice.selectors.singleEventTeamByIdNotNil(state, teamIdNum),
  );

  const dispatch = useDispatch();
  const onFinish = (values: ISingleEventTeamFromFinishValues) => {
    dispatch(
      eventsSlice.actions.updateSingleEventTeam({
        ...values,
        id: teamIdNum,
      }),
    );
  };

  const initialValues: ISingleEventTeamFromInitialValues = {
    name: team.name,
    participantIds: team.teamsParticipants.map((it) => it.participant.id),
  };

  return (
    <SingleEventTeamPageFactory
      initialValues={initialValues}
      onFinish={onFinish}
    />
  );
};

const UpdateSingleEventTeamPage = withProps(RequestStatusToComponent)({
  requestSymbol: UPDATE_EVENT_TEAM_REQUEST_SYMBOL,
  IDLE: UpdateSingleEventTeamPageIdle,
  backButtonPath: "../../..",
});

export { UpdateSingleEventTeamPage };
