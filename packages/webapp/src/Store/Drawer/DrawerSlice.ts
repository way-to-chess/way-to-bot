import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { leaguesApi } from "../Leagues/LeaguesSlice";

enum EDrawerType {
  MANAGE_USERS_DRAWER = "manageUsersDrawer",
  MANAGE_EVENTS_DRAWER = "manageEventsDrawer",
  MANAGE_EVENT_USERS_DRAWER = "manageEventUsersDrawer",
  MANAGE_LOCATIONS_DRAWER = "manageLocationsDrawer",
  MANAGE_LEAGUES_DRAWER = "manageLeaguesDrawer",
}

type TDrawersMap = Record<EDrawerType, any>;

interface IDrawerSliceState {
  drawersMap: TDrawersMap;
}

interface IDrawerAction<D> {
  drawerType: EDrawerType;
  data?: D;
}

const initialState: IDrawerSliceState = {
  drawersMap: {} as TDrawersMap,
};

const CLOSE_DRAWER_AFTER_ACTION = [
  [
    leaguesApi.endpoints.createLeague.matchFulfilled,
    EDrawerType.MANAGE_LEAGUES_DRAWER,
  ],
  [
    leaguesApi.endpoints.updateLeague.matchFulfilled,
    EDrawerType.MANAGE_LEAGUES_DRAWER,
  ],
] as const;

const drawerSlice = createSlice({
  name: "drawer",
  initialState,
  reducers: {
    openDrawer: <D>(
      state: IDrawerSliceState,
      { payload }: PayloadAction<IDrawerAction<D>>,
    ) => {
      state.drawersMap[payload.drawerType] = payload.data ?? null;
    },
    closeDrawer: (
      state,
      { payload }: PayloadAction<IDrawerAction<undefined>>,
    ) => {
      delete state.drawersMap[payload.drawerType];
    },
  },
  extraReducers: (builder) => {
    CLOSE_DRAWER_AFTER_ACTION.forEach(([action, drawerType]) => {
      builder.addMatcher(action, (state) => {
        delete state.drawersMap[drawerType];
      });
    });
  },
  selectors: {
    drawerData: (sliceState, drawerType: EDrawerType) =>
      sliceState.drawersMap[drawerType],
    drawerOpen: (sliceState, drawerType: EDrawerType) => {
      return drawerType in sliceState.drawersMap;
    },
  },
});

export { drawerSlice, EDrawerType };
