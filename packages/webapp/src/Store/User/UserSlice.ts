import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  IUserCreatePayload,
  IUserDeletePayload,
  IUserUpdatePayload,
} from "@way-to-bot/shared/interfaces/user.interface";
import { IResponseWithData } from "@way-to-bot/shared/interfaces/response.interface";
import { EUserRole } from "@way-to-bot/shared/enums";
import { getUserFullName } from "../../Utils/GetUserFullName";
import { UserEntity } from "@way-to-bot/shared/entities/user.entity";

interface IUserState {
  users: UserEntity[];
  user: UserEntity | null;
}

const initialState: IUserState = {
  users: [],
  user: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    usersReceived: (
      state,
      { payload }: PayloadAction<IResponseWithData<UserEntity[] | UserEntity>>,
    ) => {
      state.users = Array.isArray(payload.data) ? payload.data : [payload.data];
    },
    userReceived: (
      state,
      { payload }: PayloadAction<IResponseWithData<UserEntity>>,
    ) => {
      state.user = payload.data;
    },
    createUser: (_state, _action: PayloadAction<IUserCreatePayload>) => {},
    deleteUser: (_state, _action: PayloadAction<IUserDeletePayload>) => {},
    updateUser: (_state, _action: PayloadAction<IUserUpdatePayload>) => {},
  },
  selectors: {
    users: (sliceState) => sliceState.users,
    userById: (sliceState, userId: number) =>
      sliceState.users.find((it) => it.id === userId),
    userHasAccessRoles: (sliceState, roles: EUserRole[], exact = false) => {
      const userRoles = sliceState.user?.roles;
      if (!userRoles) {
        return false;
      }

      return roles.some((role) => userRoles.includes(role));
    },
    userId: (sliceState) => sliceState.user?.id,
    userFullName: (sliceState) => {
      if (!sliceState.user) {
        return null;
      }

      return getUserFullName(
        sliceState.user.firstName,
        sliceState.user.lastName,
      );
    },
  },
});

export { userSlice };
