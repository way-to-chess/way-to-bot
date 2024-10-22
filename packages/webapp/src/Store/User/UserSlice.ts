import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { type TUser } from "../../Models/TUser.ts";
import {
  TUserInitResponse,
  TUserInitResponseData,
  TUserUpdatePayload,
} from "../../../../src/types/user.types.ts";
import { IWithError } from "../../Models/IError.ts";

import { ERequestStatus } from "../RequestManager/RequestManagerModels.ts";

interface IUserState {
  status: ERequestStatus;
  info: TUser | null;
  isNewUser: boolean;
  profilePage: TUser | null;
  error: string | null;
  profilePageStatus: ERequestStatus;
  profilePageError: string | null;
  updateStatus: ERequestStatus;
}

const initialState: IUserState = {
  status: ERequestStatus.idle,
  info: null,
  isNewUser: true,
  error: null,
  profilePage: null,
  profilePageError: null,
  profilePageStatus: ERequestStatus.idle,
  updateStatus: ERequestStatus.idle,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    started: (state) => {
      state.status = ERequestStatus.loading;
    },
    received: (
      state,
      { payload }: PayloadAction<TUserInitResponse | IWithError>,
    ) => {
      if ("error" in payload) {
        state.error = payload.error;
        state.status = ERequestStatus.error;

        return;
      }

      state.info = payload.data.user;
      state.status = ERequestStatus.success;
      state.isNewUser = payload.data.isNewUser;
    },
    profilePageStarted: (state) => {
      state.profilePageStatus = ERequestStatus.loading;
    },
    profilePageReceived: (
      state,
      { payload }: PayloadAction<TUserInitResponseData | IWithError>,
    ) => {
      if ("error" in payload) {
        state.profilePageError = payload.error;
        state.profilePageStatus = ERequestStatus.error;

        return;
      }

      state.profilePage = payload.user;
      state.profilePageStatus = ERequestStatus.success;
    },
    update: (state, _: PayloadAction<TUserUpdatePayload>) => {
      state.updateStatus = ERequestStatus.loading;
    },
    updateResult: (state, { payload }: PayloadAction<IWithError>) => {
      if ("error" in payload) {
        state.updateStatus = ERequestStatus.error;
        return;
      }
      state.updateStatus = ERequestStatus.success;
    },
    updateClear: (state) => {
      state.updateStatus = ERequestStatus.idle;
    },
  },
});

export { userSlice };
