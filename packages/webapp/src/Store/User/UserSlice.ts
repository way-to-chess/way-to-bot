import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  IUser,
  IUserCreatePayload,
  IUserDeletePayload,
  IUserUpdatePayload,
} from "@way-to-bot/shared/interfaces/user.interface";
import { IResponseWithData } from "@way-to-bot/shared/interfaces/response.interface";
import { EUserRole } from "@way-to-bot/shared/enums";
import { getUserFullName } from "@way-to-bot/shared/utils/GetUserFullName";
import { EUserSortType } from "../../Models/EUserSortType";
import { ESortDirection } from "../../Models/ESortDirection";

interface IUserState {
  users: IUser[];
  user: IUser | null;
  sortType: EUserSortType;
  sortDirection: ESortDirection;
  search: string;
}

const initialState: IUserState = {
  users: [],
  user: null,
  sortType: EUserSortType.rating,
  sortDirection: ESortDirection.desc,
  search: "",
};

const selectUser = (state: IUserState) => state.user;

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    usersReceived: (
      state,
      { payload }: PayloadAction<IResponseWithData<IUser[] | IUser>>,
    ) => {
      state.users = Array.isArray(payload.data) ? payload.data : [payload.data];
    },
    userReceived: (
      state,
      { payload }: PayloadAction<IResponseWithData<IUser>>,
    ) => {
      state.user = payload.data;
      state.users.push(payload.data);
    },
    clearUser: (state: IUserState) => {
      state.user = null;
    },
    createUser: (_state, _action: PayloadAction<IUserCreatePayload>) => {},
    deleteUser: (_state, _action: PayloadAction<IUserDeletePayload>) => {},
    updateUser: (_state, _action: PayloadAction<IUserUpdatePayload>) => {},
    changeSortType: (state, { payload }: PayloadAction<EUserSortType>) => {
      state.sortType = payload;
    },
    changeSortDirection: (
      state,
      { payload }: PayloadAction<ESortDirection>,
    ) => {
      state.sortDirection = payload;
    },
    changeSearch: (state, { payload }: PayloadAction<string>) => {
      state.search = payload;
    },
  },
  selectors: {
    sortType: (sliceState) => sliceState.sortType,
    sortDirection: (sliceState) => sliceState.sortDirection,
    users: (sliceState) => sliceState.users,
    userById: (sliceState, userId: number) =>
      sliceState.users.find((it) => it.id === userId),
    userHasAccessRoles: (sliceState, roles: EUserRole[], exact = false) => {
      const userRoles = selectUser(sliceState)?.roles;
      if (!userRoles) {
        return false;
      }

      return roles.some((role) => userRoles.includes(role));
    },
    userId: (sliceState) => selectUser(sliceState)?.id,
    user: (sliceState) => selectUser(sliceState),
    userFullName: (sliceState) => {
      const user = selectUser(sliceState);

      if (!user) {
        return null;
      }

      return getUserFullName(user.firstName, user.lastName);
    },
    search: (sliceState) => sliceState.search,
    userExists: (sliceState) => !!selectUser(sliceState),
  },
});

export { userSlice };
