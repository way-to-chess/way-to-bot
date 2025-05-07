import { ILeagueEntity } from "@way-to-bot/shared/api/interfaces/entities/league-entity.interface.js";

export class BaseDTOLeague {
  readonly id: number;
  readonly name: string;

  constructor(league: ILeagueEntity) {
    this.id = league.id;
    this.name = league.name;
  }
}
