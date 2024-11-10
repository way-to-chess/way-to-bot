import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  ILocationCreatePayload,
  ILocationDeletePayload,
  ILocationUpdatePayload,
} from "@way-to-bot/shared/interfaces/location.interface";
import { IResponseWithData } from "@way-to-bot/shared/interfaces/response.interface";
import { LocationEntity } from "@way-to-bot/shared/entities/location.entity";

interface ILocationsState {
  locations: LocationEntity[];
  manageLocationsDrawerVisible: boolean;
}

const initialState: ILocationsState = {
  locations: [],
  manageLocationsDrawerVisible: false,
};

const locationsSlice = createSlice({
  name: "locations",
  initialState,
  reducers: {
    updateLocation: (_, __: PayloadAction<ILocationUpdatePayload>) => {},
    createLocation: (_, __: PayloadAction<ILocationCreatePayload>) => {},
    deleteLocation: (_, __: PayloadAction<ILocationDeletePayload>) => {},
    locationsReceived: (
      state,
      { payload }: PayloadAction<IResponseWithData<LocationEntity[]>>,
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
