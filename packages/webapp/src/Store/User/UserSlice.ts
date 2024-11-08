import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  IUser,
  IUserCreatePayload,
  IUserDeletePayload,
  IUserUpdatePayload,
} from "@way-to-bot/shared/interfaces/user.interface";
import { IResponseWithData } from "@way-to-bot/shared/interfaces/response.interface";
import { EUserRole } from "@way-to-bot/shared/enums";

interface IUserState {
  manageUsersDrawerVisible: boolean;
  users: IUser[];
  user: IUser | null;
}

const initialState: IUserState = {
  manageUsersDrawerVisible: false,
  users: [
    {
      id: 3,
      username: "@Roman_Comandorb",
      firstName: "Роман",
      lastName: "Радюш",
      roles: ["admin", "user"],
      photo: null,
      wins: 0,
      losses: 0,
      draws: 0,
      total: 0,
      winRate: 0,
      rating: 0,
      createdAt: "2024-11-03T19:16:44.474Z",
      updatedAt: "2024-11-03T19:16:44.474Z",
    },
    {
      id: 1,
      username: "@Traktirwik",
      firstName: "Игнат",
      lastName: "Мустафин",
      roles: ["admin", "user"],
      photo: null,
      wins: 0,
      losses: 0,
      draws: 0,
      total: 0,
      winRate: 0,
      rating: 0,
      createdAt: "2024-11-03T18:03:07.402Z",
      updatedAt: "2024-11-03T18:03:07.402Z",
    },
    {
      id: 4,
      username: "@pavlin_L",
      firstName: "Павел",
      lastName: "Лазюк",
      roles: ["admin", "user"],
      photo: null,
      wins: 0,
      losses: 0,
      draws: 0,
      total: 0,
      winRate: 0,
      rating: 0,
      createdAt: "2024-11-03T19:17:25.111Z",
      updatedAt: "2024-11-03T19:17:25.111Z",
    },
    {
      id: 2,
      username: "@privetenn",
      firstName: "Александр",
      lastName: "Михнюк",
      roles: ["admin", "user"],
      photo: null,
      wins: 0,
      losses: 0,
      draws: 0,
      total: 0,
      winRate: 0,
      rating: 0,
      createdAt: "2024-11-03T19:15:34.916Z",
      updatedAt: "2024-11-03T19:15:34.916Z",
    },
    {
      id: 6,
      username: "@test",
      firstName: "Алексей",
      lastName: "Готен",
      roles: ["user"],
      photo: null,
      wins: 0,
      losses: 0,
      draws: 0,
      total: 0,
      winRate: 0,
      rating: 0,
      createdAt: "2024-11-07T20:09:17.255Z",
      updatedAt: "2024-11-07T20:09:17.255Z",
    },
  ],
  user: {
    roles: [EUserRole.ADMIN],
  },
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
    userReceived: (
      state,
      { payload }: PayloadAction<IResponseWithData<IUser>>,
    ) => {
      state.user = payload.data;
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
    userHasAccessRoles: (sliceState, roles: EUserRole[]) => {
      const userRoles = sliceState.user?.roles;
      if (!userRoles) {
        return false;
      }

      return roles.some((role) => userRoles.includes(role));
    },
  },
});

export { userSlice };
