import { createSlice } from "@reduxjs/toolkit";
import { authApi } from "./authApi";
import { AuthDTO } from "../api/DTO/common/auth.DTO";
import { TExtractData } from "../interfaces/utility.interface";

interface IAuthState {
  authByTelegram: TExtractData<AuthDTO> | null;
}

interface IWithAuthState {
  auth: IAuthState;
}

const initialState: IAuthState = {
  authByTelegram: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addMatcher(
      authApi.endpoints.authByTelegram.matchFulfilled,
      (state, { payload }) => {
        state.authByTelegram = payload;
      },
    );
  },
  selectors: {
    isAuthorizedByTg: (sliceState) => !!sliceState.authByTelegram,
    token: (sliceState) => sliceState.authByTelegram?.token,
    id: (sliceState) => sliceState.authByTelegram?.id,
  },
});

export { authSlice, type IWithAuthState };
