import { EUserRole } from "@enums";
import { User } from "@entities/user.entity";

export interface IUserCreatePayload {
  username: string;
  firstName: string;
  lastName: string;
  roles?: EUserRole[];
  fileId?: number;
}

export interface IUserUpdatePayload
  extends Partial<Omit<User, "createdAt" | "updatedAt" | "winRate" | "photo">> {
  fileId?: number | null;
}

export interface IUserDeletePayload {
  userId: number;
}

export interface IUserByIdPayload {
  userId: number;
}
