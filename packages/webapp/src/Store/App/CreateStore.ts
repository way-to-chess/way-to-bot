import { Action, configureStore } from "@reduxjs/toolkit";
import { userSlice } from "../User/UserSlice";
import { appEpic } from "./Epics/AppEpic";
import { createEpicMiddleware } from "redux-observable";
import { httpApi } from "@way-to-bot/shared/utils/HttpApi/HttpApi";
import {
  createRouterMiddleware,
  createRouterReducerMapObject,
} from "@lagunovsky/redux-react-router";
import { createBrowserHistory } from "history";
import { locationsSlice } from "../Locations/LocationsSlice";
import { requestManagerSlice } from "../RequestManager/RequestManagerSlice";
import { eventsSlice } from "../Events/EventsSlice";
import { leaguesSlice } from "../Leagues/LeaguesSlice";
import { drawerSlice } from "../Drawer/DrawerSlice";
import { participateRequestSlice } from "../ParticipateRequest/ParticipateRequestSlice";
import { historyReducer } from "../Router/HistoryReducer";

const history = createBrowserHistory();
const routerMiddleware = createRouterMiddleware(history);

export const createStore = () => {
  const epicMiddleware = createEpicMiddleware<Action, Action, any, any>({
    dependencies: { httpApi },
  });

  const store = configureStore({
    reducer: {
      ...createRouterReducerMapObject(history),
      user: userSlice.reducer,
      locations: locationsSlice.reducer,
      requestManager: requestManagerSlice.reducer,
      events: eventsSlice.reducer,
      leagues: leaguesSlice.reducer,
      drawer: drawerSlice.reducer,
      [participateRequestSlice.name]: participateRequestSlice.reducer,
      history: historyReducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().prepend(routerMiddleware).concat(epicMiddleware),
  });

  epicMiddleware.run(appEpic);

  return store;
};

const store = createStore();

type AppState = ReturnType<typeof store.getState>;
type AppDispatch = typeof store.dispatch;

export { store, history };
export type { AppState, AppDispatch };
