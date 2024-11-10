import {UserEntity} from "@way-to-bot/shared/entities/user.entity";

export interface IUserCreatePayload
    extends Partial<
        Omit<UserEntity, "id" | "createdAt" | "updatedAt" | "winRate" | "photo">
    > {
    fileId?: number;
}

export interface IUserUpdatePayload
    extends Partial<Omit<UserEntity, "createdAt" | "updatedAt" | "winRate" | "photo">> {
    id: number;
    fileId?: number | null;
}

export interface IUserDeletePayload {
    userId: number;
}
