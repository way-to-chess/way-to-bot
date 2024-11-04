import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ERequestStatus } from "../RequestManager/RequestManagerModels";
import {
  ILocation,
  ILocationCreatePayload,
} from "@way-to-bot/shared/interfaces/location.interface";
import { IResponseWithData } from "@way-to-bot/shared/interfaces/response.interface";

interface ILocationsState {
  updateStatus: ERequestStatus;
  createStatus: ERequestStatus;
  locations: ILocation[];

  manageLocationsDrawerVisible: boolean;
}

const initialState: ILocationsState = {
  updateStatus: ERequestStatus.idle,
  createStatus: ERequestStatus.idle,
  locations: [],

  manageLocationsDrawerVisible: false,
};

const locationsSlice = createSlice({
  name: "locations",
  initialState,
  reducers: {
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

    createClear: (state) => {
      state.createStatus = ERequestStatus.idle;
    },
    delete: () => {},

    locationsReceived: (
      state,
      { payload }: PayloadAction<IResponseWithData<ILocation[]>>,
    ) => {
      state.locations = payload.data;
    },
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
    locations: (sliceState) => sliceState.locations,
  },
});

export { locationsSlice };
