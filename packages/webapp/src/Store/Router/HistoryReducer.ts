import { ROUTER_ON_LOCATION_CHANGED } from "@lagunovsky/redux-react-router/src";
import { Action, UnknownAction } from "@reduxjs/toolkit";

interface IHistoryItem {
  location: Location & { state: { fromBackButton?: boolean } };
  action: Action;
}

interface IHistoryState {
  stack: IHistoryItem[];
}

interface IWithHistoryState {
  history: IHistoryState;
}

const historyInitialState: IHistoryState = {
  stack: [],
};

const historyReducer = (
  state = historyInitialState,
  action: UnknownAction,
): IHistoryState => {
  if (action.type === ROUTER_ON_LOCATION_CHANGED) {
    const payload = action.payload as IHistoryItem;

    if (payload.location.state?.fromBackButton) {
      return {
        ...state,
        stack: state.stack.slice(0, -1),
      };
    }

    const stack = state.stack.length > 5 ? state.stack.slice(1) : state.stack;

    return {
      ...state,
      stack: [...stack, payload],
    };
  }

  return state as IHistoryState;
};

const selectHistoryStack = (state: IWithHistoryState) => state.history.stack;

export { historyReducer, selectHistoryStack };
