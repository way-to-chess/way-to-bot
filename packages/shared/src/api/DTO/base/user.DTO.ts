import { IFileEntity } from "@way-to-bot/shared/api/interfaces/entities/file-entity.interface.js";
import { EUserRole } from "@way-to-bot/shared/api/enums/index.js";
import { IUserEntity } from "@way-to-bot/shared/api/interfaces/entities/user-entity.interface.js";

export abstract class BaseDTOUser {
  id: number;
  firstName: string;
  lastName: string;
  photo?: IFileEntity | null;
  roles: EUserRole[];
  wins: number;
  draws: number;
  losses: number;
  total: number;
  winRate: number;
  rating: number;

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
  }
}
