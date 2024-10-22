import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { IGetAllLocationsResponse } from "../../HttpApi/HttpApiTypes";
import { ERequestStatus } from "../RequestManager/RequestManagerModels";

type Location = any;

interface ILocationsState {
  updateStatus: ERequestStatus;
  createStatus: ERequestStatus;
  data: Location[];
}

const initialState: ILocationsState = {
  updateStatus: ERequestStatus.idle,
  createStatus: ERequestStatus.idle,
  data: [],
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
    create: (state) => {
      state.createStatus = ERequestStatus.loading;
    },
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
  },
});

export { locationsSlice };
