import { withProps } from "../../../Utils/WithProps";
import { RequestStatusToComponent } from "../../../Components/RequestStatusToComponent";
import { UPDATE_EVENT_GAME_REQUEST_SYMBOL } from "../../../Store/Events/EventsVariables";
import {
  type ISingleEventGameFormFinishValues,
  type ISingleEventGameFormInitialValues,
  SingleEventGameForm,
} from "./SingleEventGameForm";
import { useDispatch } from "react-redux";
import { eventsSlice } from "../../../Store/Events/EventsSlice";
import { useParams } from "react-router-dom";
import { useAppSelector } from "../../../Hooks/UseAppSelector";

const UpdateSingleEventGamePageIdle = () => {
  const dispatch = useDispatch();
  const { gameId } = useParams();
  const id = Number(gameId);

  const game = useAppSelector((state) =>
    eventsSlice.selectors.singleEventGameByIdNotNil(state, id),
  );

  const onFinish = (values: ISingleEventGameFormFinishValues) => {
    console.log(values);
    dispatch(
      eventsSlice.actions.updateSingleEventGame({
        ...values,
        id,
      }),
    );
  };

  const initialValues: ISingleEventGameFormInitialValues = {
    name: game.name,
    teamIds: game.gameTeams.map(({ team }) => team.id),
  };

  return (
    <SingleEventGameForm onFinish={onFinish} initialValues={initialValues} />
  );
};

const UpdateSingleEventGamePage = withProps(RequestStatusToComponent)({
  IDLE: UpdateSingleEventGamePageIdle,
  requestSymbol: UPDATE_EVENT_GAME_REQUEST_SYMBOL,
  backButtonPath: "../../..",
});

export { UpdateSingleEventGamePage };
