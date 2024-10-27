import { createSlice } from "@reduxjs/toolkit";

interface IAppSlice {
  mainMenuDrawerVisible: boolean;
}

const APP_SLICE_INITIAL_STATE: IAppSlice = {
  mainMenuDrawerVisible: false,
};

const appSlice = createSlice({
  name: "app",
  initialState: APP_SLICE_INITIAL_STATE,
  reducers: {
    mainMenuDrawerVisibilityChanged: (
      state,
      { payload }: { payload: boolean },
    ) => {
      state.mainMenuDrawerVisible = payload;
    },
  },
  selectors: {
    mainMenuDrawerVisible: (sliceState) => sliceState.mainMenuDrawerVisible,
  },
});

export { appSlice };
