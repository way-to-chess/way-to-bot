import { Action, configureStore } from "@reduxjs/toolkit";
import { userSlice } from "../User/UserSlice";
import { appEpic } from "./Epics/AppEpic";
import { createEpicMiddleware } from "redux-observable";
import { httpApi } from "../../HttpApi/HttpApi";
import {
  createRouterMiddleware,
  createRouterReducerMapObject,
} from "@lagunovsky/redux-react-router";
import { createBrowserHistory } from "history";
import { locationsSlice } from "../Locations/LocationsSlice";
import { requestManagerSlice } from "../RequestManager/RequestManagerSlice";
import { eventsSlice } from "../Events/EventsSlice";
import { appSlice } from "./AppSlice";
import { leaguesApi, leaguesSlice } from "../Leagues/LeaguesSlice";
import { drawerSlice } from "../Drawer/DrawerSlice";

const history = createBrowserHistory();
const routerMiddleware = createRouterMiddleware(history);

export const createStore = () => {
  const epicMiddleware = createEpicMiddleware<Action, Action, any, any>({
    dependencies: { httpApi },
  });

  const store = configureStore({
    reducer: {
      ...createRouterReducerMapObject(history),
      app: appSlice.reducer,
      user: userSlice.reducer,
      locations: locationsSlice.reducer,
      requestManager: requestManagerSlice.reducer,
      events: eventsSlice.reducer,
      leagues: leaguesSlice.reducer,
      drawer: drawerSlice.reducer,
      [leaguesApi.reducerPath]: leaguesApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware()
        .prepend(routerMiddleware)
        .concat(epicMiddleware, leaguesApi.middleware),
  });

  epicMiddleware.run(appEpic);

  return store;
};

const store = createStore();

type AppState = ReturnType<typeof store.getState>;
type AppDispatch = typeof store.dispatch;

export { store, history };
export type { AppState, AppDispatch };
