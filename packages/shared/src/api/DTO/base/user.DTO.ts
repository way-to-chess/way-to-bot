import { IFileEntity } from "@way-to-bot/shared/api/interfaces/entities/file-entity.interface.js";
import { IUserEntity } from "@way-to-bot/shared/api/interfaces/entities/user-entity.interface.js";
import { EUserRole } from "../../enums/EUserRole.js";

export abstract class BaseDTOUser {
  readonly id: number;
  readonly username?: string | null;
  readonly firstName?: string | null;
  readonly lastName?: string | null;
  readonly email?: string | null;
  readonly phoneNumber?: string | null;
  readonly birthDate?: Date;
  readonly age?: number;
  readonly photo?: IFileEntity | null;
  readonly roles: EUserRole[];
  readonly wins: number;
  readonly draws: number;
  readonly losses: number;
  readonly total: number;
  readonly winRate: number;
  readonly rating: number;

  protected constructor(user: IUserEntity) {
    this.id = user.id;
    this.username = user.username;
    this.firstName = user.firstName;
    this.lastName = user.lastName;
    this.email = user.email;
    this.phoneNumber = user.phoneNumber;
    this.birthDate = user.birthDate;
    this.age = user.age;
    this.photo = user.photo;
    this.roles = user.roles;
    this.wins = user.wins;
    this.draws = user.draws;
    this.losses = user.losses;
    this.total = user.total;
    this.winRate = user.winRate;
    this.rating = user.rating;
  }
}
