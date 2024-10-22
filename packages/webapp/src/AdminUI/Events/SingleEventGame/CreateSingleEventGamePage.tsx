import { withProps } from "../../../Utils/WithProps";
import { RequestStatusToComponent } from "../../../Components/RequestStatusToComponent";
import { CREATE_EVENT_GAME_REQUEST_SYMBOL } from "../../../Store/Events/EventsVariables";
import {
  type ISingleEventGameFormFinishValues,
  type ISingleEventGameFormInitialValues,
  SingleEventGameForm,
} from "./SingleEventGameForm";
import { useDispatch } from "react-redux";
import { eventsSlice } from "../../../Store/Events/EventsSlice";

const initialValues: ISingleEventGameFormInitialValues = {
  name: "",
  teamIds: [],
};

const CreateSingleEventGamePageIdle = () => {
  const dispatch = useDispatch();

  const onFinish = (values: ISingleEventGameFormFinishValues) => {
    dispatch(eventsSlice.actions.createSingleEventGame(values));
  };

  return (
    <SingleEventGameForm onFinish={onFinish} initialValues={initialValues} />
  );
};

const CreateSingleEventGamePage = withProps(RequestStatusToComponent)({
  IDLE: CreateSingleEventGamePageIdle,
  requestSymbol: CREATE_EVENT_GAME_REQUEST_SYMBOL,
  backButtonPath: "../..",
});

export { CreateSingleEventGamePage };
