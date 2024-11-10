import { EUserRole } from "../enums";
import { UserEntity } from "../entities/user.entity";

export interface IUserCreatePayload {
  username: string;
  firstName: string;
  lastName: string;
  roles?: EUserRole[];
  fileId?: number;
}

export interface IUserUpdatePayload
  extends Partial<
    Omit<UserEntity, "createdAt" | "updatedAt" | "winRate" | "photo">
  > {
  fileId?: number | null;
}

export interface IUserDeletePayload {
  userId: number;
}
