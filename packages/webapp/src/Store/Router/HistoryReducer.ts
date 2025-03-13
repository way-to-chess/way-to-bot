import { ROUTER_ON_LOCATION_CHANGED } from "@lagunovsky/redux-react-router/src";
import { Action, UnknownAction } from "@reduxjs/toolkit";

interface IHistoryItem {
  location: Location & { state: { fromBackButton?: boolean } };
  action: Action;
}

interface IHistoryState {
  history: {
    stack: IHistoryItem[];
  };
}

const historyInitialState: IHistoryState = {
  history: {
    stack: [],
  },
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
        history: {
          ...state.history,
          stack: state.history.stack.slice(0, -1),
        },
      };
    }

    return {
      ...state,
      history: {
        ...state.history,
        stack: [...state.history.stack, payload],
      },
    };
  }

  return state as IHistoryState;
};

const selectHistoryStack = (state: IHistoryState) => state.history.stack;

export { historyReducer, selectHistoryStack };
