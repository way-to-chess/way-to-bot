import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { type TUser } from "../../Models/TUser";
import { IWithError } from "../../Models/IError";

import { ERequestStatus } from "../RequestManager/RequestManagerModels";
import {
  IUserCreatePayload,
  IUserDeletePayload,
} from "@way-to-bot/shared/interfaces/user.interface";

type TUserInitResponse = any;
type TUserInitResponseData = any;

interface IUserState {
  status: ERequestStatus;
  info: TUser | null;
  isNewUser: boolean;
  profilePage: TUser | null;
  error: string | null;
  profilePageStatus: ERequestStatus;
  profilePageError: string | null;
  updateStatus: ERequestStatus;

  manageUsersDrawerVisible: boolean;
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

  manageUsersDrawerVisible: false,
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
    update: (state) => {
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

    manageUsersDrawerVisibilityChanged: (
      state,
      { payload }: { payload: boolean },
    ) => {
      state.manageUsersDrawerVisible = payload;
    },
    createUser: (_state, _action: PayloadAction<IUserCreatePayload>) => {},
    deleteUser: (_state, _action: PayloadAction<IUserDeletePayload>) => {},
  },
  selectors: {
    manageUsersDrawerVisible: (sliceState) =>
      sliceState.manageUsersDrawerVisible,
  },
});

export { userSlice };
