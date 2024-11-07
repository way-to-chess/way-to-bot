import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  IUser,
  IUserCreatePayload,
  IUserDeletePayload,
  IUserUpdatePayload,
} from "@way-to-bot/shared/interfaces/user.interface";
import { IResponseWithData } from "@way-to-bot/shared/interfaces/response.interface";

interface IUserState {
  manageUsersDrawerVisible: boolean;
  users: IUser[];
}

const initialState: IUserState = {
  manageUsersDrawerVisible: false,
  users: [],
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    manageUsersDrawerVisibilityChanged: (
      state,
      { payload }: { payload: boolean },
    ) => {
      state.manageUsersDrawerVisible = payload;
    },
    usersReceived: (
      state,
      { payload }: PayloadAction<IResponseWithData<IUser[]>>,
    ) => {
      state.users = payload.data;
    },
    createUser: (_state, _action: PayloadAction<IUserCreatePayload>) => {},
    deleteUser: (_state, _action: PayloadAction<IUserDeletePayload>) => {},
    updateUser: (_state, _action: PayloadAction<IUserUpdatePayload>) => {},
  },
  selectors: {
    manageUsersDrawerVisible: (sliceState) =>
      sliceState.manageUsersDrawerVisible,
    users: (sliceState) => sliceState.users,
    userById: (sliceState, userId: number) =>
      sliceState.users.find((it) => it.id === userId),
  },
});

export { userSlice };
