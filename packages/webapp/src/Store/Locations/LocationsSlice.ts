import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { IGetAllLocationsResponse } from "../../HttpApi/HttpApiTypes";
import { ERequestStatus } from "../RequestManager/RequestManagerModels";
import { ILocationCreatePayload } from "@way-to-bot/shared/interfaces/location.interface";

type Location = any;

interface ILocationsState {
  updateStatus: ERequestStatus;
  createStatus: ERequestStatus;
  data: Location[];

  manageLocationsDrawerVisible: boolean;
}

const initialState: ILocationsState = {
  updateStatus: ERequestStatus.idle,
  createStatus: ERequestStatus.idle,
  data: [],

  manageLocationsDrawerVisible: true,
};

const locationsSlice = createSlice({
  name: "locations",
  initialState,
  reducers: {
    received: (state, { payload }: PayloadAction<IGetAllLocationsResponse>) => {
      state.data = payload.locations;
    },
    update: (state) => {
      state.updateStatus = ERequestStatus.loading;
    },
    updateSuccess: (state) => {
      state.updateStatus = ERequestStatus.success;
    },
    updateError: (state) => {
      state.updateStatus = ERequestStatus.error;
    },
    updateClear: (state) => {
      state.updateStatus = ERequestStatus.idle;
    },
    createLocation: (_, __: PayloadAction<ILocationCreatePayload>) => {},
    createSuccess: (state) => {
      state.createStatus = ERequestStatus.success;
    },
    createError: (state) => {
      state.createStatus = ERequestStatus.error;
    },
    createClear: (state) => {
      state.createStatus = ERequestStatus.idle;
    },
    delete: () => {},

    manageLocationsDrawerVisibilityChanged: (
      state,
      { payload }: { payload: boolean },
    ) => {
      state.manageLocationsDrawerVisible = payload;
    },
  },
  selectors: {
    manageLocationsDrawerVisible: (sliceState) =>
      sliceState.manageLocationsDrawerVisible,
  },
});

export { locationsSlice };
