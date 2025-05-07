import { IEventLeagueUserEntity } from "@way-to-bot/shared/api/interfaces/entities/event-league-user-entity.interface.js";

export class BaseDTOEventLeagueUser {
  readonly id: number;
  readonly userId: number;
  readonly eventLeagueId: number;
  readonly place?: number | null;
  readonly points?: number | null;

  constructor(entity: IEventLeagueUserEntity) {
    this.id = entity.id;
    this.userId = entity.userId;
    this.eventLeagueId = entity.eventLeagueId;
    this.place = entity.place;
    this.points = entity.points;
  }
}
