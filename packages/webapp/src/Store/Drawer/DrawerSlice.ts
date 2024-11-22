import { createSlice, PayloadAction } from "@reduxjs/toolkit";

enum EDrawerType {
  MANAGE_USERS_DRAWER = "manageUsersDrawer",
  MANAGE_EVENTS_DRAWER = "manageEventsDrawer",
  MANAGE_EVENT_USERS_DRAWER = "manageEventUsersDrawer",
  MANAGE_LOCATIONS_DRAWER = "manageLocationsDrawer",
  MANAGE_LEAGUES_DRAWER = "manageLeaguesDrawer",
  SORT_USERS_DRAWER = "sortUsersDrawer",
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
  selectors: {
    drawerData: (sliceState, drawerType: EDrawerType) =>
      sliceState.drawersMap[drawerType],
    drawerOpen: (sliceState, drawerType: EDrawerType) => {
      return drawerType in sliceState.drawersMap;
    },
  },
});

export { drawerSlice, EDrawerType };
