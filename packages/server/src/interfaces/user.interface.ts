import { UserEntity } from "../database/entities/user.entity";

export interface IUserCreatePayload
  extends Pick<
    UserEntity,
    "username" | "tgId" | "firstName" | "lastName" | "roles"
  > {
  fileId?: number;
}

export interface IUserUpdatePayload
  extends Partial<
    Omit<
      UserEntity,
      | "createdAt"
      | "updatedAt"
      | "winRate"
      | "photo"
      | "total"
      | "eventsUsersLeagues"
      | "participateRequests"
    >
  > {
  id: number;
  fileId?: number | null;
}

export interface IUserDeletePayload {
  userId: number;
}

export type TUserGetByTgInfoQueryPayload = {
  tgId?: number;
  username?: string;
};
