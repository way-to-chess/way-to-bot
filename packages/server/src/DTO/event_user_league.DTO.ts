import { EventUserLeagueEntity } from "../database/entities/events_users_leagues";
import { UserEntity } from "../database/entities/user.entity";
import { LeagueEntity } from "../database/entities/league.entity";

export class UserLeagueDTO {
  user: UserEntity;
  league: LeagueEntity;
  constructor(eul: EventUserLeagueEntity) {
    this.user = eul.user;
    this.league = eul.league;
  }
}
