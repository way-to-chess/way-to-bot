import { EUserRole } from "packages/shared/src/enums";
import { User } from "packages/server/src/database/entities/user.entity";

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
