import { IEventLeagueEntity } from "@way-to-bot/shared/api/interfaces/entities/event-league-entity.interface.js";

export class BaseDTOEventLeague {
  readonly id: number;
  readonly eventId: number;
  readonly leagueId: number;
  readonly link?: string | null;

  constructor(eventLeague: IEventLeagueEntity) {
    this.id = eventLeague.id;
    this.eventId = eventLeague.eventId;
    this.leagueId = eventLeague.leagueId;
    this.link = eventLeague.link ?? null;
  }
}
