import { withProps } from "../../../Utils/WithProps.ts";
import { RequestStatusToComponent } from "../../../Components/RequestStatusToComponent.tsx";
import { UPDATE_EVENT_GAME_REQUEST_SYMBOL } from "../../../Store/Events/EventsVariables.ts";
import {
  type ISingleEventGameFormFinishValues,
  type ISingleEventGameFormInitialValues,
  SingleEventGameForm,
} from "./SingleEventGameForm.tsx";
import { useDispatch } from "react-redux";
import { eventsSlice } from "../../../Store/Events/EventsSlice.ts";
import { useParams } from "react-router-dom";
import { useAppSelector } from "../../../Hooks/UseAppSelector.ts";

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
