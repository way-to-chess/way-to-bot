import { IFileEntity } from "@way-to-bot/shared/api/interfaces/entities/file-entity.interface.js";
import { EUserRole } from "@way-to-bot/shared/api/enums/index.js";
import { IUserEntity } from "@way-to-bot/shared/api/interfaces/entities/user-entity.interface.js";
import { TCommonContactInfo } from "@way-to-bot/shared/api/types/index.js";

export abstract class BaseDTOUser {
  readonly id: number;
  readonly firstName: string;
  readonly lastName: string;
  readonly photo?: IFileEntity | null;
  readonly roles: EUserRole[];
  readonly wins: number;
  readonly draws: number;
  readonly losses: number;
  readonly total: number;
  readonly winRate: number;
  readonly rating: number;
  readonly contactInfo: TCommonContactInfo[];

  protected constructor(user: IUserEntity) {
    this.id = user.id;
    this.firstName = user.firstName;
    this.lastName = user.lastName;
    this.photo = user.photo;
    this.roles = user.roles;
    this.wins = user.wins;
    this.draws = user.draws;
    this.losses = user.losses;
    this.total = user.total;
    this.winRate = user.winRate;
    this.rating = user.rating;
    this.contactInfo = user.contactInfo;
  }
}
