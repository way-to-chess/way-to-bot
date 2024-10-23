import { EUserRole } from "@enums";
import { User } from "@entities/user.entity";

export interface IUserCreatePayload {
  username: string;
  firstName: string;
  lastName: string;
  roles?: EUserRole[];
  photoId?: number;
}

export interface IUserUpdatePayload
  extends Partial<Omit<User, "createdAt" | "updatedAt" | "winRate" | "photo">> {
  photoId?: number;
}
