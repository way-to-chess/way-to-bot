import { User } from "../database/entities/user.entity";

export interface IUserCreatePayload
  extends Partial<
    Omit<User, "id" | "createdAt" | "updatedAt" | "winRate" | "photo">
  > {
  fileId?: number;
}

export interface IUserUpdatePayload
  extends Partial<Omit<User, "createdAt" | "updatedAt" | "winRate" | "photo">> {
  id: number;
  fileId?: number | null;
}

export interface IUserDeletePayload {
  userId: number;
}
